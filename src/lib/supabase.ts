import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const detectSupabaseKeyRole = (jwt: string | undefined): string | null => {
  if (!jwt || typeof jwt !== 'string') return null;
  const parts = jwt.split('.');
  if (parts.length < 2) return null;
  try {
    const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64.padEnd(Math.ceil(b64.length / 4) * 4, '=');
    const json = JSON.parse(atob(padded)) as { role?: unknown } | null;
    return typeof json?.role === 'string' ? json.role : null;
  } catch {
    return null;
  }
};

const supabaseKeyRole = detectSupabaseKeyRole(supabaseAnonKey);
const isInsecureServiceRoleKey = supabaseKeyRole === 'service_role';

// Note: avoid adding a client-side fetch timeout wrapper here.
// Some networks (corporate proxies, antivirus, cellular) can stall TLS negotiation or long-polls
// and aggressive aborts can break Supabase auth flows.

type SupabaseClientOrNull = ReturnType<typeof createClient> | null;

// Vite HMR can re-evaluate modules and create multiple GoTrueClient instances.
// Cache the client on globalThis to keep a single instance per browser tab.
const globalForSupabase = globalThis as unknown as {
  __skipaman_supabase__?: SupabaseClientOrNull;
};

const createSupabaseClient = (): SupabaseClientOrNull => {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  if (isInsecureServiceRoleKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey, {
    // use default fetch
  });
};

export const supabase: SupabaseClientOrNull =
  globalForSupabase.__skipaman_supabase__ ?? (globalForSupabase.__skipaman_supabase__ = createSupabaseClient());

if (isInsecureServiceRoleKey) {
  console.error(
    '[supabase] Refusing to initialize Supabase client in the browser with a service_role key. Use the anon public key instead.',
  );
}

if (!supabase && (supabaseUrl || supabaseAnonKey)) {
  console.warn(
    '[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Supabase features are disabled.',
  );
}
