import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Enhanced route prefetching hook
 * Prefetches routes on hover and based on current location
 */
export const useRoutePrefetch = () => {
  const location = useLocation();

  // Prefetch route component
  const prefetchRoute = useCallback((route: string) => {
    const routeMap: Record<string, () => Promise<unknown>> = {
      '/shop': () => import('../pages/ShopPage'),
      '/new-arrivals': () => import('../pages/NewArrivalsPage'),
      '/product': () => import('../pages/ProductPage'),
      '/checkout': () => import('../pages/EnhancedCheckoutPage'),
      '/about': () => import('../pages/About'),
      '/lookbook': () => import('../pages/LookbookPage'),
      '/virtual-stylist': () => import('../pages/VirtualStylistPage'),
      '/printing': () => import('../pages/PrintingHubPage'),
      '/locations': () => import('../pages/PrintingLocationPage'),
      '/services': () => import('../pages/PrintingServicePage'),
      '/wishlist': () => import('../pages/WishlistPage'),
      '/login': () => import('../components/auth/LoginForm'),
      '/register': () => import('../components/auth/RegisterForm'),
    };

    // Extract base route (remove dynamic segments)
    const baseRoute = route.split('/').slice(0, 2).join('/') || '/';
    const prefetchFn = routeMap[baseRoute];

    if (prefetchFn) {
      // Prefetch the route component
      prefetchFn().catch(() => {
        // Silently fail - prefetching is non-critical
      });
    }
  }, []);

  // Prefetch likely next routes based on current location
  useEffect(() => {
    const routeMap: Record<string, string[]> = {
      '/': ['/shop', '/new-arrivals'],
      '/shop': ['/product', '/checkout'],
      '/product': ['/shop', '/checkout'],
      '/new-arrivals': ['/shop', '/product'],
      '/checkout': ['/shop'],
    };

    const routesToPrefetch = routeMap[location.pathname] || [];

    // Small delay to not block initial render
    const timer = setTimeout(() => {
      routesToPrefetch.forEach((route) => {
        prefetchRoute(route);
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname, prefetchRoute]);

  // Create prefetch handler for links
  const handleLinkHover = useCallback(
    (route: string) => {
      prefetchRoute(route);
    },
    [prefetchRoute]
  );

  return { prefetchRoute, handleLinkHover };
};

/**
 * Prefetch route component
 */
export const prefetchRoute = (route: string) => {
  const routeMap: Record<string, () => Promise<unknown>> = {
    '/shop': () => import('../pages/ShopPage'),
    '/new-arrivals': () => import('../pages/NewArrivalsPage'),
    '/product': () => import('../pages/ProductPage'),
    '/checkout': () => import('../pages/EnhancedCheckoutPage'),
    '/about': () => import('../pages/About'),
    '/lookbook': () => import('../pages/LookbookPage'),
    '/virtual-stylist': () => import('../pages/VirtualStylistPage'),
    '/printing': () => import('../pages/PrintingHubPage'),
    '/locations': () => import('../pages/PrintingLocationPage'),
    '/services': () => import('../pages/PrintingServicePage'),
    '/wishlist': () => import('../pages/WishlistPage'),
    '/login': () => import('../components/auth/LoginForm'),
    '/register': () => import('../components/auth/RegisterForm'),
  };

  const baseRoute = route.split('/').slice(0, 2).join('/') || '/';
  const prefetchFn = routeMap[baseRoute];

  if (prefetchFn) {
    prefetchFn().catch(() => {
      // Silently fail
    });
  }
};
