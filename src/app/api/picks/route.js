let PICKS_DB = []; // temporary in-memory storage

export async function POST(req) {
  const body = await req.json();
  const { username, picks, constructor } = body;

  // store the user’s picks
  PICKS_DB = PICKS_DB.filter(u => u.username !== username);
  PICKS_DB.push({ username, picks, constructor });

  return Response.json({ success: true });
}

export async function GET() {
  return Response.json(PICKS_DB);
}
