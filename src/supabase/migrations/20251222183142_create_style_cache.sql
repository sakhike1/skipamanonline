/*
  # Style Reports Cache Table (DEPRECATED — dropped in 20260520120000_drop_style_cache.sql)

  Kept for migration history only. New environments should rely on the drop migration
  after this file runs, or skip applying this file if bootstrapping fresh without AI stylist.

  1. New Tables
    - `style_cache`
      - `id` (uuid, primary key) - Unique identifier
      - `cache_key` (text, unique) - Hash of input parameters for quick lookup
      - `inputs` (jsonb) - Full user input parameters
      - `ai_response` (jsonb) - Generated style report from Gemini
      - `image_url` (text, nullable) - Generated image URL from Imagen
      - `grounding_sources` (jsonb) - Pinterest/trend sources
      - `created_at` (timestamptz) - Cache creation timestamp
      - `access_count` (integer) - Track cache hit popularity
      - `last_accessed` (timestamptz) - Last time this cache was used

  2. Indexes
    - Index on cache_key for fast lookups
    - Index on created_at for cache cleanup

  3. Security
    - Enable RLS on `style_cache` table
    - Public read access (anyone can view cached styles)
    - No write access needed from client (server-side only via service key)

  4. Notes
    - Cache entries expire after 7 days of no access
    - Popular entries (high access_count) are kept longer
*/

-- Create style_cache table
CREATE TABLE IF NOT EXISTS style_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key text UNIQUE NOT NULL,
  inputs jsonb NOT NULL,
  ai_response jsonb NOT NULL,
  image_url text,
  grounding_sources jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  access_count integer DEFAULT 0,
  last_accessed timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_style_cache_key ON style_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_style_cache_created ON style_cache(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_style_cache_accessed ON style_cache(last_accessed DESC);

-- Enable RLS
ALTER TABLE style_cache ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read cached styles (public data)
CREATE POLICY "Anyone can read style cache"
  ON style_cache
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Function to cleanup old cache entries (optional, can be run periodically)
CREATE OR REPLACE FUNCTION cleanup_old_cache()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM style_cache
  WHERE last_accessed < now() - interval '7 days'
    AND access_count < 5;
END;
$$;