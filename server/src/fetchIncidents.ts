import axios from "axios";

export interface RawIncident {
  row_id: string;
  incident_datetime: string;
  incident_date: string;
  incident_time: string;
  incident_category: string;
  incident_subcategory: string;
  incident_description: string;
  latitude: string;
  longitude: string;
  point: { type: string; coordinates: [number, number] };
  [key: string]: unknown;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function formatFloatingTimestamp(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export async function fetchIncidents(): Promise<RawIncident[]> {
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 30);

  const start = formatFloatingTimestamp(startDate);
  const end = formatFloatingTimestamp(endDate);

  const fields = [
    "row_id",
    "incident_datetime",
    "incident_date",
    "incident_time",
    "incident_year",
    "incident_day_of_week",
    "report_datetime",
    "incident_id",
    "incident_number",
    "cad_number",
    "report_type_code",
    "report_type_description",
    "filed_online",
    "incident_code",
    "incident_category",
    "incident_subcategory",
    "incident_description",
    "resolution",
    "intersection",
    "cnn",
    "police_district",
    "analysis_neighborhood",
    "supervisor_district",
    "supervisor_district_2012",
    "latitude",
    "longitude",
    "point",
    "data_as_of",
    "data_loaded_at",
  ];

  const payload = {
    clientContext: {
      clientContextVariables: [],
    },
    query: `SELECT
      ${fields
        .map((field, index) => `  \`${field}\`${index < fields.length - 1 ? "," : ""}`)
        .join("\n")}
      WHERE
        \`incident_date\`
          BETWEEN "${start}" :: floating_timestamp
          AND "${end}" :: floating_timestamp`,
    page: {
      pageNumber: 1,
      pageSize: 100,
    },
    parameters: {},
  };

  const response = await axios.post(
    "https://data.sfgov.org/api/v3/views/wg3w-h783/query.json",
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        "X-App-Token": "U29jcmF0YS0td2VraWNrYXNz0",
      },
      timeout: 60000,
    }
  );

  // Filter to only incidents with coordinates
  return (response.data as RawIncident[]).filter(
    (item) => item.point && item.latitude && item.longitude
  );
}
