import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import NotificationBell from '../../notifications/NotificationBell';
import { HeaderUserMenu } from './HeaderUserMenu';

interface HeaderActionsProps {
  textColor: string;
  hoverBgColor: string;
  isAuthenticated: boolean;
  isDarkPage: boolean;
  isScrolled: boolean;
  showCartPreview: boolean;
  toggleCartPreview: () => void;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({
  textColor,
  hoverBgColor,
  isAuthenticated,
  isDarkPage,
  isScrolled,
  showCartPreview,
  toggleCartPreview
}) => {
  const { cart } = useCart();
  const { getWishlistCount } = useWishlist();
  const navigate = useNavigate();

  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  const badgeClassName = isDarkPage && !isScrolled 
    ? 'bg-white text-black' 
    : 'bg-black text-white';

  return (
    <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
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
              className={`absolute -top-1 -right-1 ${badgeClassName}
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

      {/* Wishlist Button */}
      <Link to="/wishlist">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            p-2 rounded-full relative transition-all ${textColor} ${hoverBgColor}
          `}
          aria-label={`Wishlist with ${getWishlistCount()} items`}
        >
          <Heart size={20} className="sm:w-[22px] sm:h-[22px] [filter:drop-shadow(0px_0px_1px_rgba(255,255,255,0.5))]" />
          <AnimatePresence>
            {getWishlistCount() > 0 && (
              <motion.span
                className={`absolute -top-1 -right-1 ${badgeClassName}
                  text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              >
                {getWishlistCount()}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </Link>

      {/* Notification Bell */}
      {isAuthenticated && <NotificationBell />}

      {/* User Menu / Login Button */}
      {isAuthenticated ? (
        <HeaderUserMenu
          textColor={textColor}
          hoverBgColor={hoverBgColor}
          isDarkPage={isDarkPage}
          cartItemCount={cartItemCount}
        />
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
    </div>
  );
};



