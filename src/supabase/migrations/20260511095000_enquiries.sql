-- Website enquiries captured from forms (anon insert via Edge Function).
-- This table is intentionally write-only from the client side (no SELECT policies).

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  name text,
  email text,
  phone text,
  message text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
create index if not exists enquiries_type_idx on public.enquiries (type);

alter table public.enquiries enable row level security;

-- No public select/update/delete policies on purpose.
-- Inserts should be done by a server function using the service role key.
