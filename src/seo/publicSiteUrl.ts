/**
 * Public site origin for canonical URLs, Open Graph, and sitemap.
 * Set `VITE_PUBLIC_SITE_URL` in production (e.g. https://skipaman.co.za).
 */
export function getPublicSiteUrl(): string {
  const fromEnv = import.meta.env.VITE_PUBLIC_SITE_URL as string | undefined;
  if (fromEnv && /^https?:\/\//i.test(fromEnv.trim())) {
    return fromEnv.trim().replace(/\/$/, '');
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return 'https://skipaman.co.za';
}

export function absolutizeUrl(pathOrUrl: string, siteUrl = getPublicSiteUrl()): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${siteUrl}${path}`;
}
