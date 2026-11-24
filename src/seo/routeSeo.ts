import {
  SITE_DEFAULT_DESCRIPTION,
  SITE_DEFAULT_DOCUMENT_TITLE,
  SITE_DEFAULT_OG_IMAGE_PATH,
} from '../constants/siteSeo';
import { getPrintingSeoForPath } from '../data/printingLandingContent';
import { normalizeUrlPathname } from './normalizePath';

export interface RouteSeoPayload {
  title: string;
  description: string;
  /** Empty = indexable (robots meta omitted; crawlers default to index). */
  robots?: string;
}

const FALLBACK: RouteSeoPayload = {
  title: SITE_DEFAULT_DOCUMENT_TITLE,
  description: SITE_DEFAULT_DESCRIPTION,
};

const BY_PATH: Record<string, RouteSeoPayload> = {
  '/': {
    title: SITE_DEFAULT_DOCUMENT_TITLE,
    description: SITE_DEFAULT_DESCRIPTION,
  },
  '/shop': {
    title: 'Shop Collection | Skipaman Tees & Streetwear Online | South Africa',
    description:
      'Browse Skipaman retail: featured drops, filters by category and price, and fast checkout. Premium tees, graphics, and layers shipped across South Africa.',
  },
  '/new-arrivals': {
    title: 'New Arrivals | Latest Skipaman Drops & Layers | South Africa',
    description:
      'Shop the newest Skipaman pieces, tees, graphics, and layers. Filter by category and price cap. Delivery across South Africa.',
  },
  '/virtual-stylist': {
    title:
      'T-Shirt Printing Centurion | Uniform Printing & Corporate Branding | Skipaman South Africa',
    description:
      'Request a quote for custom t-shirt printing, school uniforms, staff uniforms, caps, and branded mugs, DTF, screen printing, and vinyl. Based in Centurion, Gauteng; delivery nationwide.',
  },
  '/design-studio': {
    title: 'Design Studio | Design Your Own T-Shirt, Hoodie or Cap | Skipaman South Africa',
    description:
      'Design your own tee, hoodie or cap online: add text, shapes or your own image, share your design, and request a quote from Skipaman.',
  },
  '/lookbook': {
    title: 'Lookbook | Retail Styling & Custom Branding (Schools, Teams, Business) | Skipaman',
    description:
      'Explore Skipaman lookbook stories: retail collection and custom branding for schools, teams, and businesses.',
  },
  '/about': {
    title: 'About Skipaman Store | Premium Streetwear & Branding South Africa',
    description:
      'Learn about Skipaman, premium apparel, custom printing, and branding for schools and businesses across South Africa.',
  },
  '/terms': {
    title: 'Terms & Conditions | Skipaman Store',
    description:
      'Terms and conditions for using the Skipaman website, placing orders, custom printing, delivery, and returns in South Africa.',
  },
  '/privacy': {
    title: 'Privacy Policy | Skipaman Store',
    description:
      'How Skipaman collects and uses personal information, cookies, POPIA-aligned practices, and your privacy rights in South Africa.',
  },
  '/search': {
    title: 'Search Products | Skipaman Store',
    description: 'Search Skipaman products by name or category.',
  },
  '/reviews': {
    title: 'Customer Reviews | Skipaman Store',
    description: 'Read customer reviews and feedback about Skipaman products and service.',
  },
  '/login': {
    title: 'Sign In | Skipaman Store',
    description: 'Sign in to your Skipaman account to shop, track orders, and manage your profile.',
    robots: 'noindex, follow',
  },
  '/register': {
    title: 'Create Account | Skipaman Store',
    description: 'Create a Skipaman account to checkout faster and manage orders.',
    robots: 'noindex, follow',
  },
  '/checkout': {
    title: 'Checkout | Skipaman Store',
    description: 'Complete your Skipaman order securely.',
    robots: 'noindex, nofollow',
  },
  '/payment/success': {
    title: 'Payment Successful | Skipaman Store',
    description: 'Your payment was received. Thank you for shopping Skipaman.',
    robots: 'noindex, nofollow',
  },
  '/payment/cancel': {
    title: 'Payment Cancelled | Skipaman Store',
    description: 'Your payment was cancelled. You can return to your cart to try again.',
    robots: 'noindex, nofollow',
  },
  '/wishlist': {
    title: 'Wishlist | Skipaman Store',
    description: 'Your saved Skipaman products.',
    robots: 'noindex, follow',
  },
  '/orders': {
    title: 'Orders | Skipaman Store',
    description: 'View your Skipaman order history.',
    robots: 'noindex, follow',
  },
  '/profile': {
    title: 'Profile | Skipaman Store',
    description: 'Manage your Skipaman profile.',
    robots: 'noindex, follow',
  },
  '/settings': {
    title: 'Account Settings | Skipaman Store',
    description: 'Update your Skipaman account settings.',
    robots: 'noindex, follow',
  },
  '/client-center': {
    title: 'Client Center | Skipaman Store',
    description: 'Skipaman client hub for orders and support.',
    robots: 'noindex, follow',
  },
  '/admin': {
    title: 'Admin | Skipaman',
    description: 'Skipaman administration.',
    robots: 'noindex, nofollow',
  },
  '/csm': {
    title: 'CSM | Skipaman',
    description: 'Skipaman customer success tools.',
    robots: 'noindex, nofollow',
  },
};

const PRODUCT: RouteSeoPayload = {
  title: 'Product | Skipaman Store',
  description: 'Shop this Skipaman product, sizes, colours, and secure checkout.',
};

const ORDER_DETAIL: RouteSeoPayload = {
  title: 'Order Details | Skipaman Store',
  description: 'Track and manage your Skipaman order.',
  robots: 'noindex, follow',
};

export function getRouteSeo(pathname: string): RouteSeoPayload {
  const normalized = normalizeUrlPathname(pathname);

  const printingSeo = getPrintingSeoForPath(normalized);
  if (printingSeo) {
    return printingSeo;
  }

  if (normalized.startsWith('/product/')) {
    return PRODUCT;
  }
  if (normalized.startsWith('/orders/') && normalized !== '/orders') {
    return ORDER_DETAIL;
  }

  return BY_PATH[normalized] ?? FALLBACK;
}

export function getDefaultOgImagePath(): string {
  return SITE_DEFAULT_OG_IMAGE_PATH;
}
