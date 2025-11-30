import { promises as fs } from "fs";
import path from "path";

export async function POST(req) {
  const body = await req.json();
  const { username, picks, constructor } = body;

  const filePath = path.join(process.cwd(), "fantasyData.json");

  let data = [];
  try {
    const file = await fs.readFile(filePath, "utf8");
    data = JSON.parse(file);
  } catch {
    data = [];
  }

  // overwrite if user already exists
  const existing = data.find(u => u.username === username);
  if (existing) {
    existing.picks = picks;
    existing.constructor = constructor;
  } else {
    data.push({ username, picks, constructor, totalPoints: 0 });
  }

  await fs.writeFile(filePath, JSON.stringify(data, null, 2));

  return Response.json({ status: "Saved" });
}
