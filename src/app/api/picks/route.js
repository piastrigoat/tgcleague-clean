import { google } from "googleapis";
import { NextResponse } from "next/server";

const SHEET_ID = process.env.SHEET_ID;

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"], // read + write
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, picks, constructor } = body;

    if (!username || !Array.isArray(picks) || picks.length !== 3 || !constructor) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    // Read existing users
    const existingRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Users!A2:E", // skip header
    });

    const rows = existingRes.data.values || [];
    const usernames = rows.map((r) => r[0]);
    const index = usernames.findIndex(
      (u) => (u || "").toLowerCase() === username.toLowerCase()
    );

    const rowValues = [
      username,
      picks[0] || "",
      picks[1] || "",
      picks[2] || "",
      constructor || "",
    ];

    if (index === -1) {
      // Append new row
      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: "Users!A2:E",
        valueInputOption: "RAW",
        requestBody: { values: [rowValues] },
      });
    } else {
      // Update existing row
      const rowNumber = index + 2; // account for header
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `Users!A${rowNumber}:E${rowNumber}`,
        valueInputOption: "RAW",
        requestBody: { values: [rowValues] },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error in /api/picks:", err);
    return NextResponse.json(
      { error: "Failed to save picks" },
      { status: 500 }
    );
  }
}
