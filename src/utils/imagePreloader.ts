/**
 * Image Preloader Utility
 * Preloads critical images for better performance
 */

interface PreloadOptions {
  as?: 'image' | 'video';
  fetchPriority?: 'high' | 'low' | 'auto';
  crossorigin?: 'anonymous' | 'use-credentials';
}

/**
 * Preload a single image
 */
export const preloadImage = (
  src: string,
  options: PreloadOptions = {}
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = options.as || 'image';
    link.href = src;
    
    if (options.fetchPriority) {
      link.setAttribute('fetchpriority', options.fetchPriority);
    }
    
    if (options.crossorigin) {
      link.crossOrigin = options.crossorigin;
    }
    
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    
    document.head.appendChild(link);
  });
};

/**
 * Preload multiple images
 */
export const preloadImages = async (
  images: string[],
  options: PreloadOptions = {}
): Promise<void[]> => {
  return Promise.all(
    images.map((src) => preloadImage(src, options))
  );
};

/**
 * Preload hero images (above the fold)
 */
export const preloadHeroImages = () => {
  const heroImages = [
    // Hero section images
    '/images/image1.jpg',
    '/images/image6.jpg',
    // Note: Videos should not be preloaded as images
    // '/images/video1.mp4', // Removed - videos need different handling
    // Add more hero images as needed
  ].filter(Boolean);

  return preloadImages(heroImages, {
    fetchPriority: 'high',
  });
};

/**
 * Preload product images for featured products
 */
export const preloadProductImages = (productImages: string[]) => {
  // Preload first 4 product images (above the fold)
  const imagesToPreload = productImages.slice(0, 4);
  
  return preloadImages(imagesToPreload, {
    fetchPriority: 'high',
  });
};

/**
 * Preload images when they're about to be visible (Intersection Observer)
 */
export const preloadOnIntersection = (
  selector: string,
  rootMargin = '200px'
): void => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src || img.src;
          
          if (src && !img.complete) {
            preloadImage(src, { fetchPriority: 'auto' });
          }
          
          observer.unobserve(img);
        }
      });
    },
    { rootMargin }
  );

  document.querySelectorAll(selector).forEach((img) => {
    observer.observe(img);
  });
};

/**
 * Preload critical images on page load
 */
export const initImagePreloading = () => {
  // Preload images that are about to be visible
  preloadOnIntersection('img[data-src]', '200px');
};

