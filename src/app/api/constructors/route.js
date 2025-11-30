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
      range: "Constructors!A:B",     // name + price
    });

    const rows = response.data.values || [];

    const constructors = rows.map((r) => ({
      name: r[0] || "",
      price: r[1] || "",              // COLUMN B = index 1
    }));

    return Response.json(constructors);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to load constructors" }, { status: 500 });
  }
}
