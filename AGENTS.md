# AGENTS.md

Habitus: habit app for people with ADHD. React + Vite frontend on Netlify, Supabase backend (auth, database, storage, edge functions).

- `src/api/base44Client.js` is the Supabase data layer. It keeps the old `base44.*` call shape so pages did not have to change; there is no Base44 backend any more.
- `supabase/migrations/`: database schema. Every table uses Row Level Security.
- `supabase/functions/invoke-llm/`: AI calls. The API key is a Supabase secret and never reaches the browser.
- Never commit `.env` files or secrets. Run `npm run lint` and `npm run build` before finishing a change.
