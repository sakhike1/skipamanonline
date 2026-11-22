import type { SupabaseClient } from '@supabase/supabase-js';
import type { Address, OrderItem, OrderStatus, PaymentStatus } from '../types/legacyApi';
import type { NotificationType } from '../types';

const ORDER_SELECT = `
  *,
  profiles (full_name, phone),
  shipping_address:addresses!shipping_address_id (
    street,
    city,
    province,
    postal_code,
    country
  ),
  order_items (
    product_id,
    quantity,
    size,
    colour,
    unit_price,
    products (name, image_urls)
  ),
  shipments (
    id,
    order_id,
    tracking_number,
    carrier,
    status,
    estimated_delivery,
    shipped_at,
    delivered_at
  )
`;

export type AdminOrderUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type AdminShipment = {
  id: string | null;
  tracking_number: string | null;
  carrier: string | null;
  status: string | null;
  estimated_delivery: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
};

export type MappedAdminOrder = {
  id: string;
  orderNumber: string;
  userId: string;
  user: AdminOrderUser;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: Address;
  totalCents: number;
  totalRand: number;
  notes: string | null;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
  shipment: AdminShipment | null;
};

export type OrderEventRow = {
  id: string;
  order_id: string;
  event_type: string;
  from_status: string | null;
  to_status: string | null;
  message: string | null;
  created_at: string;
};

function parseCustomerEmailFromNotes(notes: string | null | undefined): string | null {
  if (!notes?.trim()) return null;
  const dashMatch = notes.match(/checkout\s*[—\-]\s*(\S+@\S+)/i);
  if (dashMatch?.[1]) return dashMatch[1].trim();
  const generic = notes.match(/(\S+@\S+\.\S+)/);
  return generic?.[1]?.trim() ?? null;
}

function splitName(fullName: string | null | undefined): { first: string; last: string } {
  const parts = (fullName ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: 'Customer', last: '' };
  return { first: parts[0] ?? 'Customer', last: parts.slice(1).join(' ') };
}

export function mapSupabaseOrderRow(row: Record<string, unknown>): MappedAdminOrder {
  const profile = row.profiles as { full_name?: string | null; phone?: string | null } | null;
  const addr = row.shipping_address as {
    street?: string | null;
    city?: string | null;
    province?: string | null;
    postal_code?: string | null;
    country?: string | null;
  } | null;

  const fullName = profile?.full_name?.trim() || 'Customer';
  const { first: fn, last: ln } = splitName(fullName);

  const itemsRaw = row.order_items as Array<Record<string, unknown>> | null;
  const items: OrderItem[] = (itemsRaw ?? []).map((oi) => {
    const p = oi.products as { name?: string; image_urls?: string[] } | null;
    const qty = Number(oi.quantity ?? 1);
    const unitRand = Number(oi.unit_price ?? 0);
    const unitCents = Math.round(unitRand * 100);
    return {
      productId: String(oi.product_id ?? ''),
      productName: p?.name ?? 'Product',
      productImage: p?.image_urls?.[0] ?? '/images/grey1.png',
      quantity: qty,
      size: String(oi.size ?? ''),
      color: { name: String(oi.colour ?? ''), value: '#000000' },
      price: unitCents,
      total: Math.round(unitRand * qty * 100),
    };
  });

  const shippingAddress: Address = {
    firstName: fn,
    lastName: ln,
    address1: addr?.street ?? '—',
    city: addr?.city ?? '—',
    state: addr?.province ?? '—',
    postalCode: addr?.postal_code ?? '',
    country: addr?.country ?? 'South Africa',
    phone: profile?.phone ?? '',
  };

  const totalRand = Number(row.total_amount ?? 0);
  const totalCents = Math.round(totalRand * 100);

  const rawPayment = String(row.payment_status ?? '').toLowerCase();
  const paymentStatus: PaymentStatus =
    rawPayment === 'paid' ||
    rawPayment === 'failed' ||
    rawPayment === 'refunded' ||
    rawPayment === 'partially_refunded'
      ? (rawPayment as PaymentStatus)
      : rawPayment === 'unpaid'
        ? 'pending'
        : 'pending';

  const shipmentsRaw = row.shipments as AdminShipment[] | null;
  const firstShip = shipmentsRaw?.[0];
  const shipment: AdminShipment | null = firstShip
    ? {
        id: firstShip.id ? String(firstShip.id) : null,
        tracking_number: firstShip.tracking_number ?? null,
        carrier: firstShip.carrier ?? null,
        status: firstShip.status ?? null,
        estimated_delivery: firstShip.estimated_delivery ?? null,
        shipped_at: firstShip.shipped_at ?? null,
        delivered_at: firstShip.delivered_at ?? null,
      }
    : null;

  const id = String(row.id);
  const dbOrderNumber = (row.order_number as string | null | undefined)?.trim();
  const orderNumber = dbOrderNumber || id.replace(/-/g, '').slice(0, 12).toUpperCase();

  return {
    id,
    orderNumber,
    userId: String(row.user_id),
    user: {
      id: String(row.user_id),
      firstName: fn,
      lastName: ln,
      email: parseCustomerEmailFromNotes((row.notes as string | null) ?? null) ?? '—',
    },
    items,
    status: row.status as OrderStatus,
    paymentStatus,
    shippingAddress,
    totalCents,
    totalRand,
    notes: (row.notes as string | null) ?? null,
    adminNotes: (row.admin_notes as string | null) ?? null,
    createdAt: String(row.created_at ?? ''),
    updatedAt: String(row.updated_at ?? row.created_at ?? ''),
    shipment,
  };
}

export async function fetchAdminOrders(supabase: SupabaseClient, limit = 150): Promise<MappedAdminOrder[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map((r) => mapSupabaseOrderRow(r as Record<string, unknown>));
}

export async function fetchAdminOrderById(
  supabase: SupabaseClient,
  orderId: string,
): Promise<MappedAdminOrder | null> {
  const { data, error } = await supabase.from('orders').select(ORDER_SELECT).eq('id', orderId).maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapSupabaseOrderRow(data as Record<string, unknown>);
}

export async function fetchOrderEvents(supabase: SupabaseClient, orderId: string): Promise<OrderEventRow[]> {
  const { data, error } = await supabase
    .from('order_events')
    .select('id, order_id, event_type, from_status, to_status, message, created_at')
    .eq('order_id', orderId)
    .order('created_at', { ascending: true });

  if (error) {
    console.warn('[adminOrders] order_events:', error.message);
    return [];
  }
  return (data ?? []) as OrderEventRow[];
}

function statusCustomerCopy(status: OrderStatus): { title: string; body: string; type: NotificationType } {
  switch (status) {
    case 'processing':
      return {
        title: 'Your order is being prepared',
        body: 'We are packing your items. You will get another update when it ships.',
        type: 'system',
      };
    case 'packed':
      return {
        title: 'Your order is packed',
        body: 'Your items are packed and will ship soon.',
        type: 'system',
      };
    case 'shipped':
      return {
        title: 'Your order has shipped',
        body: 'Your package is on the way. Check your order page for tracking details.',
        type: 'order_shipped',
      };
    case 'out_for_delivery':
      return {
        title: 'Out for delivery',
        body: 'Your order is out for delivery today.',
        type: 'order_shipped',
      };
    case 'delivered':
      return {
        title: 'Delivered',
        body: 'Your order has been delivered. Thank you for shopping with us!',
        type: 'order_delivered',
      };
    case 'confirmed':
      return {
        title: 'Order confirmed',
        body: 'We received your order and will process it shortly.',
        type: 'order_confirmation',
      };
    case 'cancelled':
      return {
        title: 'Order cancelled',
        body: 'Your order has been cancelled. Contact support if this was unexpected.',
        type: 'system',
      };
    default:
      return {
        title: 'Order update',
        body: `Your order status is now: ${status.replace(/_/g, ' ')}.`,
        type: 'system',
      };
  }
}

async function insertCustomerNotification(
  supabase: SupabaseClient,
  userId: string,
  title: string,
  body: string,
  type: NotificationType,
  _orderId: string,
): Promise<void> {
  const { error } = await supabase.from('notifications').insert({
    user_id: userId,
    title,
    body,
    type,
    is_read: false,
  });
  if (error) {
    console.warn('[adminOrders] Could not insert notification:', error.message);
  }
}

async function insertOrderEvent(
  supabase: SupabaseClient,
  orderId: string,
  event: {
    event_type: string;
    from_status: string | null;
    to_status: string | null;
    message: string | null;
    created_by: string | null;
  },
): Promise<void> {
  const { error } = await supabase.from('order_events').insert({
    order_id: orderId,
    event_type: event.event_type,
    from_status: event.from_status,
    to_status: event.to_status,
    message: event.message,
    created_by: event.created_by,
  });
  if (error) {
    console.warn('[adminOrders] Could not insert order_events:', error.message);
  }
}

export async function updateOrderPaymentStatus(
  supabase: SupabaseClient,
  order: MappedAdminOrder,
  newPaymentStatus: PaymentStatus,
  adminUserId: string | null,
  notifyCustomer: boolean,
): Promise<void> {
  const prevPayment = order.paymentStatus;
  const { error } = await supabase
    .from('orders')
    .update({
      payment_status: newPaymentStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', order.id);

  if (error) throw error;

  await insertOrderEvent(supabase, order.id, {
    event_type: 'payment',
    from_status: prevPayment,
    to_status: newPaymentStatus,
    message: `Payment status set to ${newPaymentStatus}`,
    created_by: adminUserId,
  });

  if (notifyCustomer) {
    const title =
      newPaymentStatus === 'paid'
        ? 'Payment confirmed'
        : newPaymentStatus === 'refunded'
          ? 'Refund processed'
          : newPaymentStatus === 'failed'
            ? 'Payment issue'
            : 'Payment update';
    const body =
      newPaymentStatus === 'paid'
        ? 'Your payment has been confirmed. We will prepare your order shortly.'
        : newPaymentStatus === 'refunded'
          ? 'A refund has been recorded for your order. Contact support if you have questions.'
          : newPaymentStatus === 'failed'
            ? 'There was an issue with payment on your order. Please contact support.'
            : `Your order payment status is now: ${newPaymentStatus.replace(/_/g, ' ')}.`;
    await insertCustomerNotification(
      supabase,
      order.userId,
      title,
      body,
      'order_confirmation',
      order.id,
    );
  }
}

export async function confirmOrderPayment(
  supabase: SupabaseClient,
  order: MappedAdminOrder,
  adminUserId: string | null,
  notifyCustomer: boolean,
): Promise<void> {
  const prevPayment = order.paymentStatus;
  const { error } = await supabase
    .from('orders')
    .update({
      payment_status: 'paid',
      updated_at: new Date().toISOString(),
    })
    .eq('id', order.id);

  if (error) throw error;

  await insertOrderEvent(supabase, order.id, {
    event_type: 'payment',
    from_status: prevPayment,
    to_status: 'paid',
    message: 'Payment confirmed by admin',
    created_by: adminUserId,
  });

  if (notifyCustomer) {
    await insertCustomerNotification(
      supabase,
      order.userId,
      'Payment confirmed',
      'Your payment has been confirmed. We will prepare your order shortly.',
      'order_confirmation',
      order.id,
    );
  }
}

export async function updateAdminOrderFields(
  supabase: SupabaseClient,
  orderId: string,
  patch: { admin_notes?: string | null },
): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', orderId);
  if (error) throw error;
}

export async function updateOrderLifecycle(
  supabase: SupabaseClient,
  params: {
    order: MappedAdminOrder;
    newStatus: OrderStatus;
    adminNotes?: string | null;
    notifyCustomer: boolean;
    adminUserId: string | null;
  },
): Promise<void> {
  const { order, newStatus, adminNotes, notifyCustomer, adminUserId } = params;
  const prevStatus = order.status;

  const updatePayload: Record<string, unknown> = {
    status: newStatus,
    updated_at: new Date().toISOString(),
  };
  if (adminNotes !== undefined) {
    updatePayload.admin_notes = adminNotes;
  }

  const { error } = await supabase.from('orders').update(updatePayload).eq('id', order.id);
  if (error) throw error;

  if (newStatus === 'delivered' && order.shipment?.id) {
    await touchShipmentDelivered(supabase, order.shipment.id);
  }
  if (newStatus === 'shipped' && order.shipment?.id) {
    const now = new Date().toISOString();
    const { error: se } = await supabase
      .from('shipments')
      .update({ status: 'in_transit', shipped_at: now })
      .eq('id', order.shipment.id);
    if (se) console.warn('[adminOrders] shipment shipped touch:', se.message);
  }

  await insertOrderEvent(supabase, order.id, {
    event_type: 'status_change',
    from_status: prevStatus,
    to_status: newStatus,
    message: null,
    created_by: adminUserId,
  });

  if (notifyCustomer) {
    const copy = statusCustomerCopy(newStatus);
    await insertCustomerNotification(supabase, order.userId, copy.title, copy.body, copy.type, order.id);
  }
}

export async function upsertShipment(
  supabase: SupabaseClient,
  orderId: string,
  shipmentId: string | null,
  fields: {
    tracking_number: string;
    carrier: string;
    status?: string | null;
  },
): Promise<void> {
  const row = {
    order_id: orderId,
    tracking_number: fields.tracking_number || null,
    carrier: fields.carrier || null,
    status: fields.status ?? 'in_transit',
  };

  if (shipmentId) {
    const { error } = await supabase.from('shipments').update(row).eq('id', shipmentId);
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from('shipments').insert(row);
  if (error) throw error;
}

async function touchShipmentDelivered(
  supabase: SupabaseClient,
  shipmentId: string,
): Promise<void> {
  const now = new Date().toISOString();
  const { error } = await supabase
    .from('shipments')
    .update({
      status: 'delivered',
      delivered_at: now,
    })
    .eq('id', shipmentId);
  if (error) console.warn('[adminOrders] shipment delivered touch:', error.message);
}

export async function addFollowUpNote(
  supabase: SupabaseClient,
  orderId: string,
  message: string,
  adminUserId: string | null,
): Promise<void> {
  await insertOrderEvent(supabase, orderId, {
    event_type: 'follow_up',
    from_status: null,
    to_status: null,
    message,
    created_by: adminUserId,
  });
}

export type DashboardStats = {
  totalOrders: number;
  totalRevenueRand: number;
  averageOrderValueRand: number;
  todayOrders: number;
  todayRevenueRand: number;
  pendingPayment: number;
  toShip: number;
};

export async function computeDashboardStats(supabase: SupabaseClient): Promise<DashboardStats> {
  const { data: rows, error } = await supabase.from('orders').select('total_amount, created_at, payment_status, status');
  if (error) throw error;

  const now = Date.now();
  const dayMs = 86400000;
  let totalRevenue = 0;
  let todayOrders = 0;
  let todayRevenue = 0;
  let pendingPayment = 0;
  let toShip = 0;

  for (const r of rows ?? []) {
    const amt = Number((r as { total_amount?: number }).total_amount ?? 0);
    totalRevenue += amt;
    const t = new Date((r as { created_at?: string }).created_at as string).getTime();
    if (now - t < dayMs) {
      todayOrders += 1;
      todayRevenue += amt;
    }
    const ps = String((r as { payment_status?: string }).payment_status ?? '').toLowerCase();
    const st = String((r as { status?: string }).status ?? '');
    if (ps !== 'paid' && ps !== 'failed' && ps !== 'refunded') pendingPayment += 1;
    if (['confirmed', 'processing', 'packed'].includes(st)) toShip += 1;
  }

  const totalOrders = rows?.length ?? 0;
  return {
    totalOrders,
    totalRevenueRand: totalRevenue,
    averageOrderValueRand: totalOrders ? totalRevenue / totalOrders : 0,
    todayOrders,
    todayRevenueRand: todayRevenue,
    pendingPayment,
    toShip,
  };
}
