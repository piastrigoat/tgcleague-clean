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
      range: "Drivers!A:C",       // includes name + price column
    });

    const rows = response.data.values || [];

    // Convert rows → objects
    const drivers = rows.map((r) => ({
      name: r[0] || "",
      price: r[2] || "",           // COLUMN C = index 2
    }));

    return Response.json(drivers);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to load drivers" }, { status: 500 });
  }
}
