-- Admin: read/manage newsletter subscribers, orders, and shipping addresses for staff.

-- Newsletter: staff can list and remove subscribers
drop policy if exists "newsletter_subscribers_admin_select" on public.newsletter_subscribers;
create policy "newsletter_subscribers_admin_select"
  on public.newsletter_subscribers
  for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('admin', 'store_manager')
    )
  );

drop policy if exists "newsletter_subscribers_admin_delete" on public.newsletter_subscribers;
create policy "newsletter_subscribers_admin_delete"
  on public.newsletter_subscribers
  for delete
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('admin', 'store_manager')
    )
  );

-- Orders: staff can view and update all orders (if not already defined in your project)
drop policy if exists "orders_admin_select" on public.orders;
create policy "orders_admin_select"
  on public.orders
  for select
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('admin', 'store_manager')
    )
  );

drop policy if exists "orders_admin_update" on public.orders;
create policy "orders_admin_update"
  on public.orders
  for update
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

-- Order items: staff read for fulfillment
drop policy if exists "order_items_admin_select" on public.order_items;
create policy "order_items_admin_select"
  on public.order_items
  for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (
          o.user_id = auth.uid()
          or exists (
            select 1 from public.profiles p
            where p.id = auth.uid()
              and p.role in ('admin', 'store_manager')
          )
        )
    )
  );

-- Shipments: staff manage
drop policy if exists "shipments_admin_all" on public.shipments;
create policy "shipments_admin_all"
  on public.shipments
  for all
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

-- Addresses: staff can read addresses linked to orders they manage
drop policy if exists "addresses_admin_select" on public.addresses;
create policy "addresses_admin_select"
  on public.addresses
  for select
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('admin', 'store_manager')
    )
  );
