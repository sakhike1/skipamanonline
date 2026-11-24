// Client for the Skipaman backend (skipaman-backend).
// - Access token (15 min) is kept in memory only.
// - Refresh token is an httpOnly cookie managed by the backend; on a 401 we refresh once and retry.

export const SKIP_API_URL = String(import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '');

let accessToken: string | null = null;
let refreshing: Promise<string | null> | null = null;

export class ApiError extends Error {
  status: number;
  body?: unknown;
  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

export const getAccessToken = () => accessToken;
export const setAccessToken = (t: string | null) => {
  accessToken = t;
};

/** One refresh at a time, even if several requests fail together. */
export function refreshSession(): Promise<string | null> {
  if (!refreshing) {
    refreshing = fetch(`${SKIP_API_URL}/auth/refresh`, { method: 'POST', credentials: 'include' })
      .then(async (r) => {
        if (!r.ok) {
          accessToken = null;
          return null;
        }
        const j = (await r.json()) as { accessToken: string };
        accessToken = j.accessToken;
        return accessToken;
      })
      .catch(() => null)
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

type Query = Record<string, string | number | boolean | undefined | null>;
type Opts = { method?: string; body?: unknown; auth?: boolean; query?: Query };

export async function skipFetch<T = any>(path: string, opts: Opts = {}, retried = false): Promise<T> {
  const { method = 'GET', body, auth = true, query } = opts;
  const qs = query
    ? '?' +
      Object.entries(query)
        .filter(([, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join('&')
    : '';
  const headers: Record<string, string> = {};
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
  if (body !== undefined && !isForm) headers['Content-Type'] = 'application/json';
  if (auth && accessToken) headers.Authorization = `Bearer ${accessToken}`;

  let res: Response;
  try {
    res = await fetch(`${SKIP_API_URL}${path}${qs}`, {
      method,
      headers,
      credentials: 'include',
      body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
    });
  } catch {
    throw new ApiError('Cannot reach the server. Check your connection and try again.', 0);
  }

  if (res.status === 401 && auth && !retried && !path.startsWith('/auth/')) {
    if (await refreshSession()) return skipFetch<T>(path, opts, true);
  }

  const text = await res.text();
  let data: any;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch {
    /* non-JSON body */
  }
  if (!res.ok) {
    const msg = data?.error || data?.message || `Request failed (${res.status})`;
    throw new ApiError(typeof msg === 'string' ? msg : 'Request failed', res.status, data);
  }
  return data as T;
}

export const skip = {
  get: <T = any>(path: string, query?: Query, auth = true) => skipFetch<T>(path, { query, auth }),
  post: <T = any>(path: string, body?: unknown, auth = true) => skipFetch<T>(path, { method: 'POST', body: body ?? {}, auth }),
  put: <T = any>(path: string, body?: unknown) => skipFetch<T>(path, { method: 'PUT', body: body ?? {} }),
  patch: <T = any>(path: string, body?: unknown) => skipFetch<T>(path, { method: 'PATCH', body: body ?? {} }),
  del: <T = any>(path: string) => skipFetch<T>(path, { method: 'DELETE' }),
};
