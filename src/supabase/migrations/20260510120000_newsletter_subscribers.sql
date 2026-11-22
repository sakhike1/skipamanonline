-- Newsletter signups from the storefront (anon insert + unique email)
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text,
  created_at timestamptz not null default now(),
  constraint newsletter_subscribers_email_key unique (email)
);

comment on table public.newsletter_subscribers is 'Marketing newsletter signups from footer, home section, etc.';

alter table public.newsletter_subscribers enable row level security;

-- Allow public signups via anon key (no read access for clients)
create policy "newsletter_subscribers_insert_public"
  on public.newsletter_subscribers
  for insert
  to anon, authenticated
  with check (true);
