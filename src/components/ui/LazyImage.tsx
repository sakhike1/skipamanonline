import React, { useState, useEffect } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
}

/**
 * Optimized lazy loading image component
 */
const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3C/svg%3E',
  className = '',
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const { elementRef, hasIntersected } = useIntersectionObserver();

  useEffect(() => {
    if (hasIntersected && imageSrc === placeholder) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
      img.onerror = () => {
        // Keep placeholder on error
        setIsLoaded(false);
      };
    }
  }, [hasIntersected, src, imageSrc, placeholder]);

  return (
    <img
      ref={elementRef as React.RefObject<HTMLImageElement>}
      src={imageSrc}
      alt={alt}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
};

export default React.memo(LazyImage);
