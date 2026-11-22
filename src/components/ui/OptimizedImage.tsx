import React, { useState, useEffect, useRef } from 'react';
import { getOptimizedImageUrl, generateSrcSet, generateSizes } from '../../utils/imageOptimizer';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpg' | 'png';
  lazy?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  quality = 85,
  format = 'webp',
  lazy = true,
  priority = false,
  sizes,
  className = '',
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>(
    priority ? getOptimizedImageUrl(src, { width, height, quality, format }) : undefined
  );
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (priority || !lazy) {
      setImageSrc(getOptimizedImageUrl(src, { width, height, quality, format }));
      return;
    }

    // Lazy loading with Intersection Observer
    if (imgRef.current && 'IntersectionObserver' in window) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setImageSrc(getOptimizedImageUrl(src, { width, height, quality, format }));
              if (observerRef.current && imgRef.current) {
                observerRef.current.unobserve(imgRef.current);
              }
            }
          });
        },
        {
          rootMargin: '50px',
        }
      );

      observerRef.current.observe(imgRef.current);
    } else {
      // Fallback: load immediately if IntersectionObserver not supported
      setImageSrc(getOptimizedImageUrl(src, { width, height, quality, format }));
    }

    return () => {
      if (observerRef.current && imgRef.current) {
        observerRef.current.unobserve(imgRef.current);
      }
    };
  }, [src, width, height, quality, format, lazy, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate responsive srcset if width is provided
  const srcSet = width ? generateSrcSet(src, [width, width * 2, width * 3]) : undefined;
  const sizesAttr = sizes || (width ? generateSizes({ mobile: '100vw', tablet: '50vw', desktop: '33vw' }) : undefined);

  if (hasError) {
    return (
      <div
        className={`bg-gray-200 dark:bg-gray-800 flex items-center justify-center ${className}`}
        style={{ width, height }}
        role="img"
        aria-label={alt}
      >
        <span className="text-gray-500 text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {/* Placeholder/skeleton */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse"
          style={{ width, height }}
        />
      )}

      {/* Actual image */}
      {imageSrc && (
        <img
          ref={imgRef}
          src={imageSrc}
          srcSet={srcSet}
          sizes={sizesAttr}
          alt={alt}
          width={width}
          height={height}
          loading={lazy && !priority ? 'lazy' : 'eager'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
