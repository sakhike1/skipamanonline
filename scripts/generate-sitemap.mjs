/**
 * Writes public/sitemap.xml for indexable marketing routes + product detail URLs.
 * Uses VITE_PUBLIC_SITE_URL or https://skipaman.co.za. Run via npm run sitemap or prebuild.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

config({ path: join(root, '.env') });
config({ path: join(root, '.env.production') });

const baseRaw =
  process.env.VITE_PUBLIC_SITE_URL ||
  process.env.PUBLIC_SITE_URL ||
  'https://skipaman.co.za';
const base = String(baseRaw).replace(/\/$/, '');

/** Indexable static routes (matches routeSeo BY_PATH, excluding noindex auth/checkout). */
const STATIC_PATHS = [
  '/',
  '/shop',
  '/new-arrivals',
  '/virtual-stylist',
  '/printing',
  '/locations/centurion',
  '/locations/pretoria',
  '/locations/johannesburg',
  '/services/bulk-screen-printing',
  '/services/dtf-printing',
  '/services/embroidery',
  '/services/school-uniforms',
  '/services/corporate-wear',
  '/lookbook',
  '/about',
  '/terms',
  '/privacy',
  '/search',
  '/reviews',
];

function escapeXml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function collectProductIds() {
  const productsTs = readFileSync(join(root, 'src/data/products.ts'), 'utf8');
  const ids = [];
  const re = /^\s{4}id:\s*'([^']+)',/gm;
  let m;
  while ((m = re.exec(productsTs)) !== null) {
    ids.push(m[1]);
  }
  return ids;
}

const lastmod = new Date().toISOString().split('T')[0];
const urls = [];

for (const path of STATIC_PATHS) {
  const loc = path === '/' ? `${base}/` : `${base}${path}`;
  urls.push(
    `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${path === '/' ? 'weekly' : 'weekly'}</changefreq>\n    <priority>${path === '/' ? '1.0' : '0.8'}</priority>\n  </url>`,
  );
}

for (const id of collectProductIds()) {
  const loc = `${base}/product/${id}`;
  urls.push(
    `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`,
  );
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

const outPath = join(root, 'public', 'sitemap.xml');
writeFileSync(outPath, xml, 'utf8');
console.log(`Wrote ${urls.length} URLs to ${outPath} (base: ${base})`);
