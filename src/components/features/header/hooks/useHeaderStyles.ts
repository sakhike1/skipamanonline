import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../../../context/useAuth';
import { useHeader } from '../../../../context/HeaderContext';

export const useHeaderStyles = (isScrolled: boolean) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { isHeaderDark } = useHeader();

  const isHomePage = location.pathname === '/';
  const isShopPage = location.pathname === '/shop';
  const isAboutPage = location.pathname === '/about';
  const isCheckoutPage = location.pathname === '/checkout';
  /** Customer + staff sign-in (staff uses `/admin/login` and must not use the transparent hero header). */
  const isLoginPage =
    location.pathname === '/login' || location.pathname === '/admin/login';
  const isRegisterPage = location.pathname === '/register';
  const isLookbookPage = location.pathname === '/lookbook';
  const isReviewsPage = location.pathname === '/reviews';
  const isBrandingPage = location.pathname === '/virtual-stylist';
  /** Printing hub + location/service landings use light heroes — header must stay solid for contrast */
  const isPrintingSurface =
    location.pathname === '/printing' ||
    location.pathname.startsWith('/locations/') ||
    location.pathname.startsWith('/services/');

  const getHeaderClassName = useCallback(() => {
    if (isAuthenticated) {
      return 'bg-black/95 backdrop-blur-sm shadow-md py-2';
    }
    if (isAboutPage || isCheckoutPage) {
      return 'bg-gradient-to-r from-purple-900/95 via-black/90 to-black/95 backdrop-blur-sm shadow-md py-2';
    }
    // Solid bar so white nav links stay readable on light auth page backgrounds
    if (isLoginPage || isRegisterPage) {
      return 'bg-black border-b border-white/10 shadow-lg py-2.5';
    }
    if (isHeaderDark || isShopPage || isLookbookPage || isReviewsPage || isBrandingPage || isPrintingSurface) {
      return 'bg-black/95 backdrop-blur-sm shadow-md py-2';
    }
    if (isScrolled) {
      // Always keep dark background when scrolled to maintain white text visibility
      return 'bg-black/90 backdrop-blur-sm shadow-lg py-3';
    }
    return 'py-4 backdrop-blur-[2px] bg-gradient-to-b from-black/30 to-transparent';
  }, [
    isAuthenticated,
    isAboutPage,
    isCheckoutPage,
    isHeaderDark,
    isShopPage,
    isLoginPage,
    isRegisterPage,
    isLookbookPage,
    isReviewsPage,
    isBrandingPage,
    isPrintingSurface,
    isScrolled
  ]);

  const getTextColor = useCallback(() => {
    // Always return white text - never grey
    return 'text-white';
  }, []);

  const getHoverBgColor = useCallback(() => {
    // Always use white/20 hover for white text visibility
    return 'hover:bg-white/20';
  }, []);

  const getDropdownTextColor = useCallback(() => {
    // Always return white text colors to match header text
    return {
      primary: 'text-white',
      secondary: 'text-white/70',
      muted: 'text-white/60',
      hover: 'hover:bg-white/20',
      border: 'border-white/10'
    };
  }, []);

  const isDarkPage = useMemo(() => {
    return isHeaderDark || isShopPage || isLoginPage || isRegisterPage || 
           isAboutPage || isCheckoutPage || isLookbookPage || isReviewsPage || isBrandingPage || isPrintingSurface;
  }, [
    isHeaderDark,
    isShopPage,
    isLoginPage,
    isRegisterPage,
    isAboutPage,
    isCheckoutPage,
    isLookbookPage,
    isReviewsPage,
    isBrandingPage,
    isPrintingSurface
  ]);

  return {
    headerClassName: getHeaderClassName(),
    textColor: getTextColor(),
    hoverBgColor: getHoverBgColor(),
    dropdownColors: getDropdownTextColor(),
    isDarkPage,
    pageChecks: {
      isShopPage,
      isAboutPage,
      isCheckoutPage,
      isLoginPage,
      isRegisterPage,
      isLookbookPage
    }
  };
};

