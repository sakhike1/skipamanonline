import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Plus, Star } from 'lucide-react';
import { Product } from '../../types';
import { FEATURED_PRIMARY_CTA_CLASS } from './featuredPrimaryCta';

interface FeaturedProductCardProps {
  product: Product;
  onClick: (productId: string) => void;
}

const FeaturedProductCard: React.FC<FeaturedProductCardProps> = ({ product, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-rotate images every 7 seconds when not hovered
  useEffect(() => {
    if (isHovered || !product.images || product.images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % product.images.length);
    }, 7000); // Change every 7 seconds

    return () => clearInterval(interval);
  }, [isHovered, product.images]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    
    // Immediately change image on hover
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex(prev => (prev + 1) % product.images.length);
    }
  }, [product.images]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    onClick(product.id);
  }, [onClick, product.id]);

  const handleQuickViewClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(product.id);
  }, [onClick, product.id]);

  // Safe image access
  const safeImages = product.images && product.images.length > 0 ? product.images : ['/placeholder-image.jpg'];

  return (
    <motion.article 
      className="group cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 1, y: 0 }}
      onClick={handleCardClick}
    >
      <div className="aspect-[3/4] overflow-hidden bg-gray-200 rounded-2xl relative transition-all duration-300 shadow-lg shadow-gray-300/40 group-hover:shadow-2xl group-hover:shadow-gray-400/50 group-hover:scale-[1.02] border border-gray-300/50">
        
        {/* Images */}
        {safeImages.map((imageSrc, imgIndex) => {
          return (
            <motion.img
              key={`${product.id}-${imgIndex}`}
              src={imageSrc}
              alt={`${product.name} - Image ${imgIndex + 1}`}
              className={`absolute inset-0 w-full h-full object-cover rounded-2xl transition-opacity duration-300 ease-in-out
                ${imgIndex === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}
              `}
            />
          );
        })}
        
        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-4 left-4 z-30">
            <div className="bg-black text-white px-3 py-1 text-xs font-bold tracking-widest rounded-md flex items-center gap-1">
              <Star size={12} />
              NEW
            </div>
          </div>
        )}
        
        {/* Image indicators */}
        {safeImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1.5 z-40">
            {safeImages.map((_, imgIndex) => (
              <div
                key={imgIndex}
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ease-in-out
                  ${imgIndex === currentImageIndex 
                    ? 'bg-black' 
                    : 'bg-black/40'
                  }`}
              />
            ))}
          </div>
        )}
        
        {/* Quick add button */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              className="absolute bottom-4 right-4 z-40"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button 
                onClick={handleQuickViewClick}
                className="flex items-center justify-center w-12 h-12 rounded-md bg-black text-white shadow-lg hover:bg-gray-800 transition-colors duration-200 hover:scale-110"
                aria-label="Quick view"
              >
                <Plus size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Product Info */}
      <div className="mt-5 space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="text-black text-lg md:text-xl font-bold tracking-tight">{product.name}</h3>
          <motion.p 
            className="text-black font-black text-lg md:text-xl"
            animate={{ color: isHovered ? '#f59e0b' : 'rgba(0, 0, 0, 1)' }}
          >
            R{(product.price / 100).toFixed(2)}
          </motion.p>
        </div>
        <p className="text-gray-600 text-sm uppercase tracking-wider font-medium">{product.category}</p>
        
        {/* Matches Featured Products “Browse Collection” CTA */}
        <button
          type="button"
          onClick={handleQuickViewClick}
          className={`${FEATURED_PRIMARY_CTA_CLASS} mt-4 w-full justify-center`}
        >
          View Product
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.article>
  );
};

export default FeaturedProductCard;


