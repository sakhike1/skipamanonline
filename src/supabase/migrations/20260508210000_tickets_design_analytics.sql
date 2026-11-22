-- Support tickets, design requests (Supabase), human-readable order numbers.
-- Run in Supabase SQL Editor after reviewing destructive hints.

-- Human-readable order reference shown to customers and admins
alter table public.orders add column if not exists order_number text;

create unique index if not exists orders_order_number_uidx
  on public.orders (order_number)
  where order_number is not null;

comment on column public.orders.order_number is 'Customer-facing order ref e.g. SKP-YYYYMMDD-XXXXX';

-- Backfill existing rows
update public.orders
set order_number = 'SKP-' || upper(substring(replace(id::text, '-', ''), 1, 12))
where order_number is null;

-- ---------------------------------------------------------------------------
-- Support tickets (storefront form + admin triage)
-- ---------------------------------------------------------------------------
create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_number text not null unique,
  user_id uuid references auth.users (id) on delete set null,
  guest_name text,
  guest_email text,
  subject text not null,
  body text not null,
  category text not null default 'general',
  status text not null default 'open',
  priority text not null default 'normal',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint support_tickets_status_check check (
    status in ('open', 'in_progress', 'waiting_customer', 'resolved', 'closed')
  ),
  constraint support_tickets_priority_check check (
    priority in ('low', 'normal', 'high', 'urgent')
  )
);

create index if not exists support_tickets_user_id_idx on public.support_tickets (user_id);
create index if not exists support_tickets_created_idx on public.support_tickets (created_at desc);

alter table public.support_tickets enable row level security;

drop policy if exists "support_tickets_select" on public.support_tickets;
create policy "support_tickets_select"
  on public.support_tickets for select
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('admin', 'store_manager')
    )
  );

drop policy if exists "support_tickets_insert_authenticated" on public.support_tickets;
create policy "support_tickets_insert_authenticated"
  on public.support_tickets for insert
  with check (
    auth.uid() is not null
    and user_id = auth.uid()
    and ticket_number is not null
  );

drop policy if exists "support_tickets_insert_guest" on public.support_tickets;
create policy "support_tickets_insert_guest"
  on public.support_tickets for insert
  with check (
    auth.uid() is null
    and user_id is null
    and guest_email is not null
    and length(trim(body)) >= 10
    and ticket_number is not null
  );

drop policy if exists "support_tickets_update_staff" on public.support_tickets;
create policy "support_tickets_update_staff"
  on public.support_tickets for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('admin', 'store_manager')
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('admin', 'store_manager')
    )
  );

-- ---------------------------------------------------------------------------
-- Design requests (logged-in customers; appears in admin Tickets)
-- ---------------------------------------------------------------------------
create table if not exists public.design_requests (
  id uuid primary key default gen_random_uuid(),
  request_number text not null unique,
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text not null,
  category text not null default 'custom',
  budget text,
  timeline text,
  status text not null default 'pending',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint design_requests_status_check check (
    status in ('pending', 'reviewed', 'in_progress', 'completed', 'rejected')
  )
);

create index if not exists design_requests_user_id_idx on public.design_requests (user_id);
create index if not exists design_requests_created_idx on public.design_requests (created_at desc);

alter table public.design_requests enable row level security;

drop policy if exists "design_requests_select" on public.design_requests;
create policy "design_requests_select"
  on public.design_requests for select
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('admin', 'store_manager')
    )
  );

drop policy if exists "design_requests_insert" on public.design_requests;
create policy "design_requests_insert"
  on public.design_requests for insert
  with check (user_id = auth.uid() and request_number is not null);

drop policy if exists "design_requests_update_staff" on public.design_requests;
create policy "design_requests_update_staff"
  on public.design_requests for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('admin', 'store_manager')
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('admin', 'store_manager')
    )
  );
