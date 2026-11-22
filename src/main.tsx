import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';

// EMERGENCY FIX: Completely disable service worker to prevent chunk conflicts
// The service worker is causing "Cannot access 'te' before initialization" errors
// by serving stale cached JavaScript chunks that conflict with new ones
const ENABLE_SERVICE_WORKER = false; // Force disabled - SW causing critical errors

// Emergency cache clearing on app load
if (typeof window !== 'undefined' && 'caches' in window) {
  // Clear all skipaman caches immediately
  caches.keys().then(cacheNames => {
    const skipamanCaches = cacheNames.filter(name => name.includes('skipaman'));
    return Promise.all(skipamanCaches.map(name => {
      console.log('Emergency cache clear:', name);
      return caches.delete(name);
    }));
  }).then(() => {
    console.log('Emergency cache clearing completed');
  });
}

// Unregister any existing service workers
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      console.log('Emergency service worker unregistration:', registration.scope);
      registration.unregister();
    });
  });
}

if (ENABLE_SERVICE_WORKER && import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const { registerServiceWorker } = await import('./utils/serviceWorker');
      registerServiceWorker();
    } catch (error) {
      console.warn('Service worker registration skipped:', error);
    }
  });
}

// Notification permission is requested via explicit user action in Settings.

// Listen for service worker force reload messages
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'FORCE_RELOAD') {
      console.log('Force reload requested by service worker');
      window.location.reload();
    }
  });
}

// Suppress noisy unhandled rejections from media autoplay interruptions.
// Chrome often emits: "AbortError: The play() request was interrupted by a call to pause()."
window.addEventListener('unhandledrejection', (event) => {
  const reason = (event as PromiseRejectionEvent).reason as
    | { name?: unknown; message?: unknown }
    | unknown;
  const name =
    typeof (reason as { name?: unknown } | null)?.name === 'string'
      ? ((reason as { name: string }).name as string)
      : '';
  const message =
    typeof (reason as { message?: unknown } | null)?.message === 'string'
      ? ((reason as { message: string }).message as string)
      : String(reason ?? '');
  if (name === 'AbortError' && message.includes('play() request was interrupted')) {
    event.preventDefault();
  }
});

// Remove HTML loading screen immediately when React starts loading
const removeLoadingScreen = () => {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    // Force remove with multiple methods
    loadingScreen.style.display = 'none';
    loadingScreen.remove();
  }
  // Also add CSS class to body as backup
  document.body.classList.add('app-loaded');
  // Force hide with CSS
  const style = document.createElement('style');
  style.textContent = '#loading-screen { display: none !important; }';
  document.head.appendChild(style);
};

// Remove loading screen immediately
removeLoadingScreen();

// Also remove on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', removeLoadingScreen);
} else {
  removeLoadingScreen();
}

// Setup route prefetching for faster navigation
import { setupLinkPrefetching } from './utils/routePrefetch';

setupLinkPrefetching();

// Initialize Web Vitals monitoring
import { initWebVitals } from './utils/webVitals';

initWebVitals();

import { setupLazyImages } from './utils/imageOptimizer';
import { initImagePreloading } from './utils/imagePreloader';
// Lazy load images and setup image optimization
import { lazyLoadImages } from './utils/performanceOptimizer';

if (typeof window !== 'undefined') {
  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      lazyLoadImages();
      setupLazyImages();
      initImagePreloading(); // Initialize image preloading
    });
  } else {
    lazyLoadImages();
    setupLazyImages();
    initImagePreloading(); // Initialize image preloading
  }
}

// StrictMode is disabled: PayPal's JS SDK + @paypal/react-paypal-js often throw or misbehave
// under React 18 dev double-mount (checkout would hit the root ErrorBoundary).
ReactDOM.createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
