-- Run in Supabase SQL editor after your main schema (adds notifications + RLS).
create extension if not exists "uuid-ossp";

create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  type text not null default 'system',
  title text not null,
  body text,
  is_read boolean default false,
  data jsonb,
  created_at timestamptz default now()
);

alter table notifications enable row level security;

create policy "Users manage own notifications"
  on notifications for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
