/** Marketing analytics (GA4 + Meta Pixel). Loaded only after cookie consent for marketing. */

const CONSENT_KEY = 'skipaman_cookie_consent_v1';

export type ConsentPayload = {
  marketing: boolean;
  updatedAt: number;
};

export function getConsent(): ConsentPayload | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentPayload;
    if (typeof parsed.marketing !== 'boolean' || typeof parsed.updatedAt !== 'number') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function hasMarketingConsent(): boolean {
  return getConsent()?.marketing === true;
}

export function hasRecordedConsent(): boolean {
  return getConsent() !== null;
}

export function setConsent(choice: 'necessary_only' | 'all'): void {
  const marketing = choice === 'all';
  const payload: ConsentPayload = { marketing, updatedAt: Date.now() };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(payload));
  if (marketing) {
    loadMarketingScripts();
    queueMicrotask(() => {
      trackPageView(`${window.location.pathname}${window.location.search}`);
    });
  }
}

let scriptsInjected = false;

function readGaId(): string | undefined {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID;
  return typeof id === 'string' && id.trim().length > 0 ? id.trim() : undefined;
}

function readPixelId(): string | undefined {
  const id = import.meta.env.VITE_META_PIXEL_ID;
  return typeof id === 'string' && id.trim().length > 0 ? id.trim() : undefined;
}

/** Call on app load if consent already granted (return visit). */
export function initMarketingAnalyticsFromConsent(): void {
  if (hasMarketingConsent()) {
    loadMarketingScripts();
  }
}

export function loadMarketingScripts(): void {
  if (!hasMarketingConsent() || scriptsInjected) return;
  const gaId = readGaId();
  const pixelId = readPixelId();
  if (!gaId && !pixelId) {
    scriptsInjected = true;
    return;
  }

  scriptsInjected = true;

  if (gaId) {
    window.dataLayer = window.dataLayer ?? [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', gaId, { send_page_view: false });

    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
    document.head.appendChild(gaScript);
  }

  if (pixelId && /^\d{8,24}$/.test(pixelId)) {
    const boot = document.createElement('script');
    boot.textContent =
      "!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');";
    document.head.appendChild(boot);
    const init = document.createElement('script');
    init.textContent = `fbq('init','${pixelId}');`;
    document.head.appendChild(init);
  }
}

export function trackPageView(pathWithQuery: string): void {
  if (!hasMarketingConsent()) return;
  const gaId = readGaId();
  if (window.gtag && gaId) {
    window.gtag('event', 'page_view', {
      page_path: pathWithQuery,
      page_location: typeof window !== 'undefined' ? window.location.href : undefined,
      page_title: typeof document !== 'undefined' ? document.title : undefined,
    });
  }
  if (window.fbq) {
    window.fbq('track', 'PageView');
  }
}

export type PurchaseItem = {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
};

export function trackPurchase(params: {
  transactionId: string;
  value: number;
  currency: string;
  items: PurchaseItem[];
}): void {
  if (!hasMarketingConsent()) return;
  const { transactionId, value, currency, items } = params;

  if (window.gtag && readGaId()) {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value,
      currency,
      items: items.map((i) => ({
        item_id: i.item_id,
        item_name: i.item_name,
        price: i.price,
        quantity: i.quantity,
      })),
    });
  }

  if (window.fbq && readPixelId()) {
    window.fbq('track', 'Purchase', {
      value,
      currency,
      content_type: 'product',
      content_ids: items.map((i) => i.item_id),
      num_items: items.reduce((s, i) => s + i.quantity, 0),
    });
  }
}

export function trackSignUp(method: string): void {
  if (!hasMarketingConsent()) return;
  if (window.gtag && readGaId()) {
    window.gtag('event', 'sign_up', { method });
  }
  if (window.fbq && readPixelId()) {
    window.fbq('track', 'CompleteRegistration');
  }
}

export function trackLead(source: string): void {
  if (!hasMarketingConsent()) return;
  if (window.gtag && readGaId()) {
    window.gtag('event', 'generate_lead', { currency: 'ZAR', value: 0, lead_source: source });
  }
  if (window.fbq && readPixelId()) {
    window.fbq('track', 'Lead', { content_name: source });
  }
}

/** Web Vitals → GA (non-interaction). */
export function reportWebVitalToGa(metricName: string, valueMs: number, rating: string): void {
  if (!hasMarketingConsent() || !window.gtag || !readGaId()) return;
  window.gtag('event', metricName, {
    event_category: 'Web Vitals',
    value: Math.round(valueMs),
    metric_rating: rating,
    non_interaction: true,
  });
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}
