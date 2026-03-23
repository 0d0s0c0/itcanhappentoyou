import express from "express";
import { PrismaClient } from "@prisma/client";
import { fetchIncidents } from "./fetchIncidents";
import { categorizeIncidents, classifyUserReport } from "./categorize";

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

/**
 * GET /api/incidents?latitude=37.78&longitude=-122.41
 *
 * Returns incidents within ~50 square km of the given coordinates.
 * 50 sq km ≈ a circle of radius ~3.99 km, which we approximate as a
 * bounding box of ±0.036° latitude and ±0.045° longitude (at ~37.8°N).
 */
app.get("/api/incidents", async (req, res) => {
  const lat = parseFloat(req.query.latitude as string);
  const lng = parseFloat(req.query.longitude as string);

  if (isNaN(lat) || isNaN(lng)) {
    res.status(400).json({ error: "latitude and longitude query parameters are required" });
    return;
  }

  // ~50 sq km bounding box:
  // A square with area 50 km² has sides of √50 ≈ 7.07 km, so half-side ≈ 3.54 km
  // 1° latitude ≈ 111 km → 3.54 km ≈ 0.0319°
  // 1° longitude ≈ 111 * cos(lat) km → adjust for latitude
  const halfSideLatDeg = 3.54 / 111;
  const halfSideLngDeg = 3.54 / (111 * Math.cos((lat * Math.PI) / 180));

  try {
    const incidents = await prisma.incident.findMany({
      where: {
        latitude: {
          gte: lat - halfSideLatDeg,
          lte: lat + halfSideLatDeg,
        },
        longitude: {
          gte: lng - halfSideLngDeg,
          lte: lng + halfSideLngDeg,
        },
      },
      orderBy: { date: "desc" },
    });

    res.json({ count: incidents.length, incidents });
  } catch (err) {
    console.error("Error querying incidents:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/incidents
 * Body: { latitude: number, longitude: number, description: string }
 *
 * Uses AI to categorize and generate a title, then persists to the database.
 */
app.post("/api/incident", async (req, res) => {
  const { latitude, longitude, description } = req.body;

  if (typeof latitude !== "number" || typeof longitude !== "number") {
    res.status(400).json({ error: "latitude and longitude are required as numbers" });
    return;
  }
  if (!description || typeof description !== "string") {
    res.status(400).json({ error: "description is required as a string" });
    return;
  }

  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();
  const isClaude = provider === "claude" || provider === "anthropic";
  const apiKey = isClaude
    ? process.env.ANTHROPIC_API_KEY
    : process.env.GEMINI_API_KEY;

  try {
    let category = "uncategorized";
    let title = "User Report";

    if (apiKey) {
      const result = await classifyUserReport(description, apiKey);
      category = result.category;
      title = result.title;
    } else {
      console.warn("No AI API key set — using defaults for user report");
    }

    const incident = await prisma.incident.create({
      data: {
        date: new Date(),
        latitude,
        longitude,
        description,
        title,
        official: false,
        category,
      },
    });

    res.status(201).json({ incident });
  } catch (err) {
    console.error("Error creating user incident:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Startup: fetch incidents, categorize with Gemini, and seed the database.
 */
async function seedDatabase() {
  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();
  const isClaude = provider === "claude" || provider === "anthropic";
  const apiKey = isClaude
    ? process.env.ANTHROPIC_API_KEY
    : process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn(
      `⚠ ${isClaude ? "ANTHROPIC_API_KEY" : "GEMINI_API_KEY"} not set — using fallback keyword categorization`
    );
  }

  console.log("Fetching incidents from SF Gov API...");
  const rawIncidents = await fetchIncidents();
  console.log(`Fetched ${rawIncidents.length} incidents with coordinates`);

  console.log(`Categorizing incidents with ${isClaude ? "Claude" : "Gemini"}...`);
  const categoryMap = await categorizeIncidents(
    rawIncidents,
    apiKey || ""
  );
  console.log("Categorization complete");

  console.log("Storing incidents in database...");
  const records = rawIncidents
    .map((inc) => {
      const category = categoryMap.get(inc.row_id) || "uncategorized";
      const lat = parseFloat(inc.latitude);
      const lng = parseFloat(inc.longitude);
      const date = new Date(inc.incident_datetime);

      if (isNaN(lat) || isNaN(lng) || isNaN(date.getTime())) return null;

      return {
        date,
        latitude: lat,
        longitude: lng,
        description: inc.incident_description || "",
        title: inc.incident_category || "Unknown",
        official: true,
        category,
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  const result = await prisma.incident.createMany({ data: records });
  console.log(`Stored ${result.count} incidents in the database`);
}

async function main() {
  const shouldSeed = process.argv.includes("--seed");

  if (shouldSeed) {
    console.log("Seed flag detected — clearing and re-seeding database...");
    await prisma.incident.deleteMany();
    await seedDatabase();
  } else {
    console.log("Skipping seed (pass --seed to re-seed)");
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Try: http://localhost:${PORT}/api/incidents?latitude=37.7749&longitude=-122.4194`);
  });
}

main().catch((err) => {
  console.error("Startup failed:", err);
  process.exit(1);
});
