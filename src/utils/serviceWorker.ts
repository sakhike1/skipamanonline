/**
 * Service Worker registration and management
 */

export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none', // Don't cache the service worker itself - always fetch fresh
      });

      // Force immediate update check
      await registration.update();

      // Check for updates more frequently
      setInterval(() => {
        registration.update();
      }, 5 * 60 * 1000); // Check every 5 minutes

      // Handle updates - force immediate activation
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              // New service worker available - force activation
              if (navigator.serviceWorker.controller) {
                console.log('New service worker available! Activating immediately...');
                // Force skip waiting and claim
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload(); // Reload to use new service worker
              } else {
                // First install
                console.log('Service worker installed');
              }
            }
          });
        }
      });

      // Listen for controller change (when new service worker takes over)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service worker controller changed - reloading page');
        window.location.reload();
      });

      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
};

export const unregisterServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.unregister();
    } catch (error) {
      console.error('Service Worker unregistration failed:', error);
    }
  }
};







































