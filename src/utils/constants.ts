/**
 * Application-wide constants
 */

export const APP_CONFIG = {
  FREE_SHIPPING_THRESHOLD: 50,
  DELIVERY_DAYS: '2-3 business days',
  RETURN_DAYS: 30,
  REFUND_DAYS: '5-7 business days',
} as const;

export const TRUST_INDICATORS = {
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

