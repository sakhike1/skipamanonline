/** Short human-readable refs for orders / tickets / design requests (prefix per domain). */
export function generatePublicReference(prefix: string): string {
  const ymd = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rnd = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}-${ymd}-${rnd}`;
}
