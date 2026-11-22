import type { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { normalizeUrlPathname } from '../../seo/normalizePath';
import { absolutizeUrl, getPublicSiteUrl } from '../../seo/publicSiteUrl';
import { getDefaultOgImagePath, getRouteSeo } from '../../seo/routeSeo';

/**
 * Per-route title, meta description, canonical, Open Graph, and Twitter cards.
 * Note: HTML still loads first from `index.html`; crawlers that execute JS will see updates.
 * Production builds can also emit prerendered HTML for selected routes (see `vite.config.ts`).
 */
const RouteSeo: FC = () => {
  const location = useLocation();
  const site = getPublicSiteUrl();
  const path = normalizeUrlPathname(location.pathname);
  const canonicalUrl = `${site}${path === '/' ? '/' : path}`;
  const seo = getRouteSeo(path);
  const ogImage = absolutizeUrl(getDefaultOgImagePath(), site);

  return (
    <Helmet prioritizeSeoTags>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      {seo.robots ? <meta name="robots" content={seo.robots} /> : null}
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Skipaman Store" />
      <meta property="og:locale" content="en_ZA" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default RouteSeo;
