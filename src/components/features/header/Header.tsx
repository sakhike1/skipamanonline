import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { products } from '../../../data/products';
import CartPreview from '../../../assets/cart/CartPreview';
import { useHeaderScroll } from './hooks/useHeaderScroll';
import { useHeaderStyles } from './hooks/useHeaderStyles';
import { useHeaderSearch } from './hooks/useHeaderSearch';
import { HeaderLogo } from './HeaderLogo';
import { HeaderNavigation } from './HeaderNavigation';
import { HeaderSearch } from './HeaderSearch';
import { HeaderActions } from './HeaderActions';
import { HeaderMobileMenu } from './HeaderMobileMenu';

interface NavItem {
  name: string;
  path: string;
  ariaLabel?: string;
}

const Header: React.FC = () => {
  const { cart } = useCart();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCartPreview, setShowCartPreview] = useState(false);

  const { isScrolled } = useHeaderScroll();
  const { headerClassName, textColor, hoverBgColor, isDarkPage } = useHeaderStyles(isScrolled);
  
  // Search state for mobile menu
  const {
    searchQuery,
    setSearchQuery,
    handleSearch: handleSearchSubmit
  } = useHeaderSearch();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearchSubmit(e);
  };

  const hotProducts = useMemo(() => products.slice(0, 3), []);

  const navItems = useMemo<NavItem[]>(() => [
    { name: 'Home', path: '/', ariaLabel: 'Go to homepage' },
    { name: 'Shop', path: '/shop', ariaLabel: 'Browse our shop' },
    { name: 'New Arrivals', path: '/new-arrivals', ariaLabel: 'View new arrivals' },
    { name: 'Lookbook', path: '/lookbook', ariaLabel: 'View our lookbook' },
    { name: 'Custom Design', path: '/custom-design', ariaLabel: 'Request custom design' },
    { name: 'About', path: '/about', ariaLabel: 'Learn more about us' }
  ], []);

  if (!cart) {
    return null;
  }

  const toggleMobileMenu = () => setShowMobileMenu(prev => !prev);
  const toggleCartPreview = () => setShowCartPreview(prev => !prev);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerClassName}`}
      role="banner"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <HeaderLogo
            textColor={textColor}
            isDarkPage={isDarkPage}
            isScrolled={isScrolled}
          />

          {/* Desktop Navigation */}
          <HeaderNavigation
            textColor={textColor}
            isAuthenticated={isAuthenticated}
            location={location}
          />

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
            {/* Search */}
            <HeaderSearch
              isAuthenticated={isAuthenticated}
              isScrolled={isScrolled}
              hotProducts={hotProducts}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={handleSearch}
            />

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

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                p-2 rounded-md md:hidden transition-all
                ${textColor} ${hoverBgColor}
              `}
              onClick={toggleMobileMenu}
              aria-label={showMobileMenu ? "Close menu" : "Open menu"}
              aria-expanded={showMobileMenu}
              aria-controls="mobile-menu"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={showMobileMenu ? 'close' : 'menu'}
                  initial={{ opacity: 0, rotate: showMobileMenu ? 0 : -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: showMobileMenu ? 90 : -90 }}
                  transition={{ duration: 0.2 }}
                >
                  {showMobileMenu ?
                    <X size={24} className="[filter:drop-shadow(0px_0px_1px_rgba(255,255,255,0.5))]" /> :
                    <Menu size={24} className="[filter:drop-shadow(0px_0px_1px_rgba(255,255,255,0.5))]" />
                  }
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <HeaderMobileMenu
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
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

