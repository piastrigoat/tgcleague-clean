import { google } from "googleapis";

async function getClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return await auth.getClient();
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, picks, constructor } = body;

    if (!username) return new Response("Username required", { status: 400 });

    const client = await getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: "Users!A:F",
      valueInputOption: "RAW",
      requestBody: {
        values: [[username, picks[0], picks[1], picks[2], constructor, new Date().toISOString()]],
      },
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return new Response("Failed to save picks", { status: 500 });
  }
}
