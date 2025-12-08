# Tap A→Z Rush (Mini App)

## Quick start

1. Create Supabase table (SQL provided in project).
2. Create Vercel project from this repo.
3. Add environment vars:
   - SUPABASE_URL
   - SUPABASE_SERVICE_KEY (service_role key for server-side inserts)
   - SUPABASE_ANON_KEY
   - ROOT_URL (https://your-vercel-domain)
4. Deploy on Vercel.
5. Ensure `/.well-known/farcaster.json` is accessible at:
   https://your-vercel-domain/.well-known/farcaster.json
6. (Optional) Base Build: Add domain, run Account Association -> paste returned header/payload/signature into farcaster.json.
7. Test game and leaderboard.
