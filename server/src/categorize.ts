import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";
import type { RawIncident } from "./fetchIncidents";

async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelayMs = 1000
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      const isOverloaded =
        err instanceof Anthropic.APIError && err.status === 529;
      const isRateLimit =
        err instanceof Anthropic.APIError && err.status === 429;

      if ((isOverloaded || isRateLimit) && attempt < maxRetries) {
        const delay = baseDelayMs * 2 ** attempt;
        console.warn(`API overloaded/rate-limited, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      throw err;
    }
  }
  throw new Error("Unreachable");
}

const VALID_CATEGORIES = ["theft", "assault", "sex-related", "scam", "uncategorized"] as const;
export type Category = (typeof VALID_CATEGORIES)[number];

interface CategorizationResult {
  row_id: string;
  category: Category;
}

type AIProvider = "gemini" | "claude";

function getProvider(): AIProvider {
  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();
  if (provider === "claude" || provider === "anthropic") return "claude";
  return "gemini";
}

const CATEGORIZATION_PROMPT = `You are a crime categorization assistant. Categorize each incident into exactly one of these categories:
- "theft" (theft, burglary, robbery, larceny, stolen property)
- "assault" (assault, battery, weapons, attacks)
- "sex-related" (sex offenses, indecent exposure, human trafficking)
- "scam" (fraud, forgery, counterfeiting, embezzlement, con games)
- "uncategorized" (anything that doesn't fit the above)

Input incidents:
{{INCIDENTS}}

Respond with ONLY a JSON array of objects with "row_id" and "category" fields. No markdown, no explanation.
Example: [{"row_id":"123","category":"theft"}]`;

async function categorizeWithGemini(
  itemsForPrompt: object[],
  apiKey: string
): Promise<CategorizationResult[]> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = CATEGORIZATION_PROMPT.replace(
    "{{INCIDENTS}}",
    JSON.stringify(itemsForPrompt, null, 2)
  );

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const jsonText = text.replace(/^```json?\n?/, "").replace(/\n?```$/, "");
  return JSON.parse(jsonText);
}

async function categorizeWithClaude(
  itemsForPrompt: object[],
  apiKey: string
): Promise<CategorizationResult[]> {
  const client = new Anthropic({ apiKey });

  const prompt = CATEGORIZATION_PROMPT.replace(
    "{{INCIDENTS}}",
    JSON.stringify(itemsForPrompt, null, 2)
  );

  const message = await withRetry(() =>
    client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    })
  );

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  const text = textBlock.text.trim();
  const jsonText = text.replace(/^```json?\n?/, "").replace(/\n?```$/, "");
  return JSON.parse(jsonText);
}

export async function categorizeIncidents(
  incidents: RawIncident[],
  apiKey: string
): Promise<Map<string, Category>> {
  const provider = getProvider();
  const categoryMap = new Map<string, Category>();

  const batchSize = 50;
  for (let i = 0; i < incidents.length; i += batchSize) {
    const batch = incidents.slice(i, i + batchSize);

    const itemsForPrompt = batch.map((inc) => ({
      row_id: inc.row_id,
      incident_category: inc.incident_category,
      incident_subcategory: inc.incident_subcategory,
      incident_description: inc.incident_description,
    }));

    try {
      let parsed: CategorizationResult[];
      if (provider === "claude") {
        parsed = await categorizeWithClaude(itemsForPrompt, apiKey);
      } else {
        parsed = await categorizeWithGemini(itemsForPrompt, apiKey);
      }

      for (const item of parsed) {
        const cat = VALID_CATEGORIES.includes(item.category as Category)
          ? (item.category as Category)
          : "uncategorized";
        categoryMap.set(item.row_id, cat);
      }
    } catch (err) {
      console.error(
        `${provider} categorization failed for batch starting at ${i}, falling back`,
        err
      );
      for (const inc of batch) {
        categoryMap.set(inc.row_id, fallbackCategorize(inc));
      }
    }
  }

  return categoryMap;
}

const CLASSIFY_PROMPT = `You are a crime/incident classification assistant. Given a user's description of an incident, respond with ONLY a JSON object with two fields:
- "category": one of "theft", "assault", "sex-related", "scam", or "uncategorized"
- "title": a short title (5 words max) summarizing the incident

No markdown, no explanation. Example: {"category":"theft","title":"Phone stolen on bus"}

Description: {{DESCRIPTION}}`;

export interface ClassificationResult {
  category: Category;
  title: string;
}

async function classifyWithGemini(
  description: string,
  apiKey: string
): Promise<ClassificationResult> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = CLASSIFY_PROMPT.replace("{{DESCRIPTION}}", description);
  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const jsonText = text.replace(/^```json?\n?/, "").replace(/\n?```$/, "");
  return JSON.parse(jsonText);
}

async function classifyWithClaude(
  description: string,
  apiKey: string
): Promise<ClassificationResult> {
  const client = new Anthropic({ apiKey });

  const prompt = CLASSIFY_PROMPT.replace("{{DESCRIPTION}}", description);
  const message = await withRetry(() =>
    client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 256,
      messages: [{ role: "user", content: prompt }],
    })
  );

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  const text = textBlock.text.trim();
  const jsonText = text.replace(/^```json?\n?/, "").replace(/\n?```$/, "");
  return JSON.parse(jsonText);
}

export async function classifyUserReport(
  description: string,
  apiKey: string
): Promise<ClassificationResult> {
  const provider = getProvider();

  const result =
    provider === "claude"
      ? await classifyWithClaude(description, apiKey)
      : await classifyWithGemini(description, apiKey);

  const category = VALID_CATEGORIES.includes(result.category as Category)
    ? (result.category as Category)
    : "uncategorized";

  return { category, title: result.title };
}

function fallbackCategorize(inc: RawIncident): Category {
  const cat = (inc.incident_category || "").toUpperCase();
  if (cat.includes("THEFT") || cat.includes("BURGLARY") || cat.includes("ROBBERY") || cat.includes("STOLEN")) {
    return "theft";
  }
  if (cat.includes("ASSAULT") || cat.includes("WEAPON")) {
    return "assault";
  }
  if (cat.includes("SEX")) {
    return "sex-related";
  }
  if (cat.includes("FRAUD") || cat.includes("FORGERY")) {
    return "scam";
  }
  return "uncategorized";
}
