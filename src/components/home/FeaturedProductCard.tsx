import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Product } from '../../types';

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

  const handleCardClick = useCallback(() => {
    onClick(product.id);
  }, [onClick, product.id]);

  const handleViewProductClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(product.id);
  }, [onClick, product.id]);

  // Safe image access
  const safeImages = product.images && product.images.length > 0 ? product.images : ['/placeholder-image.jpg'];

  return (
    <motion.article 
      className="skipaman-featured-card group flex h-full min-w-0 cursor-pointer flex-col"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 1, y: 0 }}
      onClick={handleCardClick}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-[0.875rem] bg-neutral-100">
        
        {/* Images */}
        {safeImages.map((imageSrc, imgIndex) => {
          return (
            <motion.img
              key={`${product.id}-${imgIndex}`}
              src={imageSrc}
              alt={imgIndex === currentImageIndex ? product.name : ''}
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover rounded-2xl transition-opacity duration-300 ease-in-out
                ${imgIndex === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}
              `}
            />
          );
        })}
        
      </div>
      
      <div className="flex flex-1 flex-col px-1 pb-1 pt-3 sm:px-2">
        <h3 className="text-base font-semibold leading-snug text-neutral-900">{product.name}</h3>
        <p className="mt-1 text-sm font-semibold tabular-nums text-neutral-700">
          R{(product.price / 100).toFixed(2)}
        </p>
        <div className="mt-auto pt-4">
          <button
            type="button"
            onClick={handleViewProductClick}
            className="skipaman-featured-link inline-flex min-h-11 w-full items-center justify-center rounded-full px-2 py-2 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            View Product
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default FeaturedProductCard;


