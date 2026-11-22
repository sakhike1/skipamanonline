import type { OrderData } from './paypalService';

type CreateOrderResponse = { orderID: string };
type CaptureOrderResponse = {
  id?: string;
  status?: string;
  payer?: unknown;
  purchase_units?: unknown;
  [key: string]: unknown;
};

function getApiBaseUrl() {
  const base = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_PAYPAL_API_BASE_URL || '';
  return String(base).replace(/\/+$/, '');
}

function parseErrorMessage(raw: string, status: number): string {
  try {
    const parsed = JSON.parse(raw) as { message?: string | string[]; error?: string };
    const m = Array.isArray(parsed.message) ? parsed.message.join(', ') : parsed.message;
    if (m) return m;
    if (parsed.error) return parsed.error;
  } catch {
    /* not JSON */
  }
  return raw.slice(0, 500) || `Request failed (${status})`;
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

  const raw = await res.text().catch(() => '');

  if (!res.ok) {
    throw new Error(raw ? parseErrorMessage(raw, res.status) : `Request failed (${res.status})`);
  }

  if (!raw) return {} as T;
  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error('Invalid JSON from payment server');
  }
}

export async function createPayPalOrder(orderData: OrderData): Promise<string> {
  const base = getApiBaseUrl();
  if (!base) {
    throw new Error('Missing API base URL. Set VITE_API_BASE_URL (recommended) or VITE_PAYPAL_API_BASE_URL.');
  }

  const { orderID } = await postJson<CreateOrderResponse>(`${base}/payments/paypal/order`, {
    orderData,
  });

  if (!orderID) throw new Error('PayPal order creation failed (missing orderID).');
  return orderID;
}

export async function capturePayPalOrder(orderID: string): Promise<CaptureOrderResponse> {
  const base = getApiBaseUrl();
  if (!base) {
    throw new Error('Missing API base URL. Set VITE_API_BASE_URL (recommended) or VITE_PAYPAL_API_BASE_URL.');
  }

  return await postJson<CaptureOrderResponse>(`${base}/payments/paypal/capture`, { orderID });
}

