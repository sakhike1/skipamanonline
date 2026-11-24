import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight, LogOut, Settings, Shield, ShoppingBag, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/useAuth';
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
  navItems: NavItem[];
}

const overlayTransition = { type: 'spring' as const, stiffness: 300, damping: 32, mass: 0.9 };
const linkSpring = { type: 'spring' as const, stiffness: 400, damping: 30 };

export const HeaderMobileMenu: React.FC<HeaderMobileMenuProps> = ({
  showMobileMenu,
  setShowMobileMenu,
  navItems,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const { getWishlistCount } = useWishlist();

  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  useEffect(() => {
    if (!showMobileMenu) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showMobileMenu]);

  const handleLogout = async () => {
    try {
      await logout();
      setShowMobileMenu(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const primaryLinkClass = (active: boolean) =>
    [
      'block border-b border-white/[0.08] py-4 text-[1.65rem] font-bold leading-tight tracking-tight transition-colors duration-200 sm:text-3xl',
      active ? 'text-white' : 'text-white/45 hover:text-white',
    ].join(' ');

  const secondaryLinkClass = (active: boolean) =>
    [
      'block py-2.5 text-lg font-semibold tracking-tight transition-colors',
      active ? 'text-white' : 'text-white/50 hover:text-white',
    ].join(' ');

  return createPortal(
    <AnimatePresence>
      {showMobileMenu && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="mobile-nav-fullscreen fixed inset-0 z-[100] m-0 flex h-[100dvh] max-h-none w-screen max-w-none flex-col overflow-hidden bg-black p-0 md:hidden"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={overlayTransition}
            className="flex h-full min-h-0 flex-1 flex-col bg-black text-white"
          >
            {/* Top bar — logo + primary CTA + close */}
            <header className="flex shrink-0 items-center justify-between gap-3 px-5 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2 sm:px-7">
              <Link
                to="/"
                className="inline-flex shrink-0 translate-y-1 items-center py-2 text-2xl font-black leading-none tracking-[0.1em] text-white sm:text-3xl"
                onClick={() => setShowMobileMenu(false)}
              >
                SKIPAMAN
              </Link>
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  to="/shop"
                  onClick={() => setShowMobileMenu(false)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-black sm:px-4 sm:text-sm"
                >
                  Shop now
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} aria-hidden />
                </Link>
                <button
                  type="button"
                  onClick={() => setShowMobileMenu(false)}
                  className="px-1 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
                >
                  Close
                </button>
              </div>
            </header>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <nav
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 sm:px-7"
                aria-label="Primary"
              >
                <div className="pb-6 pt-4">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...linkSpring, delay: index * 0.04 }}
                    >
                      <Link
                        to={item.path}
                        className={primaryLinkClass(location.pathname === item.path)}
                        onClick={() => setShowMobileMenu(false)}
                        aria-label={item.ariaLabel}
                        aria-current={location.pathname === item.path ? 'page' : undefined}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}

                  {cartItemCount > 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...linkSpring, delay: navItems.length * 0.04 }}
                    >
                      <Link
                        to="/checkout"
                        className="flex items-center gap-2 border-b border-white/[0.08] py-4 text-[1.35rem] font-bold tracking-tight text-white transition-opacity hover:opacity-90 sm:text-2xl"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <ShoppingBag className="h-6 w-6 shrink-0 opacity-90" strokeWidth={2} aria-hidden />
                        Checkout ({cartItemCount})
                      </Link>
                    </motion.div>
                  ) : null}

                  {isAuthenticated ? (
                    <div className="mt-8 space-y-0 border-t border-white/[0.08] pt-6">
                      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
                        Account
                      </p>
                      <Link
                        to="/orders"
                        className={secondaryLinkClass(location.pathname === '/orders')}
                        onClick={() => setShowMobileMenu(false)}
                      >
                        My orders
                      </Link>
                      <Link
                        to="/wishlist"
                        className={secondaryLinkClass(location.pathname === '/wishlist')}
                        onClick={() => setShowMobileMenu(false)}
                      >
                        Wishlist
                        {getWishlistCount() > 0 ? ` (${getWishlistCount()})` : ''}
                      </Link>
                      <Link
                        to="/profile"
                        className={secondaryLinkClass(location.pathname === '/profile')}
                        onClick={() => setShowMobileMenu(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className={secondaryLinkClass(location.pathname === '/settings')}
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <span className="inline-flex items-center gap-2">
                          <Settings className="h-4 w-4 opacity-60" aria-hidden />
                          Settings
                        </span>
                      </Link>
                      {user?.role === 'admin' ? (
                        <Link
                          to="/admin"
                          className={secondaryLinkClass(location.pathname.startsWith('/admin'))}
                          onClick={() => setShowMobileMenu(false)}
                        >
                          <span className="inline-flex items-center gap-2">
                            <Shield className="h-4 w-4 opacity-60" aria-hidden />
                            Admin
                          </span>
                        </Link>
                      ) : null}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="mt-2 flex w-full items-center gap-2 py-2.5 text-left text-lg font-semibold text-white/45 transition-colors hover:text-white/80"
                      >
                        <LogOut className="h-4 w-4" aria-hidden />
                        Sign out
                      </button>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...linkSpring, delay: navItems.length * 0.04 + 0.06 }}
                      className="mt-8 border-t border-white/[0.08] pt-6"
                    >
                      <Link
                        to="/login"
                        className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-transparent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/5"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <User className="h-4 w-4" aria-hidden />
                        Sign in
                      </Link>
                    </motion.div>
                  )}
                </div>

                {/* Location */}
                <div className="pb-8 pt-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">Location</p>
                  <p className="mt-2 max-w-sm text-lg font-medium leading-snug text-white">
                    Centurion, Gauteng, South Africa
                  </p>
                </div>

                {/* Contacts */}
                <div className="pb-10">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">Contacts</p>
                  <div className="mt-2 flex flex-col gap-1.5 text-base text-white/90">
                    <a href="mailto:sales@skipaman.co.za" className="transition-colors hover:text-white">
                      sales@skipaman.co.za
                    </a>
                    <a href="mailto:admin@skipaman.co.za" className="transition-colors hover:text-white">
                      admin@skipaman.co.za
                    </a>
                    <a href="tel:0744702010" className="transition-colors hover:text-white">
                      074 470 2010
                    </a>
                  </div>
                </div>
              </nav>

              {/* Bottom CTA card */}
              <div className="shrink-0 border-t border-white/[0.06] bg-black px-5 pt-4 sm:px-7 sm:pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...linkSpring, delay: 0.12 }}
                  className="rounded-xl bg-neutral-200 px-5 py-5 text-black shadow-sm"
                >
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-black/80">
                    New arrivals
                  </p>
                  <p className="mt-2 text-base font-semibold leading-snug text-black">
                    Fresh drops and custom printing. Explore what just landed.
                  </p>
                  <Link
                    to="/new-arrivals"
                    onClick={() => setShowMobileMenu(false)}
                    className="mt-4 inline-flex items-center justify-center rounded-md bg-black px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    Explore now
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
