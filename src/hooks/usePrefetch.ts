import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to prefetch routes on hover or when route is likely to be visited
 */
export const usePrefetch = () => {
  const location = useLocation();

  useEffect(() => {
    // Prefetch likely next routes based on current location
    const prefetchRoutes = () => {
      const routeMap: Record<string, string[]> = {
        '/': ['/shop', '/new-arrivals'],
        '/shop': ['/product', '/checkout'],
        '/product': ['/shop', '/checkout'],
        '/new-arrivals': ['/shop', '/product'],
      };

      const routesToPrefetch = routeMap[location.pathname] || [];
      
      routesToPrefetch.forEach((route) => {
        // Use link prefetching
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      });
    };

    // Small delay to not block initial render
    const timer = setTimeout(prefetchRoutes, 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);
};

/**
 * Prefetch a specific route
 */
export const prefetchRoute = (route: string) => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = route;
  document.head.appendChild(link);
};






























































