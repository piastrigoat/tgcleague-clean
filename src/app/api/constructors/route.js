import { google } from "googleapis";

const SHEET_ID = process.env.SHEET_ID;
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

export async function GET() {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Constructors",
    });

    const rows = res.data.values || [];

    // Format: [Name, Price]
    const constructors = rows.slice(1).map((row) => ({
      name: row[0] || "",
      price: row[1] || "",
    }));

    return Response.json(constructors);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to load constructors" }, { status: 500 });
  }
}
