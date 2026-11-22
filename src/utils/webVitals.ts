/**
 * Web Vitals Performance Monitoring
 * Tracks Core Web Vitals and other performance metrics
 */

import { reportWebVitalToGa } from '../lib/analytics';

interface Metric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

type ReportHandler = (metric: Metric) => void;

// Performance thresholds
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
};

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

function reportMetric(metric: Metric) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: `${metric.value.toFixed(2)}ms`,
      rating: metric.rating,
    });
  }

  reportWebVitalToGa(metric.name, metric.value, metric.rating);

  // Send to custom analytics endpoint (disabled - endpoint not implemented)
  // Uncomment when analytics endpoint is available
  // if (process.env.NODE_ENV === 'production') {
  //   try {
  //     fetch('/api/analytics/vitals', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(metric),
  //       keepalive: true,
  //     }).catch(() => {
  //       // Silently fail - analytics is non-critical
  //     });
  //   } catch {
  //     // Ignore errors
  //   }
  // }
}

export function onCLS(onPerfEntry?: ReportHandler) {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

  try {
    let clsValue = 0;
    let sessionValue = 0;
    let sessionEntries: PerformanceEntry[] = [];

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Only count if layout shift had no recent user input
        if (!(entry as any).hadRecentInput) {
          const firstSessionEntry = sessionEntries[0];
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

          // If entry occurred less than 1 second after previous entry,
          // add to current session, otherwise start new session
          if (
            sessionValue &&
            entry.startTime - (lastSessionEntry?.startTime || 0) < 1000 &&
            entry.startTime - (firstSessionEntry?.startTime || 0) < 5000
          ) {
            sessionValue += (entry as any).value;
            sessionEntries.push(entry);
          } else {
            sessionValue = (entry as any).value;
            sessionEntries = [entry];
          }

          // If current session value is larger than current CLS value,
          // update CLS and entries
          if (sessionValue > clsValue) {
            clsValue = sessionValue;

            const metric: Metric = {
              name: 'CLS',
              value: clsValue,
              rating: getRating('CLS', clsValue * 1000),
              delta: clsValue,
              id: entry.startTime.toString(),
            };

            onPerfEntry?.(metric);
            reportMetric(metric);
          }
        }
      }
    });

    observer.observe({ type: 'layout-shift', buffered: true });
  } catch (e) {
    // Ignore errors
  }
}

export function onFCP(onPerfEntry?: ReportHandler) {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          const metric: Metric = {
            name: 'FCP',
            value: entry.startTime,
            rating: getRating('FCP', entry.startTime),
            delta: entry.startTime,
            id: entry.startTime.toString(),
          };

          onPerfEntry?.(metric);
          reportMetric(metric);
          observer.disconnect();
        }
      }
    });

    observer.observe({ type: 'paint', buffered: true });
  } catch (e) {
    // Ignore errors
  }
}

export function onLCP(onPerfEntry?: ReportHandler) {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

  try {
    let lcpValue = 0;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      lcpValue = lastEntry.renderTime || lastEntry.loadTime;

      const metric: Metric = {
        name: 'LCP',
        value: lcpValue,
        rating: getRating('LCP', lcpValue),
        delta: lcpValue,
        id: lastEntry.startTime.toString(),
      };

      onPerfEntry?.(metric);
      reportMetric(metric);
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {
    // Ignore errors
  }
}

export function onFID(onPerfEntry?: ReportHandler) {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fid = (entry as any).processingStart - entry.startTime;

        const metric: Metric = {
          name: 'FID',
          value: fid,
          rating: getRating('FID', fid),
          delta: fid,
          id: entry.startTime.toString(),
        };

        onPerfEntry?.(metric);
        reportMetric(metric);
      }
    });

    observer.observe({ type: 'first-input', buffered: true });
  } catch (e) {
    // Ignore errors
  }
}

export function onTTFB(onPerfEntry?: ReportHandler) {
  if (typeof window === 'undefined' || !('performance' in window)) return;

  try {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const ttfb = navigation.responseStart - navigation.requestStart;

      const metric: Metric = {
        name: 'TTFB',
        value: ttfb,
        rating: getRating('TTFB', ttfb),
        delta: ttfb,
        id: navigation.startTime.toString(),
      };

      onPerfEntry?.(metric);
      reportMetric(metric);
    }
  } catch (e) {
    // Ignore errors
  }
}

// Initialize all Web Vitals
export function initWebVitals() {
  if (typeof window === 'undefined') return;

  onCLS();
  onFCP();
  onLCP();
  onFID();
  onTTFB();
}

















































