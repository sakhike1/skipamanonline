-- Admin portal: payment tracking, internal notes, auditable order timeline.
-- Apply in Supabase SQL editor or via supabase db push.

alter table public.orders
  add column if not exists payment_status text default 'pending';

alter table public.orders
  add column if not exists admin_notes text;

comment on column public.orders.payment_status is 'unpaid | pending | paid | failed | refunded (app-enforced; not a DB enum)';

create table if not exists public.order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  event_type text not null default 'status_change',
  from_status text,
  to_status text,
  message text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists order_events_order_id_idx on public.order_events (order_id);

alter table public.order_events enable row level security;

drop policy if exists "order_events_select_own_orders" on public.order_events;
create policy "order_events_select_own_orders"
  on public.order_events
  for select
  using (
    exists (
      select 1
      from public.orders o
      where o.id = order_events.order_id
        and o.user_id = auth.uid()
    )
  );

drop policy if exists "order_events_admin_manage" on public.order_events;
create policy "order_events_admin_manage"
  on public.order_events
  for all
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role in ('admin', 'store_manager')
    )
  )
  with check (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role in ('admin', 'store_manager')
    )
  );
