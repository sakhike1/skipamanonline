import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  const navItems = useMemo<NavItem[]>(() => [
    { name: 'Home', path: '/', ariaLabel: 'Go to homepage' },
    { name: 'Shop', path: '/shop', ariaLabel: 'Browse our shop' },
    { name: 'New Arrivals', path: '/new-arrivals', ariaLabel: 'View new arrivals' },
    { name: 'Lookbook', path: '/lookbook', ariaLabel: 'View our lookbook' },
    { name: 'Custom Design', path: '/custom-design', ariaLabel: 'Request custom design' },
    { name: 'About', path: '/about', ariaLabel: 'Learn more about us' }
  ], []);

  return (
    <nav className="hidden md:flex space-x-6 lg:space-x-8" role="navigation" aria-label="Main navigation">
      {/* Main Navigation Items */}
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
              font-medium text-sm lg:text-base tracking-tight ${textColor}
              relative group [text-shadow:0px_0px_1px_rgba(255,255,255,0.5)]
              hover:text-white transition-colors duration-300
            `}
            aria-label={item.ariaLabel}
            aria-current={location.pathname === item.path ? 'page' : undefined}
          >
            {item.name}
            <span 
              className={`absolute left-0 -bottom-1 h-0.5 bg-white
              ${location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'} transition-all duration-300`}
            />
          </Link>
        </motion.div>
      ))}
      
      {/* Additional Navigation for Logged-in Users */}
      {isAuthenticated && (
        <>
          <div className="mx-2 h-6 w-px bg-white/30" />
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link
              to="/orders"
              className={`
                font-medium text-sm lg:text-base tracking-tight ${textColor}
                relative group [text-shadow:0px_0px_1px_rgba(255,255,255,0.5)]
                hover:text-white transition-colors duration-300
              `}
              aria-label="View my orders"
              aria-current={location.pathname === '/orders' ? 'page' : undefined}
            >
              My Orders
              <span 
                className={`absolute left-0 -bottom-1 h-0.5 bg-white
                ${location.pathname === '/orders' ? 'w-full' : 'w-0 group-hover:w-full'} transition-all duration-300`}
              />
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link
              to="/wishlist"
              className={`
                font-medium text-sm lg:text-base tracking-tight ${textColor}
                relative group [text-shadow:0px_0px_1px_rgba(255,255,255,0.5)]
                hover:text-white transition-colors duration-300
              `}
              aria-label="View my wishlist"
              aria-current={location.pathname === '/wishlist' ? 'page' : undefined}
            >
              Wishlist
              <span 
                className={`absolute left-0 -bottom-1 h-0.5 bg-white
                ${location.pathname === '/wishlist' ? 'w-full' : 'w-0 group-hover:w-full'} transition-all duration-300`}
              />
            </Link>
          </motion.div>
        </>
      )}
    </nav>
  );
};



