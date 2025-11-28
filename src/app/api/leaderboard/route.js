let PICKS_DB = []; // same as picks file, but ideally move to a database

export async function GET() {
  // placeholder: return dummy points
  const leaderboard = PICKS_DB.map(u => ({
    username: u.username,
    totalPoints: Math.floor(Math.random() * 100), // replace with real logic
  }));

  return Response.json(leaderboard);
}
