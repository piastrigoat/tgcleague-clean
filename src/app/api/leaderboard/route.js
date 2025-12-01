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

    // 1) Drivers → map driver -> constructor
    const driversRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Drivers!A2:C",
    });
    const driverRows = driversRes.data.values || [];
    const driverToConstructor = {};
    driverRows.forEach((row) => {
      const driverName = row[0];
      const constructor = row[1] || "";
      if (driverName) {
        driverToConstructor[driverName] = constructor;
      }
    });

    // 2) Results → sum points per driver
    const resultsRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "FantasyResults!A2:J",
    });
    const resultRows = resultsRes.data.values || [];
    const driverPoints = {};

    resultRows.forEach((row) => {
      const driverName = row[2]; // C = Driver
      const points = Number(row[9]) || 0; // J = Points

      if (!driverName) return;
      if (!driverPoints[driverName]) driverPoints[driverName] = 0;
      driverPoints[driverName] += points;
    });

    // 3) Constructors → sum points of their drivers
    const constructorPoints = {};
    Object.entries(driverPoints).forEach(([driverName, pts]) => {
      const constructor = driverToConstructor[driverName];
      if (!constructor) return;
      if (!constructorPoints[constructor]) constructorPoints[constructor] = 0;
      constructorPoints[constructor] += pts;
    });

    // 4) Users → calculate fantasy totals
    const usersRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Users!A2:E",
    });
    const userRows = usersRes.data.values || [];

    const leaderboard = userRows
      .filter((row) => row[0])
      .map((row) => {
        const username = row[0];
        const d1 = row[1];
        const d2 = row[2];
        const d3 = row[3];
        const constructor = row[4];

        const d1Pts = driverPoints[d1] || 0;
        const d2Pts = driverPoints[d2] || 0;
        const d3Pts = driverPoints[d3] || 0;
        const teamPts = constructorPoints[constructor] || 0;

        return {
          username,
          totalPoints: d1Pts + d2Pts + d3Pts + teamPts,
        };
      })
      .sort((a, b) => b.totalPoints - a.totalPoints);

    return NextResponse.json(leaderboard);
  } catch (err) {
    console.error("Error in /api/leaderboard:", err);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
