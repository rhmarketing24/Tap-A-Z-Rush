import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from("az_scores")
    .select("*")
    .order("score_seconds", { ascending: true })
    .limit(20);

  if (error) return res.status(400).json({ error });

  res.status(200).json(data);
}
