import { useEffect } from 'react';

/**
 * Hook to monitor and log performance metrics
 */
export const usePerformance = () => {
  useEffect(() => {
    if (import.meta.env.DEV && 'performance' in window) {
      // Monitor page load performance
      window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (perfData) {
          console.log('Performance Metrics:', {
            'DOM Content Loaded': `${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`,
            'Load Complete': `${perfData.loadEventEnd - perfData.loadEventStart}ms`,
            'Total Load Time': `${perfData.loadEventEnd - perfData.fetchStart}ms`,
          });
        }
      });

      // Monitor long tasks (blocking operations) - Only log significant ones
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              // Only warn about tasks longer than 100ms (more significant)
              // Tasks 50-100ms are common and usually not problematic
              if (entry.duration > 100) {
                console.warn('Long task detected (>100ms):', {
                  duration: `${entry.duration.toFixed(2)}ms`,
                  startTime: `${entry.startTime.toFixed(2)}ms`,
                  name: entry.name || 'Unknown',
                });
              }
            }
          });
          observer.observe({ entryTypes: ['longtask'] });
        } catch {
          // Long task observer not supported
        }
      }
    }
  }, []);
};


































































