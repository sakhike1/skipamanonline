import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { products, getFeaturedProducts } from '../data/products';
import { Filter, X, ArrowRight, ShoppingBag, Tag, Sparkles, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from '../components/ui/LoadingSkeleton';
import SearchBar from '../components/ui/SearchBar';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    category: string;
  };
  onClick: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageHover = () => {
    if (product.images.length > 1) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-2xl hover:shadow-xl transition-all duration-300"
      onClick={() => onClick(product.id)}
      onMouseEnter={handleImageHover}
      onMouseLeave={() => setCurrentImageIndex(0)}
    >
      <div className="relative aspect-square overflow-hidden cursor-pointer">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/15 to-red-500/10 backdrop-blur-sm"></div>
        
        {/* Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl"></div>
        
        {/* Image Container */}
        <div className="relative z-10 h-full">
        <img
          src={product.images[currentImageIndex]}
          alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 absolute inset-0 filter grayscale hover:grayscale-0 rounded-2xl"
          />
          
          {/* Always Visible Overlay with Glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent rounded-2xl">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              {/* Glassmorphism Content Card */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3">
                <h3 className="text-white text-lg font-medium mb-1 drop-shadow-lg line-clamp-1 uppercase tracking-wide">{product.name}</h3>
                <p className="text-white/90 mb-2 font-semibold">R{(product.price / 100).toFixed(2)}</p>
                <p className="text-white/80 text-sm capitalize mb-3">{product.category}</p>
        <button
          onClick={(e) => { e.stopPropagation(); onClick(product.id); }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white hover:text-black transition-all duration-300"
        >
          View Product
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform duration-300"
          />
        </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Image Counter */}
        {product.images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full border border-white/20">
            {currentImageIndex + 1}/{product.images.length}
          </div>
        )}
        
        {/* Floating Sparkle Effect */}
        <div className="absolute top-3 left-3 w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  );
};

const PromoCard: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-2xl hover:shadow-xl transition-all duration-300"
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden cursor-pointer">
        {/* Gradient Background - Different colors for promo card */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/15 to-red-500/10 backdrop-blur-sm"></div>
        
        {/* Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl"></div>
        
        {/* Image Container */}
        <div className="relative z-10 h-full">
        <img
          src="https://images.pexels.com/photos/3965557/pexels-photo-3965557.jpeg"
          alt="Special Promotion"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 absolute inset-0 filter grayscale hover:grayscale-0 rounded-2xl"
          />
          
          {/* Always Visible Overlay with Glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent rounded-2xl">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              {/* Glassmorphism Content Card */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3">
        <div className="flex justify-between items-start mb-1">
                  <h3 className="text-white text-lg font-medium mb-1 drop-shadow-lg line-clamp-1 uppercase tracking-wide">Summer Sale Collection</h3>
          <div>
                    <span className="text-white/60 font-medium line-through mr-2">R500</span>
                    <span className="text-white/90 font-semibold">R500</span>
          </div>
        </div>
                <p className="text-white/80 text-sm mb-3">Up to 40% Off Selected Items</p>
        <button
          onClick={(e) => { e.stopPropagation(); onClick(); }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white hover:text-black transition-all duration-300"
        >
          View Offer
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform duration-300"
          />
        </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Limited Time Badge */}
        <div className="absolute top-3 left-3 bg-red-600/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full border border-white/20 flex items-center gap-1">
          <Tag size={12} />
          <span>LIMITED TIME</span>
        </div>
        
        {/* Floating Sparkle Effect */}
        <div className="absolute top-3 right-3 w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  );
};

const NewArrivalsPage: React.FC = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentPage, setCurrentPage] = useState(1);
  const [colorIndex, setColorIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const productsPerPage = 12;
  
  // Gold glitz color palette
  const colors = [
    '#FFD700', // Gold
    '#FFA500', // Orange
    '#FFC0CB', // Pink
    '#FF69B4', // Hot Pink
    '#DAA520', // Goldenrod
    '#B8860B', // Dark Goldenrod
    '#FFB6C1', // Light Pink
    '#FFDAB9', // Peach
  ];

  // Hero images array
  const heroImages = [
    '/images/4.jpg',
    '/images/5.jpg'
  ];

  // Initialize products
  useEffect(() => {
    const loadInitialProducts = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const initialProducts = getFeaturedProducts().slice(0, productsPerPage);
      setDisplayedProducts(initialProducts);
      setIsLoading(false);
    };
    
    loadInitialProducts();
  }, []);

  // Load more products function for infinite scroll
  const loadMoreProducts = useCallback(async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const allProducts = getFeaturedProducts();
    const currentLength = displayedProducts.length;
    const nextProducts = allProducts.slice(currentLength, currentLength + productsPerPage);
    
    if (nextProducts.length === 0) {
      setHasMore(false);
    } else {
      setDisplayedProducts(prev => [...prev, ...nextProducts]);
    }
    
    setIsLoading(false);
  }, [isLoading, hasMore, displayedProducts.length]);

  // Infinite scroll hook
  const { observerRef } = useInfiniteScroll(loadMoreProducts, hasMore);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colors.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Image rotation effect
  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(imageInterval);
  }, []);

  const newArrivals = getFeaturedProducts();
  const categories = [...new Set(newArrivals.map(product => product.category))];
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowFilters(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Enhanced filtering with search
  const filteredProducts = displayedProducts.filter(product => {
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };
  
  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };
  
  const toggleFilters = () => setShowFilters(!showFilters);
  
  const clearFilters = () => {
    setSelectedCategory(null);
    setPriceRange([0, 50000]);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Hero Section: full black bg with padding-top */}
      <div className="bg-black text-white pt-28 md:pt-32 px-6 md:px-20 pb-20 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-purple-600/15 to-purple-700/15 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="md:flex md:items-center md:justify-between gap-12 relative z-10">
          <div className="md:w-1/2 flex justify-center md:justify-start">
            <motion.div 
              className="w-full max-w-[900px] h-[500px] overflow-hidden rounded-2xl relative shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Enhanced Purple Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-purple-800/50 to-black/60 z-10"></div>
              
              {/* Rotating Images */}
              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentImageIndex}
                  src={heroImages[currentImageIndex]}
                  alt="Sport Collection" 
                  className="w-full h-[1000px] object-cover rounded-2xl absolute inset-0"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  loading="lazy"
                />
              </AnimatePresence>
              
              {/* Floating badge */}
              <motion.div 
                className="absolute top-6 left-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 z-20"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <span className="text-sm font-medium text-white uppercase tracking-wider">New Arrivals</span>
              </motion.div>
            </motion.div>
          </div>
          
          <div className="md:w-1/2 flex flex-col justify-center items-start relative z-20">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Enhanced title with better typography */}
              <div className="space-y-4">
                <motion.h1 
                  className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none"
                  animate={{
                    color: colors[colorIndex],
                    textShadow: [
                      '0 0 20px rgba(139, 92, 246, 0.6)',
                      '0 0 40px rgba(139, 92, 246, 0.8)',
                      '0 0 20px rgba(139, 92, 246, 0.6)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                >
                  <span className="block">NEW</span>
                  <span className="block bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                    SPORT
                  </span>
                  <span className="block">COLLECTION</span>
                </motion.h1>
              </div>
              
              {/* Enhanced description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-4"
              >
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-lg font-light">
                  The brand was originally aimed at men's fashion. Starting in <span className="text-purple-400 font-semibold">1995</span> women's fashion was launched in all its dimensions: from the most urban lines to the more casual.
                </p>
                
                {/* Feature highlights */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-sm font-medium text-white">Premium Quality</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-sm font-medium text-white">Urban Style</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-sm font-medium text-white">Casual Comfort</span>
                  </div>
                </div>
              </motion.div>
              
              {/* Enhanced CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 pt-6"
              >
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/shop')}
                  className="group relative overflow-hidden bg-gradient-to-r from-purple-400 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg tracking-wide hover:shadow-lg hover:shadow-purple-400/30 transition-all duration-300"
                >
                  <span className="relative z-10">Shop Collection</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/new-arrivals')}
                  className="group relative overflow-hidden border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg tracking-wide hover:border-purple-400 transition-all duration-300"
                >
                  <span className="relative z-10">View Lookbook</span>
                  <div className="absolute inset-0 bg-purple-400 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                </motion.button>
              </motion.div>
            </motion.div>
            
            {/* Enhanced scroll button */}
            <motion.button 
              aria-label="Scroll Down"
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              className="mt-16 group relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="border-2 border-white/30 rounded-full p-4 flex items-center justify-center hover:border-purple-400 transition-all duration-300 group-hover:bg-white/10">
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-bounce text-purple-400"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
              <span className="block text-sm text-gray-400 mt-2 group-hover:text-purple-400 transition-colors duration-300">Scroll to explore</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Below section: white background with black text */}
      <div className="bg-white text-black min-h-screen px-6 md:px-20 py-12">
        {/* Modern Search & Filter Header */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="flex justify-center">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search for products, categories, or trends..."
              className="w-full max-w-2xl"
            />
          </div>
          
          {/* Results & Filter Toggle */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold uppercase tracking-wider">Latest Collection</h2>
              {searchQuery && (
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  "{searchQuery}" - {filteredProducts.length} results
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <p className="text-gray-600">{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}</p>
              
              {/* Mobile Filter Toggle */}
              <div className="md:hidden">
                <button
                  onClick={toggleFilters}
                  className="flex items-center gap-2 py-2 px-4 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
                >
                  {showFilters ? (
                    <>
                      <X size={16} />
                      <span>Close</span>
                    </>
                  ) : (
                    <>
                      <Filter size={16} />
                      <span>Filters</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content: Filters + Products */}
        <div className="md:flex md:gap-10">
          {/* Filters Sidebar */}
          {(!isMobile || showFilters) && (
            <aside className="md:w-72 bg-white border border-gray-300 rounded-lg p-6 text-black">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold uppercase tracking-wider">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-black underline"
                >
                  Clear all
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold mb-4 uppercase tracking-wide">Category</h4>
                <div className="space-y-3">
                  {categories.map(category => (
                    <label key={category} className="flex items-center gap-3 cursor-pointer select-none text-gray-700 hover:text-black">
                      <input
                        type="checkbox"
                        checked={selectedCategory === category}
                        onChange={() => {
                          setSelectedCategory(selectedCategory === category ? null : category);
                          setCurrentPage(1);
                        }}
                        className="accent-black w-4 h-4 cursor-pointer"
                        name="category"
                      />
                      <span className="capitalize">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="flex flex-col">
                <div>
                  <h4 className="text-sm font-semibold mb-4 uppercase tracking-wide">Price Range</h4>
                  <div className="flex justify-between text-gray-600 text-sm mb-4">
                                    <span>R{(priceRange[0] / 100).toFixed(2)}</span>
                <span>R{(priceRange[1] / 100).toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    value={priceRange[1]}
                    onChange={(e) => {
                      setPriceRange([priceRange[0], Number(e.target.value)]);
                      setCurrentPage(1);
                    }}
                    className="w-full cursor-pointer accent-black"
                  />
                </div>
                
                {/* Promotional Text - Contained within card */}
                <motion.div 
                  className="mt-8 p-8 bg-black rounded-lg border border-[#FFD700]/20 min-h-[300px] flex items-center justify-center relative overflow-hidden"
                  animate={{
                    boxShadow: [
                      '0 0 15px rgba(255, 215, 0, 0.2)',
                      '0 0 30px rgba(255, 215, 0, 0.3)',
                      '0 0 15px rgba(255, 215, 0, 0.2)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                >
                  {/* Background sparkles */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 animate-float-slow">
                      <Sparkles size={20} className="text-[#FFD700] opacity-40" />
                    </div>
                    <div className="absolute bottom-1/3 right-1/3 animate-float">
                      <Sparkles size={16} className="text-[#FFD700] opacity-40" />
                    </div>
                    <div className="absolute top-1/2 right-1/4 animate-float-delayed">
                      <Sparkles size={24} className="text-[#FFD700] opacity-40" />
                    </div>
                  </div>

                  <motion.div 
                    className="text-center space-y-6 relative z-10"
                    animate={{
                      color: colors[colorIndex],
                      textShadow: [
                        '0 0 10px rgba(255, 215, 0, 0.5)',
                        '0 0 20px rgba(255, 215, 0, 0.7)',
                        '0 0 10px rgba(255, 215, 0, 0.5)',
                      ],
                    }}
                    transition={{
                      duration: 2,
                      ease: "easeInOut",
                      repeat: Infinity,
                    }}
                  >
                    <p className="text-3xl font-bold tracking-wider">✨ SPECIAL OFFER ✨</p>
                    <p className="text-xl font-medium">Free shipping on orders over $50</p>
                    <div className="w-20 h-0.5 bg-[#FFD700] mx-auto rounded-full opacity-50"></div>
                    <p className="text-lg font-medium">Shop now and save up to 40%</p>
                    <p className="text-base opacity-80">Limited time offer</p>
                    <motion.button
                      onClick={() => navigate('/shop')}
                      className="w-16 h-16 mx-auto rounded-full border-2 border-[#FFD700] flex items-center justify-center opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-[#FFD700]/10"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ArrowRight size={24} className="text-[#FFD700] transform transition-transform duration-300 group-hover:translate-x-1" />
                    </motion.button>
                  </motion.div>
                </motion.div>
              </div>
            </aside>
          )}

          {/* Products Grid */}
          <section className="flex-1">
            {/* Initial Loading State */}
            {displayedProducts.length === 0 && isLoading ? (
              <Skeleton type="product" count={8} />
            ) : filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  <PromoCard onClick={() => navigate('/summer-sale')} />
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} onClick={handleProductClick} />
                  ))}
                </div>
                
                {/* Infinite Scroll Loading */}
                {isLoading && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                      <span className="text-gray-600">Loading more products...</span>
                    </div>
                  </div>
                )}
                
                {/* Infinite Scroll Observer */}
                <div 
                  ref={observerRef}
                  className="h-10 mt-8 flex items-center justify-center"
                >
                  {hasMore && !isLoading && (
                    <div className="text-gray-500 text-sm">
                      Scroll to load more products
                    </div>
                  )}
                  {!hasMore && filteredProducts.length > 0 && (
                    <div className="text-gray-500 text-sm">
                      You've reached the end of our collection
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 bg-transparent border border-gray-300 rounded-lg">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">No products found</h3>
                  <p className="text-gray-600 max-w-md">
                    {searchQuery 
                      ? `No products match "${searchQuery}". Try adjusting your search or filters.`
                      : "No products match your current filters. Try adjusting your preferences."
                    }
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 rounded-full bg-black text-white hover:bg-gray-900 transition-all duration-300 hover:scale-105"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default NewArrivalsPage;