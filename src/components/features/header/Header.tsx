import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/useAuth';
import CartPreview from '../../cart/CartPreview';
import { useHeaderScroll } from './hooks/useHeaderScroll';
import { useHeaderStyles } from './hooks/useHeaderStyles';
import { useNavigate } from 'react-router-dom';
import { HeaderLogo } from './HeaderLogo';
import { HeaderNavigation } from './HeaderNavigation';
import { HeaderActions } from './HeaderActions';
import { HeaderMobileMenu } from './HeaderMobileMenu';
import SearchBar from '../../ui/SearchBar';

interface NavItem {
  name: string;
  path: string;
  ariaLabel?: string;
}

const Header: React.FC = () => {
  const { cart } = useCart();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { isScrolled } = useHeaderScroll();
  const { headerClassName, textColor, hoverBgColor, isDarkPage } = useHeaderStyles(isScrolled);
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query)}`);
    }
  };


  const navItems = useMemo<NavItem[]>(() => [
    { name: 'Home', path: '/', ariaLabel: 'Go to homepage' },
    { name: 'Shop', path: '/shop', ariaLabel: 'Browse our shop' },
    { name: 'New Arrivals', path: '/new-arrivals', ariaLabel: 'View new arrivals' },
    { name: 'Branding', path: '/virtual-stylist', ariaLabel: 'Custom branding, uniforms, caps, and cups' },
    { name: 'Printing', path: '/printing', ariaLabel: 'Custom printing services and service areas' },
    { name: 'Lookbook', path: '/lookbook', ariaLabel: 'View our lookbook' },
    { name: 'About', path: '/about', ariaLabel: 'Learn more about us' }
  ], []);

  if (!cart) {
    return null;
  }

  const toggleMobileMenu = () => setShowMobileMenu(prev => !prev);
  const toggleCartPreview = () => setShowCartPreview(prev => !prev);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerClassName} [&_a:focus-visible]:outline [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-2 [&_a:focus-visible]:outline-white [&_button:focus-visible]:outline [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-2 [&_button:focus-visible]:outline-white [&_input:focus-visible]:ring-2 [&_input:focus-visible]:ring-white [&_input:focus-visible]:ring-offset-2 [&_input:focus-visible]:ring-offset-black/80`}
      role="banner"
    >
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between min-w-0 gap-1 sm:gap-2 lg:gap-3">
          {/* Logo */}
          <div className="flex-shrink-0 z-10">
            <HeaderLogo
              textColor={textColor}
              isDarkPage={isDarkPage}
            />
          </div>

          {/* Desktop Navigation */}
          <div className="flex-1 min-w-0 flex justify-center overflow-hidden px-1 sm:px-2">
            <HeaderNavigation
              textColor={textColor}
              isAuthenticated={isAuthenticated}
              location={location}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-2 xl:space-x-3 flex-shrink-0 z-10">
            {/* Search Bar - completely hidden when logged in to prevent overlap */}
            {!isAuthenticated && (
              <div className="hidden sm:block flex-shrink-0">
                <SearchBar
                  onSearch={handleSearch}
                  placeholder="Search..."
                  className="w-44 sm:w-56 md:w-64 lg:w-72 xl:w-80"
                />
              </div>
            )}

            {/* Cart, Wishlist, User Menu */}
            <HeaderActions
              textColor={textColor}
              hoverBgColor={hoverBgColor}
              isAuthenticated={isAuthenticated}
              isDarkPage={isDarkPage}
              isScrolled={isScrolled}
              showCartPreview={showCartPreview}
              toggleCartPreview={toggleCartPreview}
            />

            {/* Mobile menu: hamburger only — close lives in the drawer (avoids two X icons) */}
            {showMobileMenu ? (
              <div
                className="h-11 w-11 shrink-0 md:hidden"
                aria-hidden
              />
            ) : (
              <button
                type="button"
                className={`
                  md:hidden inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20
                  bg-white/10 shadow-[0_1px_0_rgba(255,255,255,0.12)_inset] backdrop-blur-sm
                  transition-colors active:bg-white/15
                  ${textColor} ${hoverBgColor}
                `}
                onClick={toggleMobileMenu}
                aria-label="Open menu"
                aria-expanded={false}
                aria-controls="mobile-menu"
              >
                <Menu
                  size={20}
                  strokeWidth={2.25}
                  className="pointer-events-none shrink-0 opacity-[0.98] max-md:[filter:none] [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.35))]"
                  aria-hidden
                />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <HeaderMobileMenu
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        navItems={navItems}
      />

      {/* Cart Preview */}
      <AnimatePresence>
        {showCartPreview && <CartPreview onClose={() => setShowCartPreview(false)} />}
      </AnimatePresence>
    </header>
  );
};

export default Header;

