/** Normalize pathname for canonical URLs and SEO lookup (slashes, backslashes, trailing slash). */
export function normalizeUrlPathname(pathname: string): string {
  let p = pathname.split('?')[0] || '/';
  if (p.includes('\\')) {
    p = p.replace(/\\/g, '/');
  }
  while (p.includes('//') && p !== '//') {
    p = p.replace('//', '/');
  }
  if (p.length > 1 && p.endsWith('/')) {
    p = p.slice(0, -1);
  }
  return p || '/';
}
