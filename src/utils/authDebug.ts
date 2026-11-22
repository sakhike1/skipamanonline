/**
 * Authentication Debug Utility
 * Helps diagnose authentication issues
 */

export const debugAuth = () => {
  const detectSupabaseKeyRole = (jwt?: string): string | null => {
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

  const supabaseKeyRole = detectSupabaseKeyRole(import.meta.env.VITE_SUPABASE_ANON_KEY);

  const probeSupabase = async () => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!url || !key) return;

    const withTimeout = async <T,>(p: Promise<T>, ms: number) => {
      let timer: ReturnType<typeof setTimeout>;
      const timeout = new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('Probe timed out')), ms);
      });
      return Promise.race<T>([p.finally(() => clearTimeout(timer)), timeout]);
    };

    try {
      const startedAt = performance.now();
      const res = await withTimeout(
        fetch(`${url}/auth/v1/settings`, {
          method: 'GET',
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
          },
        }),
        10000,
      );
      const elapsedMs = performance.now() - startedAt;
      const text = await res.text();
      console.log('[authDebug] Supabase /auth/v1/settings:', {
        ok: res.ok,
        status: res.status,
        elapsedMs: Math.round(elapsedMs),
        bodyPreview: text.slice(0, 200),
      });
    } catch (e) {
      console.log('[authDebug] Supabase probe failed:', e);
    }
  };

  const debugInfo = {
    // Environment variables
    env: {
      MODE: import.meta.env.MODE,
      DEV: import.meta.env.DEV,
      PROD: import.meta.env.PROD,
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? 'SET' : 'NOT SET',
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
      VITE_SUPABASE_KEY_ROLE: supabaseKeyRole || 'UNKNOWN',
    },
    // LocalStorage state
    localStorage: {
      // Supabase manages session storage internally; we intentionally don't rely on legacy auth_token keys.
      supabase_access_token: localStorage.getItem('sb-access-token') ? 'EXISTS' : 'NOT FOUND',
    },
    // Network check
    network: {
      online: navigator.onLine,
      userAgent: navigator.userAgent,
    },
  };

  console.group('🔍 Authentication Debug Info');
  console.log('Environment Variables:', debugInfo.env);
  console.log('LocalStorage State:', debugInfo.localStorage);
  console.log('Network Status:', debugInfo.network);

  // Note: We no longer probe legacy endpoints here.
  // Those probes caused noisy ERR_CONNECTION_REFUSED logs during Supabase migration.
  console.groupEnd();
  // Fire-and-forget probe to confirm Supabase is reachable.
  void probeSupabase();
  
  return debugInfo;
};

// Auto-run in development
if (import.meta.env.DEV) {
  // Run after a short delay to allow app to initialize
  setTimeout(() => {
    if (window.location.pathname === '/login' || window.location.pathname === '/register') {
      debugAuth();
    }
  }, 1000);
}

















