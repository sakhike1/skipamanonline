import type { User as AppUser } from '../types';

/** After login: staff go to admin dashboard when using the storefront `/login` (redirectTo `/`). */
export function resolvePostLoginPath(redirectTo: string, loggedInUser: AppUser | null): string {
  if (!loggedInUser) return redirectTo;
  if (redirectTo.startsWith('/admin')) {
    return loggedInUser.role === 'admin' ? redirectTo : '/';
  }
  if (loggedInUser.role === 'admin') {
    return '/admin';
  }
  return redirectTo;
}
