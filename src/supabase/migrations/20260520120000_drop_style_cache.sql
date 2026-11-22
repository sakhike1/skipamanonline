/*
  # Drop legacy AI stylist cache (Gemini removed from app)

  Safe to run even if style_cache was never created: uses IF EXISTS only.
  Policies are removed automatically when the table is dropped.

  Apply via Supabase CLI: supabase db push
  Or run in Supabase Dashboard → SQL Editor.
*/

DROP TABLE IF EXISTS style_cache CASCADE;

DROP FUNCTION IF EXISTS cleanup_old_cache();
