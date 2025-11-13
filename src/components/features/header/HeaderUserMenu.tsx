import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ShoppingBag, Heart, Settings, Shield, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { useHeaderStyles } from './hooks/useHeaderStyles';
import PointsDisplay from '../../ui/PointsDisplay';

interface HeaderUserMenuProps {
  textColor: string;
  hoverBgColor: string;
  isDarkPage: boolean;
  cartItemCount: number;
}

export const HeaderUserMenu: React.FC<HeaderUserMenuProps> = ({
  textColor,
  hoverBgColor,
  isDarkPage,
  cartItemCount
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { dropdownColors } = useHeaderStyles(false);

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

  // Always use dark background to match header with white text
  const dropdownBgClass = 'bg-gray-900/95 border border-gray-700/50';

  // Always use light colors for links on dark background
  const adminLinkClass = 'text-purple-300 hover:bg-purple-500/20';
  const logoutClass = 'text-red-400 hover:bg-red-500/20';

  return (
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
            className={`absolute right-0 mt-2 w-64 backdrop-blur-xl rounded-lg overflow-hidden z-[100] shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] ${dropdownBgClass}`}
          >
            <div className="p-4">
              {/* Welcome Message */}
              <div className="mb-3">
                <p className={`${dropdownColors.muted} text-xs uppercase tracking-wider`}>
                  Welcome back
                </p>
              </div>

              {/* User Info */}
              <div className={`px-3 py-3 border-b ${dropdownColors.border} mb-3`}>
                <p className={`${dropdownColors.primary} font-semibold text-lg`}>
                  {user?.firstName} {user?.lastName}
                </p>
                <p className={`${dropdownColors.secondary} text-sm`}>
                  {user?.email}
                </p>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    user?.role === 'admin'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {user?.role === 'admin' ? 'Administrator' : 'Customer'}
                  </span>
                </div>

                {/* Points Display */}
                <div className="mt-3 pt-3 border-t border-gray-600/30">
                  <div className="flex items-center justify-between">
                    <span className={`${dropdownColors.muted} text-sm`}>Your Points</span>
                    <PointsDisplay
                      showIcon={true}
                      size="sm"
                      variant="badge"
                    />
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="space-y-1">
                <Link
                  to="/profile"
                  className={`flex items-center px-3 py-2 text-sm ${dropdownColors.primary} ${dropdownColors.hover} rounded-md transition-colors`}
                  onClick={() => setShowUserMenu(false)}
                >
                  <User size={16} className="mr-3" />
                  My Profile
                </Link>
                <Link
                  to="/orders"
                  className={`flex items-center px-3 py-2 text-sm ${dropdownColors.primary} ${dropdownColors.hover} rounded-md transition-colors`}
                  onClick={() => setShowUserMenu(false)}
                >
                  <ShoppingBag size={16} className="mr-3" />
                  My Orders
                </Link>
                <Link
                  to="/wishlist"
                  className={`flex items-center px-3 py-2 text-sm ${dropdownColors.primary} ${dropdownColors.hover} rounded-md transition-colors`}
                  onClick={() => setShowUserMenu(false)}
                >
                  <Heart size={16} className="mr-3" />
                  My Wishlist
                </Link>
                <Link
                  to="/client-center"
                  className={`flex items-center px-3 py-2 text-sm ${dropdownColors.primary} ${dropdownColors.hover} rounded-md transition-colors`}
                  onClick={() => setShowUserMenu(false)}
                >
                  <Settings size={16} className="mr-3" />
                  Client Center
                </Link>
                {cartItemCount > 0 && (
                  <Link
                    to="/checkout"
                    className="flex items-center px-3 py-2 text-sm bg-green-600/20 text-green-300 hover:bg-green-600/30 rounded-md transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <ShoppingBag size={16} className="mr-3" />
                    Checkout ({cartItemCount} items)
                  </Link>
                )}
                <Link
                  to="/settings"
                  className={`flex items-center px-3 py-2 text-sm ${dropdownColors.primary} ${dropdownColors.hover} rounded-md transition-colors`}
                  onClick={() => setShowUserMenu(false)}
                >
                  <Settings size={16} className="mr-3" />
                  Settings
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`flex items-center px-3 py-2 text-sm ${adminLinkClass} rounded-md transition-colors`}
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Shield size={16} className="mr-3" />
                    Admin Dashboard
                  </Link>
                )}
                <div className={`border-t ${dropdownColors.border} my-2`} />
                <button
                  onClick={handleLogout}
                  className={`flex items-center w-full px-3 py-2 text-sm ${logoutClass} rounded-md transition-colors`}
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
  );
};



