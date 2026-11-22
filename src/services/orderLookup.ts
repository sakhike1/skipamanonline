import type { SupabaseClient } from '@supabase/supabase-js';

export type OrderLookupResult = {
  found: boolean;
  orderNumber?: string;
  status?: string;
  paymentStatus?: string;
  totalAmount?: number;
  createdAt?: string;
  trackingNumber?: string | null;
  carrier?: string | null;
  shipmentStatus?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  estimatedDelivery?: string | null;
  error?: string;
};

export async function lookupOrderByReference(
  supabase: SupabaseClient,
  orderNumber: string,
  email: string,
): Promise<OrderLookupResult> {
  const { data, error } = await supabase.rpc('lookup_order_status', {
    p_order_number: orderNumber.trim(),
    p_email: email.trim(),
  });

  if (error) {
    return { found: false, error: error.message };
  }

  const row = data as Record<string, unknown> | null;
  if (!row || row.found !== true) {
    return { found: false };
  }

  return {
    found: true,
    orderNumber: String(row.order_number ?? orderNumber),
    status: String(row.status ?? ''),
    paymentStatus: String(row.payment_status ?? ''),
    totalAmount: Number(row.total_amount ?? 0),
    createdAt: String(row.created_at ?? ''),
    trackingNumber: (row.tracking_number as string | null) ?? null,
    carrier: (row.carrier as string | null) ?? null,
    shipmentStatus: (row.shipment_status as string | null) ?? null,
    shippedAt: (row.shipped_at as string | null) ?? null,
    deliveredAt: (row.delivered_at as string | null) ?? null,
    estimatedDelivery: (row.estimated_delivery as string | null) ?? null,
  };
}

export type UserOrderSummary = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
};

export async function fetchUserOrdersForChat(
  supabase: SupabaseClient,
  userId: string,
  limit = 5,
): Promise<UserOrderSummary[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('id, status, total_amount, created_at, order_number')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map((row) => {
    const id = String(row.id);
    const ref = (row.order_number as string | null | undefined)?.trim();
    return {
      id,
      orderNumber: ref || id.replace(/-/g, '').slice(0, 12).toUpperCase(),
      status: String(row.status ?? 'pending'),
      total: Number(row.total_amount ?? 0),
      createdAt: String(row.created_at ?? ''),
    };
  });
}

export async function lookupOrderForSignedInUser(
  supabase: SupabaseClient,
  userId: string,
  orderNumber: string,
): Promise<OrderLookupResult> {
  const { data: row, error } = await supabase
    .from('orders')
    .select(
      `
      id,
      order_number,
      status,
      payment_status,
      total_amount,
      created_at,
      shipments ( tracking_number, carrier, status, shipped_at, delivered_at, estimated_delivery )
    `,
    )
    .eq('user_id', userId)
    .ilike('order_number', orderNumber.trim())
    .maybeSingle();

  if (error) return { found: false, error: error.message };
  if (!row) return { found: false };

  const ship = (row.shipments as Array<Record<string, unknown>> | null)?.[0];
  return {
    found: true,
    orderNumber: String(row.order_number ?? orderNumber),
    status: String(row.status ?? ''),
    paymentStatus: String(row.payment_status ?? ''),
    totalAmount: Number(row.total_amount ?? 0),
    createdAt: String(row.created_at ?? ''),
    trackingNumber: (ship?.tracking_number as string | null) ?? null,
    carrier: (ship?.carrier as string | null) ?? null,
    shipmentStatus: (ship?.status as string | null) ?? null,
    shippedAt: (ship?.shipped_at as string | null) ?? null,
    deliveredAt: (ship?.delivered_at as string | null) ?? null,
    estimatedDelivery: (ship?.estimated_delivery as string | null) ?? null,
  };
}

export function formatOrderStatusMessage(result: OrderLookupResult): string {
  if (!result.found) {
    return 'We couldn’t find an order with that reference and email. Double-check your SKP reference and the email used at checkout, or contact us on WhatsApp.';
  }

  const lines = [
    `Order ${result.orderNumber}`,
    `Status: ${(result.status ?? '').replace(/_/g, ' ')}`,
    `Payment: ${(result.paymentStatus ?? '').replace(/_/g, ' ')}`,
    `Total: R${(result.totalAmount ?? 0).toFixed(2)}`,
    `Placed: ${result.createdAt ? new Date(result.createdAt).toLocaleDateString() : '—'}`,
  ];

  if (result.trackingNumber) {
    lines.push(`Tracking: ${result.trackingNumber}`);
  }
  if (result.carrier) {
    lines.push(`Carrier: ${result.carrier}`);
  }
  if (result.shippedAt) {
    lines.push(`Shipped: ${new Date(result.shippedAt).toLocaleString()}`);
  }
  if (result.deliveredAt) {
    lines.push(`Delivered: ${new Date(result.deliveredAt).toLocaleString()}`);
  }

  return lines.join('\n');
}
