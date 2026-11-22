-- Admin announcements + RLS (Supabase).
-- Purpose: replace legacy backend "broadcast / announcement" endpoints + Socket.IO events.
-- This table is safe to read for authenticated users, and only writable by admins.

create extension if not exists "uuid-ossp";

create table if not exists public.admin_announcements (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  message text not null,
  type text not null default 'info', -- info | warning | success | error
  priority text not null default 'medium', -- low | medium | high | urgent
  action_required boolean not null default false,
  action_url text,
  persistent boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.admin_announcements enable row level security;

-- Any signed-in user can read announcements.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'admin_announcements'
      and policyname = 'Authenticated read announcements'
  ) then
    execute $p$
      create policy "Authenticated read announcements"
      on public.admin_announcements
      for select
      to authenticated
      using (true)
    $p$;
  end if;
end $$;

-- Only admins can write announcements.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'admin_announcements'
      and policyname = 'Admins manage announcements'
  ) then
    execute $p$
      create policy "Admins manage announcements"
      on public.admin_announcements
      for all
      to authenticated
      using (
        exists (
          select 1
          from public.profiles p
          where p.id = auth.uid()
            and p.role in ('admin','store_manager')
        )
      )
      with check (
        exists (
          select 1
          from public.profiles p
          where p.id = auth.uid()
            and p.role in ('admin','store_manager')
        )
      )
    $p$;
  end if;
end $$;

