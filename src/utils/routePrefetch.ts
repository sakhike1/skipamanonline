/**
 * Route prefetching utilities for faster navigation
 */

const prefetchedRoutes = new Set<string>();

/**
 * Prefetch a route module
 */
export const prefetchRouteModule = (routePath: string) => {
  if (prefetchedRoutes.has(routePath)) return;
  
  prefetchedRoutes.add(routePath);
  
  // Map routes to their module paths
  const routeMap: Record<string, () => Promise<unknown>> = {
    '/shop': () => import('../pages/ShopPage'),
    '/product': () => import('../pages/ProductPage'),
    '/new-arrivals': () => import('../pages/NewArrivalsPage'),
    '/checkout': () => import('../pages/EnhancedCheckoutPage'),
    '/wishlist': () => import('../pages/WishlistPage'),
    '/orders': () => import('../pages/OrdersPage'),
    '/profile': () => import('../pages/ProfilePage'),
    '/settings': () => import('../pages/SettingsPage'),
  };

  const routeKey = Object.keys(routeMap).find(key => routePath.startsWith(key));
  if (routeKey && routeMap[routeKey]) {
    // Prefetch the module with error handling
    // Use requestIdleCallback for non-blocking prefetch
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        routeMap[routeKey]().catch((error) => {
          // Silently fail - prefetching is optional
          if (process.env.NODE_ENV === 'development') {
            console.warn(`Failed to prefetch route ${routeKey}:`, error);
          }
        });
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        routeMap[routeKey]().catch((error) => {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`Failed to prefetch route ${routeKey}:`, error);
          }
        });
      }, 100);
    }
  }
};

/**
 * Prefetch routes on link hover
 */
export const setupLinkPrefetching = () => {
  if (typeof window === 'undefined') return;

  const handleLinkHover = (e: MouseEvent) => {
    const target = e.target;
    
    // Check if target is an HTMLElement and has closest method
    if (!target || !(target instanceof HTMLElement) || typeof target.closest !== 'function') {
      return;
    }
    
    const link = (target as HTMLElement).closest('a[href]') as HTMLAnchorElement;
    
    if (link && link.href) {
      try {
        const url = new URL(link.href);
        if (url.origin === window.location.origin) {
          prefetchRouteModule(url.pathname);
        }
      } catch {
        // Invalid URL, ignore
      }
    }
  };

  // Use event delegation for better performance
  document.addEventListener('mouseenter', handleLinkHover, { 
    capture: true,
    passive: true 
  } as AddEventListenerOptions);

  return () => {
    document.removeEventListener('mouseenter', handleLinkHover, { capture: true });
  };
};


































































