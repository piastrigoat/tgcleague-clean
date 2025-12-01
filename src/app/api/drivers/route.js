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

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "Drivers!A:C",
    });

    const [, ...rows] = res.data.values || [];
    const drivers = rows.map((r) => ({
      name: r[0],
      price: Number(r[2] || 0),
    }));

    return Response.json(drivers);
  } catch (err) {
    console.error(err);
    return new Response("Failed", { status: 500 });
  }
}
