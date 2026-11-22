-- Adds announcements/broadcasts using Supabase (replaces old backend admin broadcast endpoints).
-- Run in Supabase SQL editor.

create extension if not exists "uuid-ossp";

create table if not exists public.announcements (
  id uuid primary key default uuid_generate_v4(),
  kind text not null check (kind in ('broadcast', 'announcement')),
  type text not null default 'info' check (type in ('info', 'warning', 'success', 'error')),
  title text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  action_required boolean not null default false,
  action_url text,
  persistent boolean not null default false,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles(id) on delete set null
);

alter table public.announcements enable row level security;

-- Everyone signed in can read announcements.
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'announcements'
      and policyname = 'Anyone can read announcements'
  ) then
    execute $p$
      create policy "Anyone can read announcements"
      on public.announcements
      for select
      using (auth.role() = 'authenticated')
    $p$;
  end if;
end $$;

-- Only admins can insert announcements.
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'announcements'
      and policyname = 'Admins can create announcements'
  ) then
    execute $p$
      create policy "Admins can create announcements"
      on public.announcements
      for insert
      with check (
        auth.role() = 'authenticated'
        and exists (
          select 1
          from public.profiles p
          where p.id = auth.uid()
            and p.role in ('store_manager', 'admin')
        )
      )
    $p$;
  end if;
end $$;

-- Track who created it (server-side).
create or replace function public.set_announcement_created_by()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.created_by is null then
    new.created_by := auth.uid();
  end if;
  return new;
end;
$$;

drop trigger if exists set_announcement_created_by on public.announcements;
create trigger set_announcement_created_by
  before insert on public.announcements
  for each row execute procedure public.set_announcement_created_by();

