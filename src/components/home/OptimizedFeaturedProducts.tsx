import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowRight, ShoppingBag, Plus, Sparkles, Star, Zap, Crown } from 'lucide-react';
import { products } from '../../data/products';
import { Button } from '../ui/Button';
import { FEATURED_PRIMARY_CTA_CLASS } from './featuredPrimaryCta';
import { motion, AnimatePresence } from 'framer-motion';

interface FeaturedProductsProps {
  onProductClick: (productId: string) => void;
}

// Optimized image component with lazy loading
const LazyProductImage: React.FC<{
  src: string;
  alt: string;
  isActive: boolean;
  productId: string;
  imgIndex: number;
  hoveredProduct: string | null;
  isTransitioning: boolean;
}> = ({ src, alt, isActive, productId, imgIndex, hoveredProduct, isTransitioning }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.1 
      }
    );

    const imgElement = document.getElementById(`img-${productId}-${imgIndex}`);
    if (imgElement) {
      observer.observe(imgElement);
    }

    return () => observer.disconnect();
  }, [productId, imgIndex]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoaded(false);
  }, []);

  return (
    <div
      id={`img-${productId}-${imgIndex}`}
      className="absolute inset-0 w-full h-full"
    >
      {isInView && (
        <>
          {/* Loading placeholder */}
          {!isLoaded && !hasError && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-2xl flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* Error placeholder */}
          {hasError && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center">
              <div className="text-gray-500 text-sm">Image unavailable</div>
            </div>
          )}
          
          {/* Actual image */}
          <motion.img
            src={src}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={`absolute inset-0 w-full h-full object-cover rounded-2xl transition-all duration-700 ease-in-out
              ${isLoaded && isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}
            `}
            animate={{
              scale: hoveredProduct === productId ? 1.05 : 1,
              filter: isTransitioning ? 'blur(2px)' : 'blur(0px)',
            }}
            transition={{ duration: 0.7 }}
            loading="lazy"
            decoding="async"
          />
        </>
      )}
    </div>
  );
};

const OptimizedFeaturedProducts: React.FC<FeaturedProductsProps> = ({ onProductClick }) => {
  const [colorIndex, setColorIndex] = useState(0);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [isGlowing, setIsGlowing] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState<string[]>([]);
  
  // Enhanced color palette with more vibrant colors
  const colors = useMemo(() => [
    '#FFD700', // Gold
    '#FF6B6B', // Coral Red
    '#4ECDC4', // Turquoise
    '#45B7D1', // Sky Blue
    '#96CEB4', // Mint Green
    '#FFEAA7', // Soft Yellow
    '#DDA0DD', // Plum
    '#98D8C8', // Seafoam
  ], []);

  // Memoize featured products to prevent unnecessary recalculations
  const featuredProducts = useMemo(() => 
    products.filter(product => product.featured), 
    []
  );

  // Optimized color animation with useCallback
  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colors.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [colors.length]);

  // Initialize image indices with useCallback
  const initializeImageIndices = useCallback(() => {
    const initialImageState = featuredProducts.reduce((acc, product) => {
      acc[product.id] = 0;
      return acc;
    }, {} as { [key: string]: number });
    setCurrentImageIndex(initialImageState);
  }, [featuredProducts]);

  useEffect(() => {
    initializeImageIndices();
  }, [initializeImageIndices]);

  // Optimized auto-rotate with reduced frequency
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => {
        const newState = { ...prev };
        Object.keys(newState).forEach(productId => {
          if (hoveredProduct !== productId) {
            newState[productId] = (newState[productId] + 1) % 3;
          }
        });
        return newState;
      });
    }, 10000); // Increased from 8s to 10s to reduce CPU usage

    return () => clearInterval(interval);
  }, [hoveredProduct]);

  // Intersection Observer for product visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const productId = entry.target.getAttribute('data-product-id');
          if (productId) {
            if (entry.isIntersecting) {
              setVisibleProducts(prev => [...new Set([...prev, productId])]);
            }
          }
        });
      },
      { 
        rootMargin: '100px', // Start loading 100px before entering viewport
        threshold: 0.1 
      }
    );

    const productElements = document.querySelectorAll('[data-product-id]');
    productElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Auto-rotate images every 7 seconds when not hovered
  useEffect(() => {
    if (!featuredProducts.length) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => {
        const newState = { ...prev };
        Object.keys(newState).forEach(id => {
          // Only rotate if not currently hovered
          if (hoveredProduct !== id) {
            const product = featuredProducts.find(p => p.id === id);
            if (product && product.images && product.images.length > 1) {
              newState[id] = (newState[id] + 1) % product.images.length;
            }
          }
        });
        return newState;
      });
    }, 7000); // Change every 7 seconds

    return () => clearInterval(interval);
  }, [hoveredProduct, featuredProducts]);

  const handleMouseEnter = useCallback((productId: string) => {
    setHoveredProduct(productId);
    
    // Immediately change image on hover
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex(prev => ({
        ...prev,
        [productId]: (prev[productId] + 1) % 3
      }));
      setIsTransitioning(false);
    }, 300); // Smooth fade transition
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredProduct(null);
  }, []);

  // Optimized glow effect with reduced frequency
  useEffect(() => {
    const glowInterval = setInterval(() => {
      setIsGlowing(prev => !prev);
    }, 3000); // Increased from 2s to 3s
    
    return () => {
      clearInterval(glowInterval);
    };
  }, []);

  const handleViewMore = useCallback(() => {
    window.location.href = '/shop';
  }, []);

  const handleViewProduct = useCallback((e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    onProductClick(productId);
  }, [onProductClick]);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.2),transparent_50%)]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 mb-6"
            animate={{ 
              scale: isGlowing ? 1.05 : 1,
              filter: isGlowing ? 'brightness(1.2)' : 'brightness(1)'
            }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          >
            <Crown className="w-8 h-8 text-yellow-400" />
            <span className="text-yellow-400 font-bold text-lg tracking-wider">FEATURED PRODUCTS</span>
            <Crown className="w-8 h-8 text-yellow-400" />
          </motion.div>
          
          <motion.h2 
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Discover our{' '}
            <span 
              className="bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent"
              style={{ color: colors[colorIndex] }}
            >
              handpicked collection
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Discover our handpicked collection of premium t-shirts, each crafted with exceptional quality and unique designs that define your style.
          </motion.p>
        </motion.div>

        {/* Products Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          {featuredProducts.map((product, index) => (
            <motion.article 
              key={product.id} 
              data-product-id={product.id}
              className="group"
              onMouseEnter={() => handleMouseEnter(product.id)}
              onMouseLeave={handleMouseLeave}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-900 to-black rounded-2xl relative border border-white/10 backdrop-blur-sm">
                {/* Glassmorphism Overlay */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-2xl"></div>
                
                {/* Optimized lazy-loaded images */}
                {product.images.map((imageSrc, imgIndex) => {
                  const currentIndex = currentImageIndex[product.id] || 0;
                  return (
                    <LazyProductImage
                      key={imgIndex}
                      src={imageSrc}
                      alt={`${product.name} - Image ${imgIndex + 1}`}
                      isActive={imgIndex === currentIndex}
                      productId={product.id}
                      imgIndex={imgIndex}
                      hoveredProduct={hoveredProduct}
                      isTransitioning={isTransitioning}
                    />
                  );
                })}
                
                {/* Featured Badge */}
                {product.featured && (
                  <motion.div 
                    className="absolute top-4 left-4 z-30"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 text-xs font-bold tracking-widest rounded-full flex items-center gap-1">
                      <Star size={12} />
                      NEW
                    </div>
                  </motion.div>
                )}
                
                {/* Image indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-40">
                  {product.images.map((_, imgIndex) => {
                    const currentIndex = currentImageIndex[product.id] || 0;
                    return (
                      <motion.div
                        key={imgIndex}
                        className={`w-2 h-2 rounded-full transition-all duration-300
                          ${imgIndex === currentIndex 
                            ? 'bg-white' 
                            : 'bg-white/40'
                          }`}
                        whileHover={{ scale: 1.2 }}
                      />
                    );
                  })}
                </div>
                
                {/* Quick add button */}
                <AnimatePresence>
                  {hoveredProduct === product.id && (
                    <motion.div 
                      className="absolute bottom-4 right-4 z-40"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <button 
                        onClick={(e) => handleViewProduct(e, product.id)}
                        className="flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full text-black hover:bg-white shadow-lg hover:scale-110 transition-all duration-300"
                        aria-label="Quick view"
                      >
                        <Plus size={20} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Product Info */}
              <div className="mt-6 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-white text-lg font-semibold tracking-wider">{product.name}</h3>
                  <motion.p 
                    className="text-white/90 font-bold text-lg"
                    animate={{ color: hoveredProduct === product.id ? colors[colorIndex] : 'rgba(255, 255, 255, 0.9)' }}
                  >
                    R500
                  </motion.p>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={`${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-gray-400 text-sm">({product.reviewCount})</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-purple-400" />
                  <span className="text-gray-300 text-sm">Premium Quality</span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <Button
            onClick={handleViewMore}
            className={FEATURED_PRIMARY_CTA_CLASS}
          >
            Browse Collection
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default OptimizedFeaturedProducts;
