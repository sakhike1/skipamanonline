/**
 * Performance utilities for optimizing the app
 */

/**
 * Debounce function to limit how often a function can be called
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function to limit function execution rate
 */
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Preload an image
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Preload multiple images
 */
export const preloadImages = async (srcs: string[]): Promise<void[]> => {
  return Promise.all(srcs.map(preloadImage));
};

/**
 * Lazy load a script
 */
export const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

/**
 * Check if user is on a slow connection
 */
interface NetworkInformation {
  effectiveType?: string;
  saveData?: boolean;
}

export const isSlowConnection = (): boolean => {
  if ('connection' in navigator) {
    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    return (
      connection?.effectiveType === 'slow-2g' ||
      connection?.effectiveType === '2g' ||
      connection?.saveData === true
    );
  }
  return false;
};

/**
 * Measure performance of a function
 */
export const measurePerformance = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  label: string
): T => {
  return ((...args: Parameters<T>) => {
    if (process.env.NODE_ENV === 'development') {
      performance.mark(`${label}-start`);
      const result = fn(...args);
      performance.mark(`${label}-end`);
      performance.measure(label, `${label}-start`, `${label}-end`);
      const measure = performance.getEntriesByName(label)[0];
      console.log(`${label}: ${measure.duration.toFixed(2)}ms`);
      return result;
    }
    return fn(...args);
  }) as T;
};


































































