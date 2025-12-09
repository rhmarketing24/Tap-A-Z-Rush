import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { player_name, score_seconds, letters_completed, mode } = req.body;

  const { data, error } = await supabase
    .from("az_scores")
    .insert([{ player_name, score_seconds, letters_completed, mode }])
    .select();

  if (error) return res.status(400).json({ error });

  res.status(200).json(data[0]);
}
