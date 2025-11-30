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

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Constructors!A:B", // <-- fetch columns A and B
    });

    const rows = response.data.values || [];

    const cleaned = rows.slice(1).map(row => ({
      name: row[0] || "",
      price: Number(row[1]) || 0,  // COLUMN B
    }));

    return Response.json(cleaned);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to fetch constructors" }, { status: 500 });
  }
}
