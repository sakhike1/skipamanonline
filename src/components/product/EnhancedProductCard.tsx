import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Heart, Eye, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../ui/ToastProvider';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import ProductCardSkeleton from '../ui/ProductCardSkeleton';
import ProductQuickView from './ProductQuickView';

interface EnhancedProductCardProps {
  product: Product;
  theme?: 'dark' | 'light';
  index?: number;
  onQuickView?: (product: Product) => void;
}

const EnhancedProductCard: React.FC<EnhancedProductCardProps> = ({
  product,
  theme = 'light',
  index = 0,
  onQuickView,
}) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showQuickView, setShowQuickView] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const { elementRef, hasIntersected } = useIntersectionObserver();

  const isDarkTheme = theme === 'dark';
  const isWishlisted = isInWishlist(product.id);

  // Lazy load images when in viewport
  useEffect(() => {
    if (hasIntersected && isLoading) {
      const img = new Image();
      img.src = product.images[0];
      img.onload = () => setIsLoading(false);
    }
  }, [hasIntersected, isLoading, product.images]);

  // Image zoom on hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  // Auto-rotate images every 7 seconds when not hovered
  useEffect(() => {
    if (hoveredProductId === product.id) return; // Pause auto-rotation on hover
    
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
        setIsTransitioning(false);
      }, 300);
    }, 7000); // Change every 7 seconds

    return () => clearInterval(interval);
  }, [hoveredProductId, product.id, product.images.length]);

  const handleMouseEnter = () => {
    setHoveredProductId(product.id);
    
    // Immediately change image on hover
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
      setIsTransitioning(false);
    }, 300); // Smooth fade transition
  };

  const handleMouseLeave = () => {
    setHoveredProductId(null);
    setShowZoom(false);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    } else {
      setShowQuickView(true);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.sizes.length > 0 && product.colors.length > 0) {
      addToCart(product.id, product.sizes[0], product.colors[0], 1);
      showToast(`${product.name} added to cart!`, 'success');
    } else {
      showToast('Product options not available', 'warning');
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
      showToast('Removed from wishlist', 'info');
    } else {
      addToWishlist(product);
      showToast('Added to wishlist', 'success');
    }
  };

  const handleViewProduct = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/product/${product.id}`);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Show skeleton while loading
  if (isLoading && !hasIntersected) {
    return <ProductCardSkeleton theme={theme} />;
  }

  return (
    <>
      <motion.div
        ref={(node) => {
          if (node) {
            (elementRef as React.MutableRefObject<HTMLElement | null>).current = node;
            (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }
        }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group cursor-pointer transform transition-all duration-500 ease-out"
        onClick={handleViewProduct}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="article"
        aria-label={`Product: ${product.name}`}
      >
        {/* Product Image and Overlay */}
        <div
          ref={imageRef}
          className={`aspect-[3/4] overflow-hidden relative rounded-2xl product-glow luxury-shimmer
            ${isDarkTheme ? 'bg-neutral-900 border-2 border-white/10 group-hover:border-white/30' : 'bg-neutral-100 border-2 border-gray-200 group-hover:border-gray-400'}
            transition-all duration-500 ease-out
            ${isDarkTheme
              ? 'shadow-2xl shadow-black/50 group-hover:shadow-2xl group-hover:shadow-white/10'
              : 'shadow-xl shadow-gray-900/10 group-hover:shadow-2xl group-hover:shadow-gray-900/20'
            }
            group-hover:-translate-y-2
          `}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setShowZoom(true)}
          onMouseLeave={() => setShowZoom(false)}
        >
          {/* Lazy loaded images */}
          <AnimatePresence mode="wait">
            {product.images.map((imageSrc, index) => {
              const isActive = index === currentImageIndex;
              return (
                isActive && (
                  <motion.img
                    key={`${product.id}-${index}`}
                    src={imageSrc}
                    alt={`${product.name} - Image ${index + 1}`}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in-out
                      ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}
                      ${hoveredProductId === product.id ? 'scale-105' : 'scale-100'}
                      ${isTransitioning ? 'blur-[0.5px]' : 'blur-0'}
                      ${showZoom ? 'cursor-zoom-in' : ''}
                    `}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isActive ? 1 : 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      transform: showZoom
                        ? `scale(1.5) translate(${(50 - zoomPosition.x) * 0.3}%, ${(50 - zoomPosition.y) * 0.3}%)`
                        : `scale(${hoveredProductId === product.id ? '1.05' : '1'})`,
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }}
                  />
                )
              );
            })}
          </AnimatePresence>

          {/* Overlay */}
          <div
            className={`absolute inset-0 transition-all duration-500 z-30
              ${isDarkTheme ? 'bg-black/0 group-hover:bg-black/20' : 'bg-black/0 group-hover:bg-black/5'}`}
          />

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleQuickView}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg
                ${isDarkTheme ? 'bg-white/90 text-black hover:bg-white' : 'bg-black/90 text-white hover:bg-black'}`}
              aria-label="Quick view product"
            >
              <Eye size={16} className="flex-shrink-0" />
            </button>
            <button
              onClick={handleWishlistToggle}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg
                ${isWishlisted
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : isDarkTheme
                    ? 'bg-white/90 text-black hover:bg-white'
                    : 'bg-black/90 text-white hover:bg-black'
                }`}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} className="flex-shrink-0" />
            </button>
            <button
              onClick={handleAddToCart}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg
                ${isDarkTheme ? 'bg-white/90 text-black hover:bg-white' : 'bg-black/90 text-white hover:bg-black'}`}
              aria-label="Add to cart"
            >
              <ShoppingBag size={16} className="flex-shrink-0" />
            </button>
          </div>

          {/* Zoom Indicator */}
          {showZoom && (
            <div className="absolute bottom-3 left-3 z-40 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm
                ${isDarkTheme ? 'bg-white/20 text-white' : 'bg-black/20 text-black'}`}>
                <ZoomIn size={12} className="inline mr-1" />
                Zoom
              </div>
            </div>
          )}

          {/* Image indicators */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1.5 z-40">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300
                  ${index === currentImageIndex
                    ? (isDarkTheme ? 'bg-white w-4' : 'bg-black w-4')
                    : (isDarkTheme ? 'bg-white/40' : 'bg-black/40')
                  }`}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-5 space-y-3">
          <h3
            className={`text-lg md:text-xl tracking-tight font-bold transition-colors duration-200
              ${isDarkTheme ? 'text-white group-hover:text-gray-200' : 'text-gray-900 group-hover:text-gray-800'}`}
          >
            {product.name}
          </h3>
          <p className={`text-lg md:text-xl font-black ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
            R{(product.price / 100).toFixed(2)}
          </p>

          {/* Modern "View Product" Button */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleViewProduct}
            aria-label={`View product details for ${product.name}`}
            className="group mt-4 w-full py-3.5 text-sm font-bold tracking-wider uppercase transition-all duration-300
              flex items-center justify-center gap-2 overflow-hidden relative rounded-full
              bg-black text-white border-2 border-black hover:bg-gray-900
              shadow-lg hover:shadow-2xl hover:shadow-black/30 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
            />
            <span className="relative z-10">VIEW PRODUCT</span>
            <ArrowRight
              size={16}
              className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
            />
          </motion.button>
        </div>
      </motion.div>

      {/* Quick View Modal */}
      {showQuickView && (
        <ProductQuickView product={product} isOpen={showQuickView} onClose={() => setShowQuickView(false)} />
      )}
    </>
  );
};

export default EnhancedProductCard;

