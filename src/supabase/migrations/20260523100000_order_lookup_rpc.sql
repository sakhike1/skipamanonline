-- Guest-safe order status lookup (order number + email must match checkout notes).

create or replace function public.lookup_order_status(
  p_order_number text,
  p_email text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  o public.orders%rowtype;
  ship record;
  email_norm text;
begin
  email_norm := lower(trim(coalesce(p_email, '')));
  if length(trim(coalesce(p_order_number, ''))) < 4 or email_norm = '' or position('@' in email_norm) = 0 then
    return jsonb_build_object('found', false, 'error', 'invalid_input');
  end if;

  select * into o
  from public.orders
  where upper(trim(coalesce(order_number, ''))) = upper(trim(p_order_number))
  limit 1;

  if not found then
    return jsonb_build_object('found', false);
  end if;

  if o.notes is null or lower(o.notes) not like '%' || email_norm || '%' then
    return jsonb_build_object('found', false);
  end if;

  select tracking_number, carrier, status, shipped_at, delivered_at, estimated_delivery
  into ship
  from public.shipments
  where order_id = o.id
  limit 1;

  return jsonb_build_object(
    'found', true,
    'order_number', o.order_number,
    'status', o.status,
    'payment_status', coalesce(o.payment_status, 'pending'),
    'total_amount', o.total_amount,
    'created_at', o.created_at,
    'tracking_number', ship.tracking_number,
    'carrier', ship.carrier,
    'shipment_status', ship.status,
    'shipped_at', ship.shipped_at,
    'delivered_at', ship.delivered_at,
    'estimated_delivery', ship.estimated_delivery
  );
end;
$$;

revoke all on function public.lookup_order_status(text, text) from public;
grant execute on function public.lookup_order_status(text, text) to anon, authenticated;
