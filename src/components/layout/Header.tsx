import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ShoppingBag, Search, Menu, X, TrendingUp, Sparkles, Heart, User, LogOut, Settings, Shield } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useHeader } from '../../context/HeaderContext';
import CartPreview from '../cart/CartPreview';
import { motion, AnimatePresence } from 'framer-motion';
import { debounce } from 'lodash';
import { products } from '../../data/products';

interface NavItem {
  name: string;
  path: string;
  ariaLabel?: string;
}

const Header: React.FC = () => {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const { isHeaderDark } = useHeader();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [hotProducts] = useState(products.slice(0, 3)); // Get first 3 products as hottest
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout>();
  const isShopPage = location.pathname === '/shop';
  const isAboutPage = location.pathname === '/about';
  const isCheckoutPage = location.pathname === '/checkout';
  const isWishlistPage = location.pathname === '/wishlist';
  const isLoginPage = location.pathname === '/login';
  
  // Optimized scroll handler with debounce
  const handleScroll = useCallback(
    debounce(() => {
      setIsScrolled(window.scrollY > 20);
      
      // Only check section colors if we're not in ProductDetail (which controls its own header)
      if (!location.pathname.includes('/product/')) {
        const sections = document.querySelectorAll('section, div.bg-black, div.bg-white');
        if (sections.length) {
          for (const section of sections) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 80 && rect.bottom >= 80) {
              // Note: Header background is now controlled by context, not scroll position
              break;
            }
          }
        }
      }
    }, 100),
    [location.pathname]
  );
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      handleScroll.cancel();
    };
  }, [handleScroll]);

  // Handle search submission
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchFocused(false);
    }
  }, [searchQuery, navigate]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowMobileMenu(false);
      setShowCartPreview(false);
      setIsSearchFocused(false);
      setShowUserMenu(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown as any);
    return () => document.removeEventListener('keydown', handleKeyDown as any);
  }, [handleKeyDown]);

  // Handle click outside user menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);
  
  // Memoized cart count calculation
  const cartItemCount = useMemo(() => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  }, [cart.items]);
  
  // Memoized wishlist count calculation
  const wishlistCount = useMemo(() => {
    return wishlist.items.length;
  }, [wishlist.items]);
  
  const toggleMobileMenu = useCallback(() => {
    setShowMobileMenu(prev => !prev);
  }, []);
  
  const toggleCartPreview = useCallback(() => {
    setShowCartPreview(prev => !prev);
  }, []);
  
  const toggleUserMenu = useCallback(() => {
    setShowUserMenu(prev => !prev);
  }, []);
  
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      setShowUserMenu(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [logout, navigate]);
  
  // Determine text and icon colors based on scroll state and background
  const getTextColor = useCallback(() => {
    if (location.pathname.includes('/product/') || isShopPage || isAboutPage || isCheckoutPage || isWishlistPage) {
      return 'text-white';
    }
    if (isScrolled) {
      return 'text-gray-800';
    }
    return 'text-white';
  }, [isScrolled, location.pathname, isShopPage, isAboutPage, isCheckoutPage, isWishlistPage]);

  const getHoverBgColor = useCallback(() => {
    if (isScrolled) return 'hover:bg-gray-100';
    return 'hover:bg-white/20';
  }, [isScrolled]);

  const textColor = getTextColor();
  const hoverBgColor = getHoverBgColor();
  
  // Navigation items with correct paths and aria labels
  const navItems = useMemo<NavItem[]>(() => [
    { name: 'Home', path: '/', ariaLabel: 'Go to homepage' },
    { name: 'Shop', path: '/shop', ariaLabel: 'Browse our shop' },
    { name: 'New Arrivals', path: '/new-arrivals', ariaLabel: 'View new arrivals' },
    { name: 'About', path: '/about', ariaLabel: 'Learn more about us' }
  ], []);
  
  // Removed unused animation variants
  
  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowSearchDropdown(false);
      setIsSearchFocused(false);
      setIsInteracting(false);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle route changes
  useEffect(() => {
    if (showSearchDropdown) {
      setShowSearchDropdown(false);
      setIsSearchFocused(false);
      setIsInteracting(false);
    }
  }, [location.pathname]);

  // Removed resetInactivityTimer as it's not being used

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    setShowSearchDropdown(true);
    setIsInteracting(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
    if (!isInteracting) {
      setShowSearchDropdown(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsInteracting(true);
  };

  const handleMouseMove = () => {
    if (isSearchFocused || showSearchDropdown) {
      setIsInteracting(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isSearchFocused) {
      setIsInteracting(false);
      setShowSearchDropdown(false);
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, []);
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isAboutPage || isCheckoutPage
          ? 'bg-gradient-to-r from-purple-900/95 via-black/90 to-black/95 backdrop-blur-sm shadow-md py-2'
          : isHeaderDark || isShopPage || isWishlistPage || isLoginPage
            ? 'bg-black/95 backdrop-blur-sm shadow-md py-2'
            : isScrolled
              ? 'bg-white/95 backdrop-blur-sm shadow-md py-2'
              : 'py-4 backdrop-blur-[2px] bg-gradient-to-b from-black/30 to-transparent'
      }`}
      role="banner"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="text-3xl font-black"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              to="/" 
              className="relative group"
              aria-label="SkipaMan Home"
            >
              <span className={`tracking-tighter ${textColor} [text-shadow:0px_0px_1px_rgba(255,255,255,0.5)]`}>SKIPA</span>
              <span className={`tracking-tighter relative ${textColor} [text-shadow:0px_0px_1px_rgba(255,255,255,0.5)]`}>
                MAN
                <span className={`absolute left-0 bottom-0 h-0.5 ${isHeaderDark && !isScrolled ? 'bg-white' : 'bg-black'} w-0 group-hover:w-full transition-all duration-300`}></span>
              </span>
              <motion.span 
                className="absolute -inset-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 group-hover:opacity-100 blur-sm"
                initial={{ x: -100 }}
                animate={{ x: 100 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </Link>
          </motion.div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * navItems.indexOf(item) }}
                whileHover={{ scale: 1.05 }}
              >
                <Link
                  to={item.path}
                  className={`
                    font-medium text-lg tracking-tight ${textColor}
                    relative group [text-shadow:0px_0px_1px_rgba(255,255,255,0.5)]
                  `}
                  aria-label={item.ariaLabel}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                >
                  {item.name}
                  <span 
                    className={`absolute left-0 -bottom-1 h-0.5 ${isScrolled ? 'bg-gray-800' : 'bg-white'}
                    ${location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'} transition-all duration-300`}
                  ></span>
                </Link>
              </motion.div>
            ))}
          </nav>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
            {/* Search Form with Dropdown - Hidden on mobile, shown on larger screens */}
            <div className="relative hidden sm:block">
              <form onSubmit={handleSearch}>
              <motion.div
                ref={searchContainerRef}
                initial={false}
                animate={{ 
                  width: isSearchFocused ? (window.innerWidth < 1024 ? 200 : 280) : 48,
                  scale: isSearchFocused ? 1.02 : 1
                }}
                className="relative group"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {/* Glow effect on focus */}
                <div className={`
                  absolute inset-0 rounded-full blur-xl transition-all duration-500
                  ${isSearchFocused 
                    ? 'bg-gradient-to-r from-yellow-400/30 via-orange-400/20 to-pink-400/30' 
                    : 'bg-transparent'
                  }
                `}></div>
                
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  placeholder={isSearchFocused ? "Search products..." : ""}
                  className={`
                    relative w-full px-5 py-2.5 lg:py-3 rounded-full 
                    ${isSearchFocused 
                      ? 'bg-white/25 backdrop-blur-xl border-white/40 shadow-lg shadow-white/10' 
                      : 'bg-black/15 backdrop-blur-md border-white/15 hover:bg-black/20'
                    }
                    ${isScrolled ? 'text-black placeholder-black/70' : 'text-white placeholder-white/70'}
                    border
                    focus:outline-none focus:ring-1 focus:ring-yellow-400/50 focus:border-yellow-400/50
                    shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]
                    transition-all duration-500 ease-out
                    text-sm font-medium
                    group-hover:border-white/30
                  `}
                  aria-label="Search products"
                />
                
                {/* Search icon with animation */}
                <motion.button
                  type="button"
                  onClick={() => searchInputRef.current?.focus()}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-white/10 transition-all duration-300 cursor-pointer z-10"
                  animate={{ 
                    opacity: isSearchFocused ? 0 : 1,
                    scale: isSearchFocused ? 0.8 : 1,
                    x: isSearchFocused ? -10 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Search 
                    size={18} 
                    className={`
                      ${isScrolled ? 'text-black/70' : 'text-white/70'}
                      transition-colors duration-300
                    `} 
                  />
                </motion.button>
                
                {/* Submit button with modern styling */}
                <motion.button
                  type="submit"
                  className={`
                    absolute right-2 top-1/2 -translate-y-1/2 p-2
                    rounded-full transition-all duration-300
                    ${isSearchFocused 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg shadow-yellow-400/30' 
                      : `${isScrolled ? 'text-black/70 hover:text-black' : 'text-white/70 hover:text-white'} hover:bg-white/20`
                    }
                    backdrop-blur-sm
                    hover:scale-110
                    active:scale-95
                  `}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Submit search"
                >
                  <Search size={16} />
                </motion.button>
                
                {/* Loading indicator */}
                {isSearchFocused && searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-12 top-1/2 -translate-y-1/2"
                  >
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  </motion.div>
                )}
              </motion.div>
            </form>

              {/* Search Dropdown */}
              <AnimatePresence>
                {showSearchDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-72 bg-white/10 backdrop-blur-xl rounded-lg overflow-hidden z-[100] border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]"
                  >
                    <div className="relative">
                      {/* Glass shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                      
                      <div className="p-4 relative">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="relative">
                            <TrendingUp size={18} className={isScrolled ? 'text-black' : 'text-white'} />
                            <Sparkles size={12} className={`absolute -top-1 -right-1 ${isScrolled ? 'text-black/80' : 'text-white/80'} animate-pulse`} />
                          </div>
                          <h3 className={`font-medium ${isScrolled ? 'text-black' : 'text-white'}`}>
                            Hottest T-Shirts
                          </h3>
                        </div>
                        <div className="space-y-3">
                          {hotProducts.map((product) => (
                            <motion.div
                              key={product.id}
                              whileHover={{ scale: 1.02 }}
                              className="group cursor-pointer relative"
                              onClick={() => {
                                navigate(`/product/${product.id}`);
                                setShowSearchDropdown(false);
                              }}
                            >
                              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-white/20 transition-all duration-300 border border-transparent hover:border-white/20">
                                <div className="w-14 h-14 bg-white/5 rounded-md overflow-hidden relative group-hover:shadow-lg transition-all duration-300">
                                  <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <div className="flex-1">
                                  <h4 className={`text-sm font-medium ${isScrolled ? 'text-black group-hover:text-black/90' : 'text-white group-hover:text-white/90'} transition-colors duration-300`}>
                                    {product.name}
                                  </h4>
                                  <div className="flex items-center gap-2">
                                    <p className={`text-sm font-semibold ${isScrolled ? 'text-black/90' : 'text-white/90'}`}>R{product.price}</p>
                                    <span className={`text-xs font-medium bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 px-2 py-0.5 rounded-full shadow-sm`}>
                                      Hot Deal
                                    </span>
                                  </div>
                                </div>
                                <motion.div
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                >
                                  <Sparkles size={16} className={isScrolled ? 'text-black/80' : 'text-white/80'} />
                                </motion.div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Cart Button */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                p-2 rounded-full relative transition-all ${textColor} ${hoverBgColor}
              `}
              onClick={toggleCartPreview}
              aria-label={`Cart with ${cartItemCount} items`}
            >
              <ShoppingBag size={20} className="sm:w-[22px] sm:h-[22px] [filter:drop-shadow(0px_0px_1px_rgba(255,255,255,0.5))]" />
              <AnimatePresence>
                {cartItemCount > 0 && (
                  <motion.span 
                    className={`absolute -top-1 -right-1 ${isHeaderDark && !isScrolled ? 'bg-white text-black' : 'bg-black text-white'} 
                    text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            
            {/* Wishlist Button - Hidden on mobile */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                hidden sm:flex p-2 rounded-full relative transition-all ${textColor} ${hoverBgColor}
              `}
              onClick={() => navigate('/wishlist')}
              aria-label={`Wishlist with ${wishlistCount} items`}
            >
              <Heart size={20} className="sm:w-[22px] sm:h-[22px] [filter:drop-shadow(0px_0px_1px_rgba(255,255,255,0.5))]" />
              <AnimatePresence>
                {wishlistCount > 0 && (
                  <motion.span 
                    className={`absolute -top-1 -right-1 ${isHeaderDark && !isScrolled ? 'bg-white text-black' : 'bg-black text-white'} 
                    text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            
            {/* User Menu / Login Button */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    hidden sm:flex items-center gap-2 px-3 py-2 rounded-full transition-all ${textColor} ${hoverBgColor}
                  `}
                  onClick={toggleUserMenu}
                  aria-label="User menu"
                >
                  <User size={16} className="sm:w-[18px] sm:h-[18px] [filter:drop-shadow(0px_0px_1px_rgba(255,255,255,0.5))]" />
                  <span className="hidden lg:block text-sm font-medium">
                    {user?.firstName}
                  </span>
                </motion.button>
                
                {/* User Menu Dropdown */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-64 bg-white/10 backdrop-blur-xl rounded-lg overflow-hidden z-[100] border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]"
                    >
                      <div className="p-4">
                        {/* Welcome Message */}
                        <div className="mb-3">
                          <p className="text-white/60 text-xs uppercase tracking-wider">
                            Welcome back
                          </p>
                        </div>
                        
                        {/* User Info */}
                        <div className="px-3 py-3 border-b border-white/10 mb-3">
                          <p className="text-white font-semibold text-lg">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-white/70 text-sm">
                            {user?.email}
                          </p>
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              {user?.role === 'admin' ? 'Administrator' : 'Customer'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Menu Items */}
                        <div className="space-y-1">
                          <Link
                            to="/profile"
                            className="flex items-center px-3 py-2 text-sm text-white hover:bg-white/20 rounded-md transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <User size={16} className="mr-3" />
                            My Profile
                          </Link>
                          <Link
                            to="/wishlist"
                            className="flex items-center px-3 py-2 text-sm text-white hover:bg-white/20 rounded-md transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Heart size={16} className="mr-3" />
                            My Wishlist
                          </Link>
                          <Link
                            to="/settings"
                            className="flex items-center px-3 py-2 text-sm text-white hover:bg-white/20 rounded-md transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Settings size={16} className="mr-3" />
                            Settings
                          </Link>
                          {user?.role === 'admin' && (
                            <Link
                              to="/admin"
                              className="flex items-center px-3 py-2 text-sm text-purple-300 hover:bg-purple-500/20 rounded-md transition-colors"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Shield size={16} className="mr-3" />
                              Admin Dashboard
                            </Link>
                          )}
                          <div className="border-t border-white/10 my-2"></div>
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/20 rounded-md transition-colors"
                          >
                            <LogOut size={16} className="mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  hidden sm:flex items-center gap-2 px-3 py-2 rounded-full transition-all ${textColor} ${hoverBgColor}
                `}
                onClick={() => navigate('/login')}
                aria-label="Login"
              >
                <User size={16} className="sm:w-[18px] sm:h-[18px] [filter:drop-shadow(0px_0px_1px_rgba(255,255,255,0.5))]" />
                <span className="hidden lg:block text-sm font-medium">
                  Sign In
                </span>
              </motion.button>
            )}
            
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
        
        {/* Snazzy Mobile Menu - Dropdown Style */}
        <AnimatePresence>
          {showMobileMenu && (
            <>
              {/* Backdrop with blur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 md:hidden"
                onClick={() => setShowMobileMenu(false)}
              />
              
              {/* Mobile Menu Dropdown Panel */}
              <motion.div 
                id="mobile-menu"
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 30,
                  mass: 0.8
                }}
                className="absolute top-full left-0 right-0 mx-4 mt-2 bg-gradient-to-br from-gray-900/95 via-black/95 to-purple-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 z-50 md:hidden overflow-hidden"
                style={{
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                }}
                role="navigation"
                aria-label="Mobile navigation"
              >
                {/* Glowing Header */}
                <div className="relative p-6 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20">
                  {/* Animated background shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
                  
                  <div className="relative flex items-center justify-between">
                    <motion.div 
                      className="text-xl font-black text-white"
                      animate={{
                        textShadow: [
                          '0 0 20px rgba(168, 85, 247, 0.8)',
                          '0 0 30px rgba(236, 72, 153, 0.8)',
                          '0 0 20px rgba(168, 85, 247, 0.8)'
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <span className="tracking-tighter bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">SKIPA</span>
                      <span className="tracking-tighter bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">MAN</span>
                    </motion.div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowMobileMenu(false)}
                      className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20"
                      aria-label="Close menu"
                    >
                      <X size={20} />
                    </motion.button>
                  </div>
                </div>

                {/* Compact Search Bar for Mobile */}
                <div className="px-6 py-4 border-b border-white/5">
                  <form onSubmit={handleSearch}>
                    <motion.div 
                      className="relative"
                      whileFocus={{ scale: 1.02 }}
                    >
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="w-full px-5 py-3 pl-12 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400/60 focus:border-purple-400/60 transition-all backdrop-blur-sm"
                      />
                      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" />
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white shadow-lg"
                      >
                        <Search size={14} />
                      </motion.button>
                    </motion.div>
                  </form>
                </div>

                {/* Snazzy Navigation Links */}
                <nav className="p-6">
                  <div className="space-y-1">
                    {navItems.map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ 
                          delay: index * 0.1,
                          type: 'spring',
                          stiffness: 200,
                          damping: 20
                        }}
                      >
                        <Link
                          to={item.path}
                          className={`
                            group relative flex items-center justify-between py-3 px-4 rounded-2xl text-lg font-semibold transition-all duration-300 overflow-hidden
                            ${location.pathname === item.path 
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30' 
                              : 'text-white/90 hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5 hover:text-white'
                            }
                          `}
                          onClick={() => setShowMobileMenu(false)}
                          aria-label={item.ariaLabel}
                          aria-current={location.pathname === item.path ? 'page' : undefined}
                        >
                          {/* Background glow effect */}
                          <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                            location.pathname !== item.path ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20' : ''
                          }`}></div>
                          
                          {/* Shimmer effect */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                          
                          <span className="relative z-10 tracking-wide">{item.name}</span>
                          
                          {location.pathname === item.path ? (
                            <motion.div
                              initial={{ scale: 0, rotate: 0 }}
                              animate={{ scale: 1, rotate: 360 }}
                              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                              className="relative z-10 w-2 h-2 bg-white rounded-full shadow-lg"
                            />
                          ) : (
                            <motion.div
                              className="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              animate={{ x: [0, 5, 0] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                            </motion.div>
                          )}
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Compact Additional Links */}
                  <div className="mt-6 pt-4 border-t border-white/5 space-y-1">
                    {/* Quick Actions Row */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, type: 'spring' }}
                      >
                        <Link
                          to="/wishlist"
                          className="group relative flex flex-col items-center py-3 px-3 rounded-2xl text-white/90 hover:bg-gradient-to-r hover:from-pink-600/20 hover:to-red-600/20 hover:text-white transition-all duration-300 overflow-hidden"
                          onClick={() => setShowMobileMenu(false)}
                          aria-label="View my wishlist"
                        >
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                          <div className="relative z-10 flex items-center gap-2">
                            <Heart size={18} />
                            <span className="text-sm font-medium">Wishlist</span>
                          </div>
                          {wishlistCount > 0 && (
                            <motion.span 
                              className="relative z-10 mt-1 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              {wishlistCount}
                            </motion.span>
                          )}
                        </Link>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                      >
                        {isAuthenticated ? (
                          <Link
                            to="/profile"
                            className="group relative flex flex-col items-center py-3 px-3 rounded-2xl text-white/90 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 hover:text-white transition-all duration-300 overflow-hidden"
                            onClick={() => setShowMobileMenu(false)}
                          >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            <div className="relative z-10 flex items-center gap-2">
                              <User size={18} />
                              <span className="text-sm font-medium">Profile</span>
                            </div>
                          </Link>
                        ) : (
                          <Link
                            to="/login"
                            className="group relative flex flex-col items-center py-3 px-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                            onClick={() => setShowMobileMenu(false)}
                          >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-white/10 to-white/5 transition-opacity duration-300"></div>
                            <div className="relative z-10 flex items-center gap-2">
                              <User size={18} />
                              <span className="text-sm font-medium">Sign In</span>
                            </div>
                          </Link>
                        )}
                      </motion.div>
                    </div>

                    {/* Sign Out Button (if authenticated) */}
                    {isAuthenticated && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <button
                          onClick={() => {
                            handleLogout();
                            setShowMobileMenu(false);
                          }}
                          className="group relative w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-red-400 hover:bg-gradient-to-r hover:from-red-600/20 hover:to-red-500/20 hover:text-red-300 transition-all duration-300 overflow-hidden"
                        >
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-red-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                          <LogOut size={16} className="relative z-10" />
                          <span className="relative z-10 text-sm font-medium">Sign Out</span>
                        </button>
                      </motion.div>
                    )}
                  </div>

                  {/* Compact User Info (if authenticated) */}
                  {isAuthenticated && user && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="mt-4 pt-4 border-t border-white/5"
                    >
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl backdrop-blur-sm">
                        <motion.div 
                          className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <User size={18} className="text-white" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold text-sm truncate">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-white/60 text-xs truncate">{user.email}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
      
      {/* Cart Preview */}
      <AnimatePresence>
        {showCartPreview && <CartPreview onClose={() => setShowCartPreview(false)} />}
      </AnimatePresence>
    </header>
  );
};

export default Header;