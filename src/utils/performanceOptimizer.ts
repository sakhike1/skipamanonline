/**
 * Performance Optimization Utilities
 * Provides utilities for optimizing React app performance
 */

import { startTransition, useDeferredValue, useMemo, useCallback } from 'react';

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Request animation frame throttle
 */
export function rafThrottle<T extends (...args: unknown[]) => unknown>(
  func: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;

  return function executedFunction(...args: Parameters<T>) {
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        func(...args);
        rafId = null;
      });
    }
  };
}

/**
 * Lazy load images with intersection observer
 */
export function lazyLoadImages() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return;
  }

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach((img) => {
    imageObserver.observe(img);
  });
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string, crossorigin?: string) {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (crossorigin) link.crossOrigin = crossorigin;
  document.head.appendChild(link);
}

/**
 * Prefetch resource for future use
 */
export function prefetchResource(href: string, as: string) {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
}

/**
 * Optimize scroll handlers
 */
export function optimizeScrollHandler(handler: () => void) {
  return rafThrottle(handler);
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get connection speed
 */
export function getConnectionSpeed(): 'slow' | 'fast' | 'unknown' {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return 'unknown';
  }

  interface NavigatorWithConnection extends Navigator {
    connection?: NetworkInformation;
    mozConnection?: NetworkInformation;
    webkitConnection?: NetworkInformation;
  }

  interface NetworkInformation {
    effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  }

  const nav = navigator as NavigatorWithConnection;
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
  
  if (!connection) return 'unknown';

  const effectiveType = connection.effectiveType;
  if (effectiveType === 'slow-2g' || effectiveType === '2g') return 'slow';
  return 'fast';
}

/**
 * React hook for optimized value updates
 */
export function useOptimizedValue<T>(value: T) {
  const deferredValue = useDeferredValue(value);
  
  return useMemo(() => deferredValue, [deferredValue]);
}

/**
 * React hook for optimized callbacks
 * Note: This hook accepts dynamic dependencies, which requires disabling
 * the exhaustive-deps rule. The callback is always included in dependencies.
 */
export function useOptimizedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  deps: React.DependencyList
) {
  return useCallback(
    (...args: Parameters<T>) => {
      startTransition(() => {
        callback(...args);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callback, ...deps]
  );
}

/**
 * Measure performance of a function
 */
export function measurePerformance<T>(
  name: string,
  fn: () => T
): T {
  if (process.env.NODE_ENV === 'development' && typeof performance !== 'undefined') {
    performance.mark(`${name}-start`);
    const result = fn();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    const measure = performance.getEntriesByName(name)[0];
    if (measure) {
      console.log(`[Performance] ${name}: ${measure.duration.toFixed(2)}ms`);
    }
    return result;
  }
  return fn();
}












