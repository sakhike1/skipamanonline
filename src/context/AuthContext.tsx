import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';
import type { User as AppUser, LoginCredentials, RegisterCredentials } from '../types';
import { supabase } from '../lib/supabase';

type ProfileRow = {
  id: string;
  role: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type LoginOptions = {
  /** When true (staff portal at `/admin/login`), non-admin accounts are signed out immediately and login fails. */
  adminPortal?: boolean;
};

type AuthContextValue = {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  login: (credentials: LoginCredentials, options?: LoginOptions) => Promise<AppUser | null>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function mapDbRoleToAppRole(dbRole: string): AppUser['role'] {
  if (dbRole === 'store_manager' || dbRole === 'admin') return 'admin';
  return 'buyer';
}

const isRetryableAuthFetchError = (e: unknown) => {
  const err = e as { name?: unknown; status?: unknown; message?: unknown } | null;
  const name = typeof err?.name === 'string' ? err.name : '';
  const status = typeof err?.status === 'number' ? err.status : undefined;
  const message = typeof err?.message === 'string' ? err.message : '';
  const msg = message.toLowerCase();

  return (
    name === 'AuthRetryableFetchError' ||
    name === 'AbortError' ||
    status === 504 ||
    msg.includes('gateway timeout') ||
    msg.includes('failed to fetch') ||
    msg.includes('request timed out') ||
    msg.includes('timed out') ||
    msg.includes('aborted')
  );
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Prevents hung network calls from leaving the UI stuck on “Signing in…”. */
async function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${Math.round(ms / 1000)}s`)), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}

const PROFILE_FETCH_MS = 12_000;
const SIGN_IN_MS = 55_000;

/** Map Supabase AuthApiError / network errors to a single UI string (avoid “timeout” for 422/400). */
function mapAuthFailureToUserMessage(e: unknown, context: 'login' | 'register'): string {
  if (e instanceof Error && e.message === 'Request timed out') {
    return context === 'login'
      ? 'Sign in is taking too long. Please try again.'
      : 'Signup is taking too long. Please try again.';
  }

  const status =
    typeof (e as { status?: unknown })?.status === 'number'
      ? (e as { status: number }).status
      : undefined;
  const raw = e instanceof Error ? e.message : String(e ?? '');
  const lower = raw.toLowerCase();
  const name = typeof (e as { name?: unknown })?.name === 'string' ? (e as { name: string }).name : '';

  if (name === 'AbortError' || lower.includes('aborted')) {
    return 'The connection timed out. Check your network and try again.';
  }

  // Explicit credential / validation responses from Supabase (not “network down”).
  if (
    status === 400 ||
    status === 401 ||
    status === 422 ||
    lower.includes('invalid login credentials') ||
    lower.includes('invalid credentials')
  ) {
    if (lower.includes('invalid login') || lower.includes('invalid credentials')) {
      return 'Wrong email or password. Please try again.';
    }
    if (lower.includes('user already registered') || lower.includes('already registered')) {
      return 'This email is already registered. Please sign in instead.';
    }
    if (lower.includes('email not confirmed') || lower.includes('not confirmed')) {
      return 'Please confirm your email address, then sign in.';
    }
    // Signup 400: weak password, invalid email, etc. — surface Supabase message when helpful
    if (raw && raw !== 'Request timed out') {
      return raw;
    }
    return context === 'login' ? 'Login failed.' : 'Registration failed. Check email and password.';
  }

  if (isRetryableAuthFetchError(e)) {
    return context === 'login'
      ? 'Sign in timed out. Please try again.'
      : 'Signup timed out. Please try again in a moment.';
  }

  if (raw) return raw;
  return context === 'login' ? 'Login failed.' : 'Registration failed.';
}

function toAppUser(supabaseUser: SupabaseAuthUser, profile: ProfileRow | null): AppUser {
  const meta = (supabaseUser.user_metadata ?? {}) as Record<string, unknown>;
  const metaFull =
    (meta.full_name as string | undefined) ||
    `${(meta.firstName as string) || ''} ${(meta.lastName as string) || ''}`.trim();
  const fullName = profile?.full_name?.trim() || metaFull || '';
  const parts = fullName.split(/\s+/).filter(Boolean);
  const firstName =
    ((meta.firstName ?? meta.first_name) as string | undefined) || parts[0] || '';
  const lastName =
    ((meta.lastName ?? meta.last_name) as string | undefined) || parts.slice(1).join(' ') || '';

  const dbRole = profile?.role ?? 'customer';

  return {
    id: String(supabaseUser.id ?? ''),
    email: String(supabaseUser.email ?? ''),
    firstName,
    lastName,
    role: mapDbRoleToAppRole(dbRole),
    phone: profile?.phone ?? (meta.phone as string | undefined),
    avatarUrl: profile?.avatar_url ?? undefined,
    createdAt: String(supabaseUser?.created_at ?? new Date().toISOString()),
    updatedAt: String(
      supabaseUser?.updated_at ?? profile?.created_at ?? supabaseUser?.created_at ?? new Date().toISOString(),
    ),
  };
}

async function fetchProfile(userId: string): Promise<ProfileRow | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await withTimeout(
      supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
      PROFILE_FETCH_MS,
      'Profile fetch',
    );
    if (error) {
      console.warn('[auth] profiles:', error.message);
      return null;
    }
    return data as ProfileRow | null;
  } catch (e) {
    console.warn('[auth] profiles fetch failed or timed out:', e instanceof Error ? e.message : e);
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hydrateUser = useCallback(async (sessionUser: SupabaseAuthUser | null): Promise<AppUser | null> => {
    if (!sessionUser?.id) {
      setUser(null);
      return null;
    }
    const profile = await fetchProfile(sessionUser.id);
    const appUser = toAppUser(sessionUser, profile);
    setUser(appUser);
    return appUser;
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        if (!supabase) {
          if (!mounted) return;
          setUser(null);
          setIsLoading(false);
          return;
        }

        const { data } = await supabase.auth.getSession();
        if (!mounted) return;

        const sessionUser = data.session?.user ?? null;
        if (sessionUser) await hydrateUser(sessionUser);
        else setUser(null);
      } catch {
        if (!mounted) return;
        setUser(null);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void init();

    if (!supabase) return () => {};

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) await hydrateUser(session.user);
      else setUser(null);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [hydrateUser]);

  const clearError = useCallback(() => setError(null), []);

  const login = useCallback(async (credentials: LoginCredentials, options?: LoginOptions) => {
    setError(null);
    setIsSubmitting(true);
    try {
      if (!supabase) throw new Error('Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (anon public).');

      let lastErr: unknown = null;
      for (const delayMs of [0, 600, 1500]) {
        if (delayMs) await sleep(delayMs);

        const { error: signInError } = await withTimeout(
          supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          }),
          SIGN_IN_MS,
          'Sign in',
        );

        if (!signInError) {
          lastErr = null;
          break;
        }

        lastErr = signInError;
        if (!isRetryableAuthFetchError(signInError)) break;
      }

      if (lastErr) throw lastErr;

      const { data: sessionData } = await supabase.auth.getSession();
      const sessionUser = sessionData.session?.user;
      if (sessionUser) {
        const appUser = await hydrateUser(sessionUser);
        if (options?.adminPortal && appUser && appUser.role !== 'admin') {
          await supabase.auth.signOut();
          setUser(null);
          const msg = 'Only admin accounts can sign in here.';
          setError(msg);
          throw new Error(msg);
        }
        return appUser;
      }
      return null;
    } catch (e) {
      setError(mapAuthFailureToUserMessage(e, 'login'));
      throw e;
    } finally {
      setIsSubmitting(false);
    }
  }, [hydrateUser]);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    setError(null);
    setIsSubmitting(true);
    try {
      if (!supabase) throw new Error('Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (anon public).');
      const fullName = `${credentials.firstName} ${credentials.lastName}`.trim();

      // Supabase can sometimes return transient 504s; retry a couple times with backoff.
      let lastErr: unknown = null;
      let didCreateSession = false;
      for (const delayMs of [0, 800, 2000]) {
        if (delayMs) await sleep(delayMs);

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: credentials.email,
          password: credentials.password,
          options: {
            data: {
              full_name: fullName,
              firstName: credentials.firstName,
              lastName: credentials.lastName,
            },
          },
        });

        if (!signUpError) {
          lastErr = null;
          didCreateSession = !!signUpData?.session?.user;
          if (signUpData?.session?.user) {
            await hydrateUser(signUpData.session.user);
          }
          break;
        }

        lastErr = signUpError;
        if (!isRetryableAuthFetchError(signUpError)) break;
      }

      if (lastErr) throw lastErr;
      // If email confirmations are enabled, signup may succeed without a session.
      // In that case we keep the user logged out and let the UI redirect to login.
      void didCreateSession;
    } catch (e) {
      const msg = mapAuthFailureToUserMessage(e, 'register');
      setError(msg);
      throw e;
    } finally {
      setIsSubmitting(false);
    }
  }, [hydrateUser]);

  const logout = useCallback(async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      // Optimistic UI update: immediately clear local user state.
      // We still attempt a Supabase signOut to invalidate the session.
      setUser(null);

      if (supabase) {
        await supabase.auth.signOut();
      }
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      isSubmitting,
      error,
      login,
      register,
      logout,
      clearError,
    }),
    [user, isLoading, isSubmitting, error, login, register, logout, clearError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// `useAuth` lives in `src/context/useAuth.ts` to avoid React Refresh
// context mismatch issues during HMR.
