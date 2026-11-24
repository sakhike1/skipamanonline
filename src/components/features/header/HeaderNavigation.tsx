import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PrefetchLink from '../../../components/ui/PrefetchLink';
import { motion } from 'framer-motion';

interface NavItem {
  name: string;
  path: string;
  ariaLabel?: string;
}

interface HeaderNavigationProps {
  textColor: string;
  isAuthenticated: boolean;
  location: ReturnType<typeof useLocation>;
}

export const HeaderNavigation: React.FC<HeaderNavigationProps> = ({
  textColor,
  isAuthenticated,
  location
}) => {
  const navItems = useMemo<NavItem[]>(() => {
    const items = [
      { name: 'Home', path: '/', ariaLabel: 'Go to homepage' },
      { name: 'Shop', path: '/shop', ariaLabel: 'Browse our shop' },
      { name: 'New Arrivals', path: '/new-arrivals', ariaLabel: 'View new arrivals' },
      { name: 'Branding', path: '/virtual-stylist', ariaLabel: 'Custom branding, uniforms, caps, and cups' },
      { name: 'Printing', path: '/printing', ariaLabel: 'Custom printing services and service areas' },
      { name: 'Lookbook', path: '/lookbook', ariaLabel: 'View our lookbook' },
      { name: 'About', path: '/about', ariaLabel: 'Learn more about us' }
    ];
    
    // When authenticated, show fewer items on smaller screens to prevent overlap
    if (isAuthenticated) {
      return items.slice(0, 6); // Keep Printing + core nav when logged in
    }
    return items;
  }, [isAuthenticated]);

  return (
    <nav 
      className="hidden lg:flex items-center space-x-1 xl:space-x-2 2xl:space-x-3 flex-shrink-0 min-w-0 overflow-hidden" 
      role="navigation" 
      aria-label="Main navigation"
    >
      {/* Main Navigation Items */}
      <div className="flex items-center space-x-1 xl:space-x-2 2xl:space-x-3 flex-shrink-0">
        {navItems.map((item) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * navItems.indexOf(item) }}
            style={{ transform: 'none' }}
            className="flex-shrink-0"
          >
            <PrefetchLink
              to={item.path}
              prefetchOnHover={true}
              className={`
                font-medium text-[10px] xl:text-xs 2xl:text-sm tracking-tight ${textColor} whitespace-nowrap
                relative group [text-shadow:0px_0px_1px_rgba(255,255,255,0.5)]
                hover:text-[color:var(--vibe-accent,#f2ceff)] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0
                transition-[color,transform] duration-300 block px-1
              `}
              aria-label={item.ariaLabel}
              aria-current={location.pathname === item.path ? 'page' : undefined}
            >
              {item.name}
              <span 
                className={`absolute left-0 -bottom-1 h-0.5 rounded-full bg-[color:var(--vibe-accent,#f2ceff)]
                ${location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'} transition-all duration-300`}
              />
            </PrefetchLink>
          </motion.div>
        ))}
      </div>
      
      {/* Additional Navigation for Logged-in Users */}
      {isAuthenticated ? (
        <div className="flex items-center space-x-1 xl:space-x-2 2xl:space-x-3 flex-shrink-0 ml-0.5 xl:ml-1">
          <div className="h-5 w-px bg-white/30 flex-shrink-0" />
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            style={{ transform: 'none' }}
            className="flex-shrink-0"
          >
            <Link
              to="/orders"
              className={`
                font-medium text-[10px] xl:text-xs 2xl:text-sm tracking-tight ${textColor} whitespace-nowrap
                relative group [text-shadow:0px_0px_1px_rgba(255,255,255,0.5)]
                hover:text-[color:var(--vibe-accent,#f2ceff)] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0
                transition-[color,transform] duration-300 block px-1
              `}
              aria-label="View my orders"
              aria-current={location.pathname === '/orders' ? 'page' : undefined}
            >
              Orders
              <span 
                className={`absolute left-0 -bottom-1 h-0.5 rounded-full bg-[color:var(--vibe-accent,#f2ceff)]
                ${location.pathname === '/orders' ? 'w-full' : 'w-0 group-hover:w-full'} transition-all duration-300`}
              />
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            style={{ transform: 'none' }}
            className="flex-shrink-0"
          >
            <Link
              to="/wishlist"
              className={`
                font-medium text-[10px] xl:text-xs 2xl:text-sm tracking-tight ${textColor} whitespace-nowrap
                relative group [text-shadow:0px_0px_1px_rgba(255,255,255,0.5)]
                hover:text-[color:var(--vibe-accent,#f2ceff)] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0
                transition-[color,transform] duration-300 block px-1
              `}
              aria-label="View my wishlist"
              aria-current={location.pathname === '/wishlist' ? 'page' : undefined}
            >
              Wishlist
              <span 
                className={`absolute left-0 -bottom-1 h-0.5 rounded-full bg-[color:var(--vibe-accent,#f2ceff)]
                ${location.pathname === '/wishlist' ? 'w-full' : 'w-0 group-hover:w-full'} transition-all duration-300`}
              />
            </Link>
          </motion.div>
        </div>
      ) : null}
    </nav>
  );
};



