import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Register service worker for PWA functionality
// Temporarily disabled to troubleshoot MIME type issues
/*
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, show update prompt
                if (confirm('New version available! Reload to update?')) {
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
*/

// Request notification permission
if ('Notification' in window) {
  Notification.requestPermission();
}

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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
