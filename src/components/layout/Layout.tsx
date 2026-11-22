import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import Header from '../features/header/Header';
import Footer from './Footer';
import ScrollToTop from '../ui/ScrollToTop';
import AdminNotificationBanner from '../notifications/AdminNotificationBanner';
import ToastNotification from '../notifications/ToastNotification';
import CookieConsentBanner from '../marketing/CookieConsentBanner';
import AnalyticsRouteListener from '../marketing/AnalyticsRouteListener';
import SupportChatWidget from '../support/SupportChatWidget';
// Promo popup (VIP100 / flash deals) disabled — re-enable: import PromoPopup and render <PromoPopup /> below.

interface LayoutProps {
  children: React.ReactNode;
}

interface SlideChangeProps {
  onSlideChange?: (isDark: boolean) => void;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [, setIsDarkSlide] = useState(false);
  const [, setIsDarkSection] = useState(false);

  const handleSlideChange = useCallback((isDark: boolean) => {
    setIsDarkSlide(isDark);
  }, []);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Get all sections with black background or full height
          const sections = document.querySelectorAll('.bg-black, .h-screen');
          const headerHeight = 80; // Approximate header height

          // Check if any dark section is in view
          for (const section of sections) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= headerHeight && rect.bottom >= headerHeight) {
              setIsDarkSection(true);
              ticking = false;
              return;
            }
          }
          setIsDarkSection(false);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Memoize children processing to avoid unnecessary re-renders
  const childrenWithProps = useMemo(() => {
    return React.Children.map(children, child => {
      if (React.isValidElement<SlideChangeProps>(child)) {
        return React.cloneElement(child, { onSlideChange: handleSlideChange });
      }
      return child;
    });
  }, [children, handleSlideChange]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-red-900/5 via-black/10 to-red-800/5">
      <AnalyticsRouteListener />
      <AdminNotificationBanner />
      <Header />
      <main className="flex-grow">
        {childrenWithProps}
      </main>
      <Footer />
      <ScrollToTop />
      <ToastNotification position="top-right" maxNotifications={5} />
      <CookieConsentBanner />
      <SupportChatWidget />
    </div>
  );
};

export default memo(Layout);