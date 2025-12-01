import { google } from "googleapis";

async function getClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  return await auth.getClient();
}

export async function GET() {
  try {
    const client = await getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    // --- Load Users ---
    const usersRaw = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "Users!A:F",
    });

    let [, ...users] = usersRaw.data.values || [];
    users = users.map((r) => ({
      username: r[0],
      picks: [r[1], r[2], r[3]],
      constructor: r[4],
      points: 0,
    }));

    // --- Load Results ---
    const resultsRaw = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "Results!A:J",
    });

    const [, ...results] = resultsRaw.data.values || [];

    // --- Compute Points ---
    for (let u of users) {
      for (let res of results) {
        const driver = res[2];
        const position = Number(res[3]);
        const points = Number(res[9]);

        if (u.picks.includes(driver)) {
          u.points += points;
          if (res[4] === "Yes") u.points += 3;
          if (res[5] === "Yes") u.points += 1;
        }

        if (u.constructor === res[2]) {
          u.points += Math.floor(points / 2);
        }
      }
    }

    return Response.json(users.sort((a, b) => b.points - a.points));
  } catch (err) {
    console.error(err);
    return new Response("Failed", { status: 500 });
  }
}
