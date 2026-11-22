import React from 'react';
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

  const iconBtnClass = `
    relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full
    transition-opacity duration-200 ${textColor} ${hoverBgColor} hover:opacity-90
  `;

  return (
    <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 xl:gap-4">
      {/* Cart Button — fixed square + flex center so hover ring matches global 44px min touch */}
      <button
        type="button"
        className={iconBtnClass}
        onClick={toggleCartPreview}
        aria-label={`Cart with ${cartItemCount} items`}
      >
        <ShoppingBag
          size={20}
          className="pointer-events-none shrink-0 sm:h-[22px] sm:w-[22px] max-md:[filter:none] [filter:drop-shadow(0px_0px_1px_rgba(255,255,255,0.5))]"
          aria-hidden
        />
        <AnimatePresence>
          {cartItemCount > 0 && (
            <motion.span
              className={`absolute -right-0.5 -top-0.5 ${badgeClassName}
                flex h-4 w-4 items-center justify-center rounded-full text-xs font-bold sm:h-5 sm:w-5`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              {cartItemCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Wishlist — single <a> (no nested button) for correct hit target + centered hover */}
      <Link
        to="/wishlist"
        className={iconBtnClass}
        aria-label={`Wishlist with ${getWishlistCount()} items`}
      >
        <Heart
          size={20}
          className="pointer-events-none shrink-0 sm:h-[22px] sm:w-[22px] max-md:[filter:none] [filter:drop-shadow(0px_0px_1px_rgba(255,255,255,0.5))]"
          aria-hidden
        />
        <AnimatePresence>
          {getWishlistCount() > 0 && (
            <motion.span
              className={`absolute -right-0.5 -top-0.5 ${badgeClassName}
                flex h-4 w-4 items-center justify-center rounded-full text-xs font-bold sm:h-5 sm:w-5`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              {getWishlistCount()}
            </motion.span>
          )}
        </AnimatePresence>
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
          type="button"
          className="hidden sm:flex items-center gap-2 rounded-full border-2 border-black bg-black px-4 py-2.5 text-white shadow-lg transition-all duration-200 hover:bg-gray-900 hover:shadow-xl"
          onClick={() => navigate('/login')}
          aria-label="Login"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <User size={16} className="sm:w-[18px] sm:h-[18px] text-white" />
          <span className="hidden lg:block text-sm font-semibold text-white">
            Sign In
          </span>
        </motion.button>
      )}
    </div>
  );
};



