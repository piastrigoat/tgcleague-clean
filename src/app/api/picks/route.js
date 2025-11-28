import { google } from 'googleapis';

const SHEET_ID = process.env.SHEET_ID;
const F1_POINTS = [25,18,15,12,10,8,6,4,2,1]; // positions 1..10

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function readSheet(tabName) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: tabName,
  });
  return res.data.values || [];
}

async function writeUserPick(username, picks, totalPoints = 0) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });
  const users = await readSheet('Users');
  const rowIndex = users.findIndex(r => r[0] === username);
  const row = [username, ...picks, totalPoints];

  if (rowIndex === -1) {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'Users',
      valueInputOption: 'RAW',
      resource: { values: [row] },
    });
  } else {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `Users!A${rowIndex+1}:F${rowIndex+1}`,
      valueInputOption: 'RAW',
      resource: { values: [row] },
    });
  }
}

async function calculatePoints(picks) {
  const results = await readSheet('Results'); // [Race, Name, Position]
  let points = 0;

  picks.forEach(pick => {
    const driverResult = results.find(r => r[1] === pick);
    if (driverResult) {
      const pos = parseInt(driverResult[2], 10) - 1;
      points += F1_POINTS[pos] || 0;
    }
  });

  return points;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { username, picks, constructor } = req.body;
    if (!username || !picks || !constructor) return res.status(400).json({ error: 'Missing data' });

    const totalPoints = await calculatePoints(picks);
    await writeUserPick(username, [...picks, constructor], totalPoints);

    res.status(200).json({ message: 'Picks saved', totalPoints });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save picks' });
  }
}
