/**
 * Application-wide constants
 */

/** Store policies & trust copy (Customer Assurance, checkout hints, etc.) */
export const APP_CONFIG = {
  DELIVERY_TIMEFRAME: '2–3 business days',
  /** Free delivery threshold in ZAR (Skipaman store) */
  FREE_SHIPPING_MIN_ZAR: 500,
  RETURN_WINDOW_DAYS: 30,
  /** Wording only — do not append “business days” again in UI */
  REFUND_PROCESSING: '5–7 business days',
} as const;

export const TRUST_INDICATORS = {
  AVERAGE_RATING: '4.9',
  HAPPY_CUSTOMERS: '10,000+',
  SATISFACTION_RATE: '99%',
  SUPPORT_AVAILABILITY: '24/7',
} as const;

export const TOAST_DURATION = 4000; // milliseconds

export const ANIMATION_DURATIONS = {
  FAST: 300,
  NORMAL: 500,
  SLOW: 800,
} as const;

