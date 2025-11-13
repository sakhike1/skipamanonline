import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, X, User, ShoppingBag, Heart, Settings, LogOut, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';

interface NavItem {
  name: string;
  path: string;
  ariaLabel?: string;
}

interface HeaderMobileMenuProps {
  showMobileMenu: boolean;
  setShowMobileMenu: (show: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  navItems: NavItem[];
}

export const HeaderMobileMenu: React.FC<HeaderMobileMenuProps> = ({
  showMobileMenu,
  setShowMobileMenu,
  searchQuery,
  setSearchQuery,
  handleSearch,
  navItems
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const { getWishlistCount } = useWishlist();

  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const handleLogout = async () => {
    try {
      await logout();
      setShowMobileMenu(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AnimatePresence>
      {showMobileMenu && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 md:hidden"
            onClick={() => setShowMobileMenu(false)}
          />

          {/* Mobile Menu Panel */}
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
            {/* Header */}
            <div className="relative p-6 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
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

            {/* Search Bar */}
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

            {/* Navigation Links */}
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
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                        location.pathname !== item.path ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20' : ''
                      }`} />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
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
                          <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
                        </motion.div>
                      )}
                    </Link>
                  </motion.div>
                ))}

                {/* Authenticated User Links */}
                {isAuthenticated && (
                  <>
                    <div className="my-4 h-px bg-white/20" />
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        delay: navItems.length * 0.1 + 0.1,
                        type: 'spring',
                        stiffness: 200,
                        damping: 20
                      }}
                    >
                      <Link
                        to="/orders"
                        className={`
                          group relative flex items-center justify-between py-3 px-4 rounded-2xl text-lg font-semibold transition-all duration-300 overflow-hidden
                          ${location.pathname === '/orders'
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                            : 'text-white/90 hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5 hover:text-white'
                          }
                        `}
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                          location.pathname !== '/orders' ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20' : ''
                        }`} />
                        <span className="relative z-10 tracking-wide">My Orders</span>
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        delay: navItems.length * 0.1 + 0.2,
                        type: 'spring',
                        stiffness: 200,
                        damping: 20
                      }}
                    >
                      <Link
                        to="/wishlist"
                        className={`
                          group relative flex items-center justify-between py-3 px-4 rounded-2xl text-lg font-semibold transition-all duration-300 overflow-hidden
                          ${location.pathname === '/wishlist'
                            ? 'bg-gradient-to-r from-pink-600 to-red-600 text-white shadow-lg shadow-pink-500/30'
                            : 'text-white/90 hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5 hover:text-white'
                          }
                        `}
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                          location.pathname !== '/wishlist' ? 'bg-gradient-to-r from-pink-600/20 to-red-600/20' : ''
                        }`} />
                        <span className="relative z-10 tracking-wide">
                          Wishlist {getWishlistCount() > 0 && `(${getWishlistCount()})`}
                        </span>
                      </Link>
                    </motion.div>
                  </>
                )}

                {/* Cart Link */}
                {cartItemCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      delay: (isAuthenticated ? navItems.length + 2 : navItems.length) * 0.1 + 0.1,
                      type: 'spring',
                      stiffness: 200,
                      damping: 20
                    }}
                  >
                    <Link
                      to="/checkout"
                      className="group relative flex items-center justify-between py-3 px-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30 transition-all duration-300 overflow-hidden"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <span className="relative z-10 tracking-wide">
                        <ShoppingBag size={20} className="inline-block mr-2" />
                        Checkout ({cartItemCount} items)
                      </span>
                    </Link>
                  </motion.div>
                )}

                {/* User Actions */}
                {isAuthenticated ? (
                  <>
                    <div className="my-4 h-px bg-white/20" />
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="px-4 py-3 bg-white/5 rounded-2xl"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </div>
                        <div>
                          <p className="text-white font-semibold">{user?.firstName} {user?.lastName}</p>
                          <p className="text-white/70 text-sm">{user?.email}</p>
                        </div>
                      </div>
                    </motion.div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 py-3 px-4 text-white/90 hover:text-white hover:bg-white/10 rounded-2xl transition-all"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <User size={20} />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 py-3 px-4 text-white/90 hover:text-white hover:bg-white/10 rounded-2xl transition-all"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <Settings size={20} />
                      <span>Settings</span>
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 py-3 px-4 text-purple-300 hover:text-purple-200 hover:bg-purple-500/20 rounded-2xl transition-all"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <Shield size={20} />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 py-3 px-4 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-2xl transition-all mt-2"
                    >
                      <LogOut size={20} />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: navItems.length * 0.1 + 0.2 }}
                    className="pt-4"
                  >
                    <Link
                      to="/login"
                      className="block w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Sign In
                    </Link>
                  </motion.div>
                )}
              </div>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};



