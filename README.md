# Habitus

App per abitudini pensata per persone con ADHD. Frontend React + Vite su Netlify, backend su Supabase.

## Sviluppo locale

1. `npm ci`
2. Copia `.env.example` in `.env.local` e inserisci i valori pubblici di Supabase.
3. `npm run dev`

## Pubblicazione

- Sito: `npm run build`, poi `npx netlify-cli deploy --prod --dir=dist`.
- Database: migrazioni in `supabase/migrations/`.
- AI: funzione in `supabase/functions/invoke-llm/`. Richiede il secret `ANTHROPIC_API_KEY` su Supabase.

Per l'app mobile vedi `MOBILE_SETUP.md`.
