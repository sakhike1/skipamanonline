// Shop calls against the Skipaman backend: cart sync, checkout, orders, shipping, favourites.
import { skip } from '../lib/skipApi';
import type { CartItem, Product } from '../types';

const rand = (cents: number) => cents / 100;

/** Backend order status -> the status words the site's pages already understand. */
export const STATUS_MAP: Record<string, string> = {
  PENDING_PAYMENT: 'pending',
  PAID: 'confirmed',
  IN_PRODUCTION: 'processing',
  PACKED: 'packed',
  SHIPPED: 'shipped',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};
export const displayStatus = (s: string) => STATUS_MAP[s] ?? s.toLowerCase();

type BackendItem = {
  id: string; nameSnapshot: string; unitCents: number; quantity: number; artworkUrl?: string | null;
  variant?: { size: string; color: string; product: { id: string; name: string; imageUrls: string[] } };
};
export type BackendOrder = {
  id: string; number: number; status: string; totalCents: number; shippingCents: number; discountCents: number;
  creditUsedCents: number; createdAt: string; courier?: string | null; trackingNumber?: string | null; trackingUrl?: string | null;
  estimatedDeliveryFrom?: string | null; estimatedDeliveryTo?: string | null;
  shipName: string; shipPhone: string; shipLine1: string; shipSuburb: string; shipCity: string; shipProvince: string; shipPostalCode: string;
  items: BackendItem[];
  history?: Array<{ id: string; status: string; note?: string | null; createdAt: string }>;
  user?: { name: string; email: string };
};

export const orderRef = (o: { number: number }) => `SKP-${String(o.number).padStart(5, '0')}`;

export const mapItem = (i: BackendItem) => ({
  productName: i.variant?.product.name ?? i.nameSnapshot,
  productImage: i.variant?.product.imageUrls?.[0] ?? '/images/grey1.png',
  quantity: i.quantity,
  size: i.variant?.size ?? '',
  colour: i.variant?.color ?? '',
  lineTotalRand: rand(i.unitCents * i.quantity),
});

// ---------- Shipping ----------
export type ShippingQuote = { shippingCents: number; estimatedDeliveryFrom: string; estimatedDeliveryTo: string; freeShipping?: boolean };
export const quoteShipping = (province: string, subtotalCents: number) =>
  skip.get<ShippingQuote>('/shipping/quote', { province, subtotalCents }, false);

export const SA_PROVINCES = [
  'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape',
];

// ---------- Bulk pricing (mirrors the backend so the cart can show the same numbers) ----------
export type PricedLine = { cents: number; percentOff: number; unitCents: number };
export function priceCart(items: CartItem[], getProduct: (id: string) => Product | undefined) {
  const qtyByProduct = new Map<string, number>();
  for (const it of items) qtyByProduct.set(it.productId, (qtyByProduct.get(it.productId) ?? 0) + it.quantity);
  let subtotalCents = 0;
  let savingCents = 0;
  const lines: PricedLine[] = items.map((it) => {
    const p = getProduct(it.productId);
    const base = p?.price ?? 0;
    const q = qtyByProduct.get(it.productId) ?? 0;
    const percentOff = Math.max(0, ...(p?.priceBreaks ?? []).filter((b) => q >= b.minQty).map((b) => b.percentOff));
    const unitCents = Math.round(base * (1 - percentOff / 100));
    subtotalCents += unitCents * it.quantity;
    savingCents += (base - unitCents) * it.quantity;
    return { cents: unitCents * it.quantity, percentOff, unitCents };
  });
  return { lines, subtotalCents, savingCents };
}

// ---------- Checkout ----------
export type ShipTo = { name: string; phone: string; line1: string; suburb: string; city: string; province: string; postalCode: string };
export type PayFastForm = { url: string; fields: Record<string, string> };
export type CheckoutResult = {
  order: BackendOrder;
  breakdown: { subtotalCents: number; referralDiscountCents: number; creditUsedCents: number; shippingCents: number; totalCents: number };
  payfast: PayFastForm;
};

/** Pushes the browser cart to the server cart, then creates the order. Prices are decided by the server. */
export async function placeOrder(
  items: CartItem[],
  getProduct: (id: string) => Product | undefined,
  ship: ShipTo,
  extra: { referralCode?: string; useCredit?: boolean } = {},
): Promise<CheckoutResult> {
  const lines: Array<{ variantId: string; quantity: number }> = [];
  for (const it of items) {
    const p = getProduct(it.productId);
    const v = p?.variants?.find((x) => x.size === it.size && x.color === it.color.name);
    if (!p || !v) throw new Error(`"${p?.name ?? 'An item'}" (${it.size}, ${it.color.name}) is no longer available. Please remove it from your cart.`);
    lines.push({ variantId: v.id, quantity: it.quantity });
  }
  await skip.del('/cart');
  await skip.post('/cart/bulk', { items: lines });
  return skip.post<CheckoutResult>('/orders', { ...ship, referralCode: extra.referralCode || undefined, useCredit: extra.useCredit ?? true });
}

export const payAgain = (orderId: string) => skip.post<{ payfast: PayFastForm }>(`/orders/${orderId}/pay`);

/** Sends the browser to PayFast by posting the signed form. */
export function submitToPayFast(form: PayFastForm) {
  const f = document.createElement('form');
  f.method = 'POST';
  f.action = form.url;
  for (const [k, v] of Object.entries(form.fields)) {
    const i = document.createElement('input');
    i.type = 'hidden';
    i.name = k;
    i.value = v;
    f.appendChild(i);
  }
  document.body.appendChild(f);
  f.submit();
}

// ---------- Orders ----------
export const listOrders = () => skip.get<BackendOrder[]>('/orders');
export const getOrder = (id: string) => skip.get<BackendOrder>(`/orders/${id}`);
export const reorder = (id: string) => skip.post<{ added: string[]; skipped: Array<{ name: string; reason: string }> }>(`/orders/${id}/reorder`);

export type LookupResult = {
  found: boolean; number?: number; status?: string; totalCents?: number; createdAt?: string;
  courier?: string | null; trackingNumber?: string | null; trackingUrl?: string | null;
  estimatedDeliveryFrom?: string | null; estimatedDeliveryTo?: string | null;
};
export const lookupOrder = (number: string, email: string) =>
  skip.get<LookupResult>('/orders/lookup', { number: number.replace(/\D/g, ''), email }, false);

// ---------- Favourites (wishlist) ----------
export const favouriteIds = () => skip.get<string[]>('/favorites/ids');
export const addFavourite = (productId: string) => skip.put(`/favorites/${productId}`);
export const removeFavourite = (productId: string) => skip.del(`/favorites/${productId}`);
