import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { User as AppUser, LoginCredentials, RegisterCredentials } from '../types';
import { ApiError, refreshSession, setAccessToken, skip } from '../lib/skipApi';

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

type BackendUser = { id: string; email: string; name: string; phone?: string | null; role: 'CUSTOMER' | 'ADMIN' };

function toAppUser(u: BackendUser): AppUser {
  const parts = (u.name || '').trim().split(/\s+/).filter(Boolean);
  const now = new Date().toISOString();
  return {
    id: u.id,
    email: u.email,
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' '),
    role: u.role === 'ADMIN' ? 'admin' : 'buyer',
    phone: u.phone ?? undefined,
    createdAt: now,
    updatedAt: now,
  };
}

function friendlyMessage(e: unknown, context: 'login' | 'register'): string {
  if (e instanceof ApiError) {
    if (e.status === 0) return e.message;
    if (e.status === 401) return 'Wrong email or password. Please try again.';
    if (e.status === 409) return 'This email is already registered. Please sign in instead.';
    if (e.status === 429) return 'Too many attempts. Please wait a minute and try again.';
    if (e.status === 400) {
      // zod validation: surface the first problem in plain words
      const fe = (e.body as { details?: { fieldErrors?: Record<string, string[]> } } | undefined)?.details?.fieldErrors ?? {};
      if (fe.password) return 'Password must be at least 8 characters.';
      if (fe.email) return 'Please enter a valid email address.';
      if (fe.name) return 'Please enter your name.';
      return e.message;
    }
    return e.message;
  }
  return e instanceof Error && e.message ? e.message : context === 'login' ? 'Login failed.' : 'Registration failed.';
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // On page load the access token is gone, but the refresh cookie may still be valid.
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (await refreshSession()) {
          const me = await skip.get<BackendUser>('/auth/me');
          if (mounted) setUser(toAppUser(me));
        }
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const login = useCallback(async (credentials: LoginCredentials, options?: LoginOptions) => {
    setError(null);
    setIsSubmitting(true);
    try {
      const r = await skip.post<{ accessToken: string }>('/auth/login', credentials, false);
      setAccessToken(r.accessToken);
      const appUser = toAppUser(await skip.get<BackendUser>('/auth/me'));
      if (options?.adminPortal && appUser.role !== 'admin') {
        await skip.post('/auth/logout', {}, false).catch(() => undefined);
        setAccessToken(null);
        setUser(null);
        const msg = 'Only admin accounts can sign in here.';
        setError(msg);
        throw new Error(msg);
      }
      setUser(appUser);
      return appUser;
    } catch (e) {
      setError(e instanceof Error && e.message === 'Only admin accounts can sign in here.' ? e.message : friendlyMessage(e, 'login'));
      throw e;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    setError(null);
    setIsSubmitting(true);
    try {
      const r = await skip.post<{ accessToken: string }>(
        '/auth/register',
        {
          email: credentials.email,
          password: credentials.password,
          name: `${credentials.firstName} ${credentials.lastName}`.trim(),
        },
        false,
      );
      setAccessToken(r.accessToken);
      setUser(toAppUser(await skip.get<BackendUser>('/auth/me')));
    } catch (e) {
      setError(friendlyMessage(e, 'register'));
      throw e;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      setUser(null); // optimistic
      await skip.post('/auth/logout', {}, false).catch(() => undefined);
      setAccessToken(null);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: !!user, isLoading, isSubmitting, error, login, register, logout, clearError }),
    [user, isLoading, isSubmitting, error, login, register, logout, clearError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// `useAuth` lives in `src/context/useAuth.ts` to avoid React Refresh
// context mismatch issues during HMR.
