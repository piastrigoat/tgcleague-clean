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
      range: "Drivers",
    });

    return Response.json(response.data.values || []);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to fetch drivers" }, { status: 500 });
  }
}
