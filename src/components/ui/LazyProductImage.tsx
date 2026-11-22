import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface LazyProductImageProps {
  src: string;
  alt: string;
  className?: string;
  isActive?: boolean;
  onLoad?: () => void;
}

const LazyProductImage: React.FC<LazyProductImageProps> = ({
  src,
  alt,
  className = '',
  isActive = true,
  onLoad
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { elementRef, hasIntersected } = useIntersectionObserver({
    rootMargin: '100px',
    threshold: 0.1
  });

  useEffect(() => {
    if (hasIntersected && !isLoaded && !hasError) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setIsLoaded(true);
        if (onLoad) onLoad();
      };
      img.onerror = () => {
        setHasError(true);
      };
    }
  }, [hasIntersected, src, isLoaded, hasError, onLoad]);

  return (
    <div ref={elementRef as React.RefObject<HTMLDivElement>} className={className}>
      {!hasIntersected && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
      )}
      
      {hasIntersected && !isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Image unavailable</span>
        </div>
      )}

      {isLoaded && (
        <motion.img
          src={src}
          alt={alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
};

export default React.memo(LazyProductImage);


































































