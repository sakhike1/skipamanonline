'use client'

import { useEffect, useState } from 'react'

interface PerformanceMetrics {
  fcp: number | null // First Contentful Paint
  lcp: number | null // Largest Contentful Paint
  fid: number | null // First Input Delay
  cls: number | null // Cumulative Layout Shift
  ttfb: number | null // Time to First Byte
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  })

  useEffect(() => {
    // Only run in development or with performance monitoring enabled
    if (process.env.NODE_ENV !== 'development' && !process.env.NEXT_PUBLIC_PERFORMANCE_MONITOR) {
      return
    }

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      
      entries.forEach((entry) => {
        switch (entry.entryType) {
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              setMetrics(prev => ({ ...prev, fcp: Math.round(entry.startTime) }))
            }
            break
          case 'largest-contentful-paint':
            setMetrics(prev => ({ ...prev, lcp: Math.round(entry.startTime) }))
            break
          case 'first-input':
            setMetrics(prev => ({ ...prev, fid: Math.round(entry.processingStart - entry.startTime) }))
            break
          case 'layout-shift':
            if (!entry.hadRecentInput) {
              setMetrics(prev => ({ ...prev, cls: (prev.cls || 0) + entry.value }))
            }
            break
          case 'navigation':
            const navEntry = entry as PerformanceNavigationTiming
            setMetrics(prev => ({ 
              ...prev, 
              ttfb: Math.round(navEntry.responseStart - navEntry.requestStart) 
            }))
            break
        }
      })
    })

    // Observe different performance entry types
    try {
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift', 'navigation'] })
    } catch (error) {
      console.warn('Performance Observer not supported:', error)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  // Don't render in production unless explicitly enabled
  if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_PERFORMANCE_MONITOR) {
    return null
  }

  const getScoreColor = (value: number | null, thresholds: { good: number; poor: number }) => {
    if (value === null) return 'text-gray-500'
    if (value <= thresholds.good) return 'text-green-600'
    if (value <= thresholds.poor) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreText = (value: number | null, thresholds: { good: number; poor: number }) => {
    if (value === null) return 'N/A'
    if (value <= thresholds.good) return 'Good'
    if (value <= thresholds.poor) return 'Needs Improvement'
    return 'Poor'
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-xs font-mono z-50 max-w-xs">
      <h3 className="font-bold mb-2 text-gray-800">Performance Metrics</h3>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>FCP:</span>
          <span className={getScoreColor(metrics.fcp, { good: 1800, poor: 3000 })}>
            {metrics.fcp ? `${metrics.fcp}ms` : 'N/A'} ({getScoreText(metrics.fcp, { good: 1800, poor: 3000 })})
          </span>
        </div>
        <div className="flex justify-between">
          <span>LCP:</span>
          <span className={getScoreColor(metrics.lcp, { good: 2500, poor: 4000 })}>
            {metrics.lcp ? `${metrics.lcp}ms` : 'N/A'} ({getScoreText(metrics.lcp, { good: 2500, poor: 4000 })})
          </span>
        </div>
        <div className="flex justify-between">
          <span>FID:</span>
          <span className={getScoreColor(metrics.fid, { good: 100, poor: 300 })}>
            {metrics.fid ? `${metrics.fid}ms` : 'N/A'} ({getScoreText(metrics.fid, { good: 100, poor: 300 })})
          </span>
        </div>
        <div className="flex justify-between">
          <span>CLS:</span>
          <span className={getScoreColor(metrics.cls, { good: 0.1, poor: 0.25 })}>
            {metrics.cls ? metrics.cls.toFixed(3) : 'N/A'} ({getScoreText(metrics.cls, { good: 0.1, poor: 0.25 })})
          </span>
        </div>
        <div className="flex justify-between">
          <span>TTFB:</span>
          <span className={getScoreColor(metrics.ttfb, { good: 800, poor: 1800 })}>
            {metrics.ttfb ? `${metrics.ttfb}ms` : 'N/A'} ({getScoreText(metrics.ttfb, { good: 800, poor: 1800 })})
          </span>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-gray-200 text-gray-500">
        <div>Core Web Vitals</div>
      </div>
    </div>
  )
}
