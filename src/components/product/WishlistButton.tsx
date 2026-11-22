import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/useAuth';
import { Product } from '../../types';
import AuthPrompt from '../auth/AuthPrompt';

interface WishlistButtonProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button' | 'text';
  showText?: boolean;
  className?: string;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
  product,
  size = 'md',
  variant = 'icon',
  showText = false,
  className = ''
}) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const isWishlisted = isInWishlist(product.id);

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }

    setIsAnimating(true);
    
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }

    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(false), 300);
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8';
      case 'lg':
        return 'w-12 h-12';
      case 'md':
      default:
        return 'w-10 h-10';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 16;
      case 'lg':
        return 24;
      case 'md':
      default:
        return 20;
    }
  };

  const getButtonClasses = () => {
    const baseClasses = 'flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2';
    const sizeClasses = getSizeClasses();
    
    if (variant === 'button') {
      return `${baseClasses} ${sizeClasses} ${
        isWishlisted 
          ? 'bg-red-600 text-white hover:bg-red-700' 
          : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-600 border border-gray-300'
      } shadow-sm hover:shadow-md`;
    }
    
    return `${baseClasses} ${sizeClasses} ${
      isWishlisted 
        ? 'text-red-600 hover:text-red-700' 
        : 'text-gray-400 hover:text-red-600'
    }`;
  };

  const getTextClasses = () => {
    return `ml-2 text-sm font-medium ${
      isWishlisted ? 'text-red-600' : 'text-gray-600'
    }`;
  };

  return (
    <>
      <motion.button
        onClick={handleToggleWishlist}
        className={`${getButtonClasses()} ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <motion.div
          animate={isAnimating ? { rotate: [0, 360] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Heart 
            size={getIconSize()} 
            className={`transition-colors duration-300 ${
              isWishlisted ? 'fill-current' : ''
            }`}
          />
        </motion.div>
        {showText && (
          <span className={getTextClasses()}>
            {isWishlisted ? 'Saved' : 'Save'}
          </span>
        )}
      </motion.button>

      <AuthPrompt
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        action="add_to_wishlist"
        title="Add to Wishlist"
        description="Log in to save items to your wishlist and never lose track of products you love"
      />
    </>
  );
};

export default WishlistButton;
