/**
 * Image optimization utilities for better performance and SEO
 */

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpg' | 'png';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

/**
 * Generate optimized image URL with query parameters
 * This works with image CDNs or optimization services
 */
export const getOptimizedImageUrl = (
  src: string,
  options: ImageOptimizationOptions = {}
): string => {
  const {
    width,
    height,
    quality = 85,
    format = 'webp',
    fit = 'cover',
  } = options;

  // If already a full URL with optimization params, return as-is
  if (src.includes('?') || src.startsWith('http')) {
    return src;
  }

  const params = new URLSearchParams();
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  params.append('q', quality.toString());
  params.append('f', format);
  params.append('fit', fit);

  return `${src}?${params.toString()}`;
};

/**
 * Generate responsive image srcset
 */
export const generateSrcSet = (
  baseSrc: string,
  sizes: number[] = [400, 800, 1200, 1600, 2000]
): string => {
  return sizes
    .map((size) => {
      const optimizedUrl = getOptimizedImageUrl(baseSrc, {
        width: size,
        quality: 85,
        format: 'webp',
      });
      return `${optimizedUrl} ${size}w`;
    })
    .join(', ');
};

/**
 * Generate sizes attribute for responsive images
 */
export const generateSizes = (breakpoints: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
}): string => {
  const { mobile = '100vw', tablet = '50vw', desktop = '33vw' } = breakpoints;
  return `(max-width: 640px) ${mobile}, (max-width: 1024px) ${tablet}, ${desktop}`;
};

/**
 * Preload critical images
 */
export const preloadImage = (src: string, as: 'image' = 'image'): void => {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = src;
  link.setAttribute('fetchpriority', 'high');
  document.head.appendChild(link);
};

/**
 * Lazy load images using Intersection Observer
 */
export const setupLazyImages = (): void => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    // Fallback: load all images immediately
    const images = document.querySelectorAll('img[data-src]');
    images.forEach((img) => {
      const src = img.getAttribute('data-src');
      if (src) {
        (img as HTMLImageElement).src = src;
        img.removeAttribute('data-src');
      }
    });
    return;
  }

  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.getAttribute('data-src');
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        }
      });
    },
    {
      rootMargin: '50px', // Start loading 50px before image enters viewport
    }
  );

  // Observe all images with data-src attribute
  const lazyImages = document.querySelectorAll('img[data-src]');
  lazyImages.forEach((img) => imageObserver.observe(img));
};

/**
 * Convert image to WebP format (client-side)
 * Note: This is a fallback. Server-side conversion is preferred.
 */
export const convertToWebP = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert image'));
            }
          },
          'image/webp',
          0.85
        );
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Get image dimensions without loading full image
 */
export const getImageDimensions = (src: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = src;
  });
};





















































