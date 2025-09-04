import React, { useState, useEffect } from 'react';
import { ArrowRight, ShoppingBag, Plus, Sparkles, Star, Zap, Crown } from 'lucide-react';
import { products } from '../../data/products';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface FeaturedProductsProps {
  onProductClick: (productId: string) => void;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ onProductClick }) => {
  const [colorIndex, setColorIndex] = useState(0);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [isGlowing, setIsGlowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Enhanced color palette with more vibrant colors
  const colors = [
    '#FFD700', // Gold
    '#FF6B6B', // Coral Red
    '#4ECDC4', // Turquoise
    '#45B7D1', // Sky Blue
    '#96CEB4', // Mint Green
    '#FFEAA7', // Soft Yellow
    '#DDA0DD', // Plum
    '#98D8C8', // Seafoam
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colors.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Initialize image indices
  useEffect(() => {
    const initialImageState = products.reduce((acc, product) => {
      acc[product.id] = 0;
      return acc;
    }, {} as { [key: string]: number });
    setCurrentImageIndex(initialImageState);
  }, []);

  // Auto-rotate images every 8 seconds
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
    }, 8000);

    return () => clearInterval(interval);
  }, [hoveredProduct]);

  // Get all featured products
  const featuredProducts = products.filter(product => product.featured);
  const displayProducts = featuredProducts;

  const handleMouseEnter = (productId: string) => {
    setHoveredProduct(productId);
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentImageIndex(prev => ({
        ...prev,
        [productId]: (prev[productId] + 1) % 3
      }));
      setIsTransitioning(false);
    }, 200);
  };

  const handleMouseLeave = () => {
    setHoveredProduct(null);
  };

  useEffect(() => {
    const glowInterval = setInterval(() => {
      setIsGlowing(prev => !prev);
    }, 2000);
    
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => {
      clearInterval(glowInterval);
      clearTimeout(loadingTimer);
    };
  }, []);

  const handleViewMore = () => {
    window.location.href = '/shop';
  };

  const handleViewProduct = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    onProductClick(productId);
  };

  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        {/* Floating Particles */}
        <div className="absolute top-1/4 left-1/4 animate-float-slow">
          <div className="w-2 h-2 bg-white/20 rounded-full"></div>
        </div>
        <div className="absolute bottom-1/3 right-1/3 animate-float">
          <div className="w-1 h-1 bg-white/30 rounded-full"></div>
        </div>
        <div className="absolute top-1/2 right-1/4 animate-float-delayed">
          <div className="w-3 h-3 bg-white/10 rounded-full"></div>
        </div>
      </div>

      <div className="relative z-10 py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center space-x-3 mb-6">
              <Crown className="h-8 w-8 text-purple-400" />
              <span className="text-purple-400 font-light tracking-widest text-sm uppercase">Curated Selection</span>
              <Crown className="h-8 w-8 text-purple-400" />
            </div>
            
            <motion.h2 
              className="fashion-heading text-6xl md:text-7xl mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent"
              animate={{
                textShadow: [
                  `0 0 20px ${colors[colorIndex]}40`,
                  `0 0 40px ${colors[colorIndex]}60`,
                  `0 0 20px ${colors[colorIndex]}40`,
                ],
              }}
              transition={{
                duration: 3,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            >
              FEATURED PRODUCTS
            </motion.h2>
            
            <motion.p 
              className="max-w-2xl mx-auto text-xl leading-relaxed text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Discover our handpicked collection of premium t-shirts, each crafted with exceptional quality and unique designs that define your style.
            </motion.p>
          </motion.div>

          {/* Browse Collection Button */}
          <motion.div 
            className="flex justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Button
              variant="outline"
              onClick={handleViewMore}
              className="group bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/30 text-white hover:from-purple-600 hover:to-pink-600 hover:border-purple-400 px-8 py-4 flex items-center gap-3 transition-all duration-300 relative overflow-hidden backdrop-blur-sm"
            >
              <span className="relative z-10 tracking-wider font-medium">Browse Collection</span>
              <ArrowRight size={18} className="transform transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
            </Button>
          </motion.div>
          
          {/* Products Grid */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {/* Product Cards */}
            {displayProducts.map((product, index) => (
              <motion.article 
                key={product.id} 
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
                  
                  {/* Preload all images */}
                  {product.images.map((imageSrc, imgIndex) => {
                    const currentIndex = currentImageIndex[product.id] || 0;
                    return (
                      <motion.img
                        key={imgIndex}
                        src={imageSrc}
                        alt={`${product.name} - Image ${imgIndex + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover rounded-2xl transition-all duration-700 ease-in-out
                          ${imgIndex === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}
                        `}
                        animate={{
                          scale: hoveredProduct === product.id ? 1.05 : 1,
                          filter: isTransitioning ? 'blur(2px)' : 'blur(0px)',
                        }}
                        transition={{ duration: 0.7 }}
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
                  <p className="text-white/50 text-sm uppercase tracking-wider">{product.category}</p>
                  
                  <motion.button
                    onClick={(e) => handleViewProduct(e, product.id)}
                    className="mt-4 w-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/30 text-white py-4 text-sm tracking-widest hover:from-purple-600 hover:to-pink-600 hover:border-purple-400 transition-all duration-300 flex items-center justify-center gap-2 rounded-xl backdrop-blur-sm group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ShoppingBag size={16} />
                    <span>View Product</span>
                  </motion.button>
                </div>
              </motion.article>
            ))}
            
            {/* Promotional Card */}
            <motion.article 
              className="lg:col-span-1 xl:col-span-2 row-span-1 relative overflow-hidden rounded-2xl"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="h-full bg-gradient-to-br from-black via-gray-900 to-black rounded-2xl relative border border-purple-400/30 overflow-hidden backdrop-blur-sm">
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-purple-500/10 animate-pulse"></div>
                
                {/* Animated border */}
                <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-2xl opacity-20 animate-spin-slow"></div>
                
                {/* Sparkle animations */}
                <div className="absolute top-1/4 left-1/4 animate-float-slow">
                  <Sparkles size={20} className="text-purple-400" />
                </div>
                <div className="absolute bottom-1/3 right-1/3 animate-float">
                  <Zap size={16} className="text-pink-400" />
                </div>
                <div className="absolute top-1/2 right-1/4 animate-float-delayed">
                  <Star size={24} className="text-purple-300" />
                </div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="bg-black/50 p-8 rounded-2xl backdrop-blur-sm w-full max-w-md border border-white/10">
                    <motion.h3 
                      className="text-purple-400 text-2xl font-bold mb-2 tracking-wide"
                      animate={{ color: colors[colorIndex] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      EXCLUSIVE SALE
                    </motion.h3>
                    <motion.p 
                      className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                      animate={{ scale: isGlowing ? 1.05 : 1 }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      30% OFF
                    </motion.p>
                    <p className="text-white text-xl mb-6">All Premium T-Shirts</p>
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
                      <motion.button 
                        onClick={() => window.location.href = '/shop/t-shirts'} 
                        className="relative px-8 py-4 bg-black text-purple-400 rounded-full font-medium group-hover:text-white transition-colors duration-300 flex items-center justify-center gap-3 uppercase tracking-wider border border-purple-400 w-full"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="text-lg">Shop Now</span>
                        <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </motion.button>
                    </div>
                    <p className="text-white/70 text-sm mt-6">Limited time offer</p>
                  </div>
                </div>
              </div>
            </motion.article>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;