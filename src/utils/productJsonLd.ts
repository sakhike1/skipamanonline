import type { Product, ReviewStats } from '../types';
import { absolutizeUrl } from '../seo/publicSiteUrl';

/**
 * schema.org Product JSON-LD for PDP SEO (Google Merchant / rich results eligible fields).
 */
export function buildProductJsonLd(
  product: Product,
  reviewStats: ReviewStats | null,
  canonicalUrl: string,
  siteUrl: string,
): Record<string, unknown> {
  const fallbackImg = '/images/og-image.jpg';
  const paths = product.images?.length ? product.images : [fallbackImg];
  const images = paths.map((p) => absolutizeUrl(p, siteUrl));

  const description =
    product.description?.replace(/\s+/g, ' ').trim().slice(0, 5000) || product.name;

  const priceNum = product.price / 100;
  const priceStr =
    Number.isFinite(priceNum) && priceNum >= 0 ? priceNum.toFixed(2) : '0.00';

  const aggregateRating =
    reviewStats && reviewStats.totalReviews > 0
      ? {
          '@type': 'AggregateRating',
          ratingValue: Math.min(5, Math.max(1, reviewStats.averageRating)),
          reviewCount: reviewStats.totalReviews,
          bestRating: 5,
          worstRating: 1,
        }
      : product.rating != null &&
          product.reviewCount != null &&
          product.reviewCount > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined;

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description,
    image: images.length === 1 ? images[0] : images,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'Skipaman',
    },
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'ZAR',
      price: priceStr,
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Skipaman Store',
      },
    },
  };

  if (aggregateRating) {
    jsonLd.aggregateRating = aggregateRating;
  }

  return jsonLd;
}

export function truncateMetaDescription(text: string, maxLen = 158): string {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= maxLen) return t;
  const cut = t.slice(0, maxLen - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trimEnd() + '…';
}
