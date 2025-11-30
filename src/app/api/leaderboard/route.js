import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "fantasyData.json");

  try {
    const file = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(file);
    return Response.json(data);
  } catch {
    return Response.json([]);
  }
}
