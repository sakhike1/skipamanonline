import type { Product } from '../types';

/** Full URL from PayPal → Payment link → Copy link (opens hosted checkout, USD, etc.). */
export function getHoodPayPalPaymentUrl(): string | undefined {
  const raw = import.meta.env.VITE_PAYPAL_HOOD_PAYMENT_URL as string | undefined;
  const trimmed = raw?.trim();
  if (!trimmed) return undefined;
  if (!/^https?:\/\//i.test(trimmed)) return undefined;
  return trimmed;
}

export function isHoodProduct(product: Product): boolean {
  const cat = product.category?.toLowerCase() ?? '';
  if (cat === 'hoodies' || cat === 'hoodie') return true;

  const name = product.name.toLowerCase();
  if (name.includes('hoodie') || name.includes('hoody') || /\bhood\b/.test(name)) {
    return true;
  }

  const tags = product.tags?.map((t) => t.toLowerCase()) ?? [];
  if (tags.some((t) => t.includes('hoodie') || t.includes('hoody') || t === 'hood')) {
    return true;
  }

  return false;
}
