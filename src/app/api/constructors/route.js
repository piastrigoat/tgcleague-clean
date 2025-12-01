import { google } from "googleapis";
import { NextResponse } from "next/server";

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
      range: "Constructors!A2:B", // skip header row
    });

    const rows = res.data.values || [];

    const constructors = rows
      .filter((row) => row[0])
      .map((row) => ({
        name: row[0],
        price: Number(row[1]) || 0,
      }));

    return NextResponse.json(constructors);
  } catch (err) {
    console.error("Error in /api/constructors:", err);
    return NextResponse.json(
      { error: "Failed to fetch constructors" },
      { status: 500 }
    );
  }
}
