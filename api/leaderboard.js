// api/leaderboard.js
import fetch from "node-fetch";
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  try {
    const params = "?select=player_name,score_seconds,letters_completed,mode,created_at&letters_completed=eq.26&order=score_seconds.asc&limit=50";
    const r = await fetch(`${SUPABASE_URL}/rest/v1/az_scores${params}`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
    });
    const data = await r.json();
    res.status(200).json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
