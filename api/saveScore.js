// api/saveScore.js
import fetch from "node-fetch";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { player_name, score_seconds, letters_completed, mode } = req.body;
    if (!player_name || score_seconds == null) {
      return res.status(400).json({ error: "missing fields" });
    }

    const r = await fetch(`${SUPABASE_URL}/rest/v1/az_scores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        Prefer: "return=representation"
      },
      body: JSON.stringify({
        player_name,
        score_seconds,
        letters_completed,
        mode
      })
    });
    const data = await r.json();
    if (!r.ok) return res.status(500).json({ error: data });
    return res.status(201).json(data[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
