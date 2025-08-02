// Performance monitoring utilities

// Declare gtag for Google Analytics (if available)
declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      parameters?: Record<string, any>
    ) => void;
  }
}

export const performanceMetrics = {
  // Track page load times
  trackPageLoad: (pageName: string) => {
    const startTime = performance.now();
    
    return () => {
      const loadTime = performance.now() - startTime;
      console.log(`🚀 ${pageName} loaded in ${loadTime.toFixed(2)}ms`);
      
      // Send to analytics if available
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'page_load_time', {
          page_name: pageName,
          load_time: loadTime,
        });
      }
    };
  },

  // Track component render times
  trackComponentRender: (componentName: string) => {
    const startTime = performance.now();
    
    return () => {
      const renderTime = performance.now() - startTime;
      if (renderTime > 16) { // Only log if render takes longer than 16ms (60fps)
        console.warn(`⚠️ ${componentName} took ${renderTime.toFixed(2)}ms to render`);
      }
    };
  },

  // Monitor memory usage
  trackMemoryUsage: () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);
      
      console.log(`💾 Memory: ${usedMB}MB / ${totalMB}MB used`);
      
      if (usedMB > totalMB * 0.8) {
        console.warn('⚠️ High memory usage detected');
      }
    }
  },

  // Preload critical resources
  preloadResource: (url: string, type: 'script' | 'style' | 'image') => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = type;
    document.head.appendChild(link);
  },

  // Optimize images
  optimizeImage: (src: string, width?: number, quality: number = 80) => {
    // Add image optimization parameters
    const url = new URL(src, window.location.origin);
    if (width) url.searchParams.set('w', width.toString());
    url.searchParams.set('q', quality.toString());
    return url.toString();
  },
};

// Performance observer for long tasks
export const setupPerformanceObserver = () => {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) { // Log tasks longer than 50ms
          console.warn(`🐌 Long task detected: ${entry.duration.toFixed(2)}ms`, entry);
        }
      }
    });
    
    observer.observe({ entryTypes: ['longtask'] });
  }
};

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  setupPerformanceObserver();
  
  // Track initial page load
  window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`🎯 Initial page load: ${loadTime.toFixed(2)}ms`);
    
    // Track memory usage
    performanceMetrics.trackMemoryUsage();
  });
  
  // Monitor for memory leaks
  setInterval(() => {
    performanceMetrics.trackMemoryUsage();
  }, 30000); // Check every 30 seconds
}; 