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
      range: "Drivers!A2:C", // skip header row
    });

    const rows = res.data.values || [];

    const drivers = rows
      .filter((row) => row[0]) // only rows with a driver name
      .map((row) => ({
        name: row[0],
        constructor: row[1] || "",
        price: Number(row[2]) || 0,
      }));

    return NextResponse.json(drivers);
  } catch (err) {
    console.error("Error in /api/drivers:", err);
    return NextResponse.json(
      { error: "Failed to fetch drivers" },
      { status: 500 }
    );
  }
}
