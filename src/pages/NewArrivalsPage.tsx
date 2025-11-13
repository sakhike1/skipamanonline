import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFeaturedProducts } from '../data/products';
import { Product } from '../types';
import { Filter, X, ArrowRight, Sparkles, Search, TrendingUp, Users, ShoppingBag, Star, Zap, Award, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from '../components/ui/LoadingSkeleton';
import SearchBar from '../components/ui/SearchBar';

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
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-950/80 text-white backdrop-blur-2xl shadow-[0_18px_45px_-25px_rgba(15,23,42,0.85)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_70px_-25px_rgba(37,99,235,0.55)]"
      onClick={() => onClick(product.id)}
      onMouseEnter={handleImageHover}
      onMouseLeave={() => setCurrentImageIndex(0)}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-12 h-52 w-52 rounded-full bg-blue-500/20 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute -bottom-28 -left-14 h-56 w-56 rounded-full bg-purple-500/20 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_60%)]" />
      </div>

      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={product.images[currentImageIndex]}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-slate-950/80" />

        <motion.div
          className="absolute top-5 left-5 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] backdrop-blur-xl"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Drop
          <Sparkles size={14} className="text-white/60" />
        </motion.div>

        {product.images.length > 1 && (
          <div className="absolute top-5 right-5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-white/80 backdrop-blur-xl">
            {currentImageIndex + 1}/{product.images.length}
          </div>
        )}
      </div>

      <div className="relative z-10 -mt-12 px-6 pb-6">
        <div className="rounded-2xl border border-white/15 bg-white/15 p-6 backdrop-blur-2xl shadow-[0_18px_50px_-35px_rgba(37,99,235,0.65)] transition-colors duration-500 group-hover:border-white/20 group-hover:bg-white/20">
          <div className="mb-4 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
            <span>New Arrival</span>
            <span className="text-white/40">{product.category}</span>
          </div>

          <h3 className="text-2xl font-black uppercase tracking-tight text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
            {product.name}
          </h3>

          <p className="mt-3 text-sm font-medium text-white/70">
            Discover elevated streetwear with sculpted silhouettes, premium fabrics, and a finish built for the now.
          </p>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-lg font-semibold text-white/90">
              R{(product.price / 100).toFixed(2)}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick(product.id);
              }}
              className="group/button relative flex items-center gap-3 overflow-hidden rounded-full border border-white/20 bg-gradient-to-r from-white/30 via-white/20 to-white/10 py-2.5 px-5 text-sm font-semibold uppercase tracking-widest text-white/80 backdrop-blur-xl transition-all duration-500 hover:border-white/40 hover:text-white"
            >
              <span className="relative z-10">View Product</span>
              <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover/button:translate-x-1 group-hover/button:bg-white/30">
                <ArrowRight size={16} />
              </span>
              <span className="pointer-events-none absolute inset-0 translate-x-[-110%] bg-gradient-to-r from-white/40 to-white/0 transition-transform duration-500 group-hover/button:translate-x-[10%]" />
            </button>
          </div>
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
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  // Removed colorIndex for black and white theme
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const productsPerPage = 12; // Show 12 products per page
  const maxProducts = 200; // Limit to 200 products
  
  // Black and white theme - no color animation needed

  // Hero images array
  const heroImages = [
    '/images/4.jpg',
    '/images/5.jpg'
  ];

  // Initialize products
  useEffect(() => {
    const loadAllProducts = async () => {
      setIsInitialLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const allProducts = getFeaturedProducts().slice(0, maxProducts); // Limit to 200 products
      setDisplayedProducts(allProducts);
      setIsInitialLoading(false);
    };
    
    loadAllProducts();
  }, []);

  // Pagination logic
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;

  // Remove infinite scroll related code
  // const loadMoreProducts = useCallback(async () => {
  //   if (!hasMore) return;
    
  //   // Simulate API call delay
  //   await new Promise(resolve => setTimeout(resolve, 800));
    
  //   const allProducts = getFeaturedProducts();
  //   const currentLength = displayedProducts.length;
  //   const nextProducts = allProducts.slice(currentLength, currentLength + productsPerPage);
    
  //   if (nextProducts.length === 0) {
  //     setHasMore(false);
  //   } else {
  //     setDisplayedProducts(prev => [...prev, ...nextProducts]);
  //   }
  // }, [hasMore]);

  // // Infinite scroll hook
  // const { observerRef, loading: infiniteScrollLoading } = useInfiniteScroll(loadMoreProducts, hasMore);

  // Removed color animation for black and white theme

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

  // Paginated products for current page
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  const totalFilteredPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };
  
  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
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
    // Scroll to the "Latest Collection" section instead of top of page
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, priceRange]);

  // Pagination component
  const Pagination = () => {
    // Always show pagination if we have products, even if it's just one page
    if (filteredProducts.length === 0) return null;

    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      
      if (totalFilteredPages <= maxVisiblePages) {
        for (let i = 1; i <= totalFilteredPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalFilteredPages);
        } else if (currentPage >= totalFilteredPages - 2) {
          pages.push(1);
          pages.push('...');
          for (let i = totalFilteredPages - 3; i <= totalFilteredPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push('...');
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalFilteredPages);
        }
      }
      
      return pages;
    };

    return (
      <div className="flex flex-col items-center space-y-4 mt-8">
        <div className="flex justify-center items-center space-x-2">
          {/* Previous button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {/* Page numbers */}
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && handlePageChange(page)}
              disabled={page === '...'}
              className={`px-3 py-2 rounded-lg border transition-colors ${
                page === currentPage
                  ? 'bg-black text-white border-black'
                  : page === '...'
                  ? 'border-gray-300 text-gray-400 cursor-default'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalFilteredPages}
            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Hero Section: gradient bg with padding-top */}
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white pt-28 md:pt-32 px-6 md:px-20 pb-20 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-pink-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="md:flex md:items-center md:justify-between gap-12 relative z-10">
          <div className="md:w-1/2 flex justify-center md:justify-start">
            <motion.div 
              className="w-full max-w-[900px] h-[500px] overflow-hidden rounded-2xl relative shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Enhanced Black & White Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/60 z-10"></div>
              
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
                className="absolute top-6 left-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full px-4 py-2 z-20 shadow-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <span className="text-sm font-bold text-white uppercase tracking-wider">NEW</span>
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <span className="block text-white">NEW</span>
                  <span className="block bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    SPORT
                  </span>
                  <span className="block text-white">COLLECTION</span>
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
                  The brand was originally aimed at men's fashion. Starting in <span className="text-white font-semibold">1995</span> women's fashion was launched in all its dimensions: from the most urban lines to the more casual.
                </p>
                
                {/* Feature highlights */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm text-white rounded-full px-4 py-2 shadow-lg">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm font-bold text-white">Premium Quality</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm text-white rounded-full px-4 py-2 shadow-lg">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-sm font-bold text-white">Urban Style</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gradient-to-r from-pink-500/20 to-blue-500/20 backdrop-blur-sm text-white rounded-full px-4 py-2 shadow-lg">
                    <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                    <span className="text-sm font-bold text-white">Casual Comfort</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm text-white rounded-full px-4 py-2 shadow-lg">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm font-bold text-white">200 Products</span>
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
                  className="group relative overflow-hidden bg-white text-black px-8 py-4 rounded-full font-bold text-lg tracking-wide hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-white"
                >
                  <span className="relative z-10 group-hover:text-black">Shop Collection</span>
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const productsSection = document.getElementById('products-section');
                    if (productsSection) {
                      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                      // Fallback: scroll to a specific position
                      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                    }
                  }}
                  className="group relative overflow-hidden border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg tracking-wide hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm"
                >
                  <span className="relative z-10 group-hover:text-black">View Lookbook</span>
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
              <div className="border-2 border-white/30 rounded-full p-4 flex items-center justify-center hover:border-blue-400 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-blue-500/20 group-hover:to-purple-500/20">
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-bounce text-white"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
              <span className="block text-sm text-gray-400 mt-2 group-hover:text-white transition-colors duration-300">Scroll to explore</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Below section: white background with black text */}
      <div id="products-section" className="bg-white text-black min-h-screen px-6 md:px-20 py-12">
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
                  {filteredProducts.length >= maxProducts && (
                    <span className="ml-1 text-xs">(max)</span>
                  )}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <p className="text-gray-600">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                {filteredProducts.length >= maxProducts && (
                  <span className="ml-2 text-xs text-gray-400">
                    (Limit reached)
                  </span>
                )}
              </p>
              
              {totalFilteredPages > 1 && (
                <p className="text-gray-500 text-sm">
                  Page {currentPage} of {totalFilteredPages}
                </p>
              )}
              
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
                  className="mt-8 p-8 bg-gradient-to-br from-gray-900 to-black rounded-lg shadow-xl min-h-[300px] flex items-center justify-center relative overflow-hidden"
                  animate={{
                    boxShadow: [
                      '0 0 15px rgba(59, 130, 246, 0.3)',
                      '0 0 30px rgba(147, 51, 234, 0.4)',
                      '0 0 15px rgba(59, 130, 246, 0.3)',
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
                      <Sparkles size={20} className="text-white opacity-40" />
                    </div>
                    <div className="absolute bottom-1/3 right-1/3 animate-float">
                      <Sparkles size={16} className="text-white opacity-40" />
                    </div>
                    <div className="absolute top-1/2 right-1/4 animate-float-delayed">
                      <Sparkles size={24} className="text-white opacity-40" />
                    </div>
                  </div>

                  <motion.div 
                    className="text-center space-y-6 relative z-10 text-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <p className="text-3xl font-bold tracking-wider text-white">SPECIAL OFFER</p>
                    <p className="text-xl font-medium text-white">Free shipping on orders over R500</p>
                    <div className="w-20 h-0.5 bg-white mx-auto rounded-full opacity-50"></div>
                    <p className="text-lg font-medium text-white">Shop now and save up to 40%</p>
                    <p className="text-base opacity-80 text-white">Limited time offer</p>
                    <motion.button
                      onClick={() => navigate('/shop')}
                      className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110 hover:from-blue-600 hover:to-purple-700 shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ArrowRight size={24} className="text-white transform transition-transform duration-300 group-hover:translate-x-1" />
                    </motion.button>
                  </motion.div>
                </motion.div>

                {/* Mind-Blowing Additional Content Section */}
                <div className="mt-8 space-y-6">
                  {/* Animated Stats Cards */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="grid grid-cols-2 gap-3"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-4 text-white shadow-lg relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                      <div className="relative z-10">
                        <TrendingUp size={20} className="mb-2" />
                        <p className="text-2xl font-black">2.5K+</p>
                        <p className="text-xs opacity-90">Trending Now</p>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="bg-gradient-to-br from-pink-500 to-red-600 rounded-xl p-4 text-white shadow-lg relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                      <div className="relative z-10">
                        <Users size={20} className="mb-2" />
                        <p className="text-2xl font-black">10K+</p>
                        <p className="text-xs opacity-90">Happy Customers</p>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Trending Products Mini Showcase */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl p-4 border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Zap size={16} className="text-yellow-500" />
                        Trending Now
                      </h4>
                      <span className="text-xs text-gray-500">Hot</span>
                    </div>
                    <div className="space-y-3">
                      {getFeaturedProducts().slice(0, 3).map((product, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                          whileHover={{ scale: 1.02, x: 5 }}
                          onClick={() => handleProductClick(product.id)}
                          className="flex items-center gap-3 p-2 rounded-lg bg-white hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 border-gray-200 group-hover:border-black transition-colors">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-900 truncate group-hover:text-black">
                              {product.name}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              <Star size={10} className="text-yellow-400 fill-yellow-400" />
                              <span className="text-xs text-gray-600">4.8</span>
                              <span className="text-xs text-gray-400 ml-1">•</span>
                              <span className="text-xs font-bold text-gray-900">R{(product.price / 100).toFixed(0)}</span>
                            </div>
                          </div>
                          <ArrowRight size={14} className="text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Animated Countdown/Feature Banner */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="relative rounded-xl overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600"></div>
                    <div 
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '60px 60px'
                      }}
                    ></div>
                    <div className="relative p-5 text-white">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock size={18} className="animate-pulse" />
                        <span className="text-sm font-bold uppercase tracking-wider">Flash Sale</span>
                      </div>
                      <p className="text-2xl font-black mb-2">Ends Soon!</p>
                      <p className="text-xs opacity-90 mb-3">Don't miss out on amazing deals</p>
                      <motion.button
                        onClick={() => navigate('/shop')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-white text-purple-600 py-2 px-4 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingBag size={14} />
                        Shop Now
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Quality Badge Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="bg-white border-2 border-gray-200 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Award size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Premium Quality</p>
                        <p className="text-xs text-gray-600">Guaranteed</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-lg font-black text-gray-900">100%</p>
                        <p className="text-xs text-gray-600">Authentic</p>
                      </div>
                      <div className="border-l border-r border-gray-200">
                        <p className="text-lg font-black text-gray-900">24/7</p>
                        <p className="text-xs text-gray-600">Support</p>
                      </div>
                      <div>
                        <p className="text-lg font-black text-gray-900">Free</p>
                        <p className="text-xs text-gray-600">Shipping</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Video Section - Hero Video */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="relative rounded-xl overflow-hidden border-2 border-gray-200 shadow-xl group"
                  >
                    <div className="relative w-full h-[400px] bg-black">
                      <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                        poster="/images/background1.jpg"
                      >
                        <source src="/images/background.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:from-black/70 group-hover:via-black/30 group-hover:to-black/10 transition-all duration-500"></div>
                      
                      {/* Content Overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-white z-10">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 1 }}
                          className="text-center space-y-2 w-full"
                        >
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            <span className="text-xs font-bold uppercase tracking-wider">New Collection</span>
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          </div>
                          <h4 className="text-lg font-black uppercase tracking-tight">Featured Video</h4>
                          <p className="text-xs opacity-90 max-w-xs mx-auto">Discover our latest styles and trends</p>
                        </motion.div>
                      </div>

                      {/* Play Button Overlay (visible on hover) */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/30">
                          <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                        </div>
                      </div>

                      {/* Decorative Elements */}
                      <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full border border-white/20">
                        <span className="text-xs font-semibold text-white">LIVE</span>
                      </div>
                      <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full">
                        <span className="text-xs text-white">▶</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Additional Visual Element */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                    className="relative h-24 rounded-xl overflow-hidden bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 180, 360],
                        }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        className="w-20 h-20 border-4 border-white/30 rounded-full"
                      />
                      <motion.div
                        animate={{
                          scale: [1.2, 1, 1.2],
                          rotate: [360, 180, 0],
                        }}
                        transition={{
                          duration: 15,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        className="absolute w-12 h-12 border-4 border-white/50 rounded-full"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ShoppingBag size={24} className="text-white/80" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 text-center">
                      <p className="text-xs font-bold text-white drop-shadow-lg">Style Collection</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </aside>
          )}

          {/* Products Grid */}
          <section className="flex-1">
            {/* Initial Loading State */}
            {isInitialLoading ? (
              <Skeleton type="product" count={8} />
            ) : filteredProducts.length > 0 ? (
              <>
                <motion.div 
                  key={currentPage}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {paginatedProducts.map(product => (
                    <ProductCard key={product.id} product={product} onClick={handleProductClick} />
                  ))}
                </motion.div>
                
                {/* Pagination */}
                <Pagination />
                
                {/* Product limit message */}
                {filteredProducts.length >= maxProducts && (
                  <div className="mt-8 flex justify-center">
                    <div className="text-center space-y-2">
                      <div className="text-gray-500 text-sm">
                        You've reached our limit of {maxProducts} products
                      </div>
                      <div className="text-gray-400 text-xs">
                        Browse our complete collection in the main shop
                      </div>
                      <button
                        onClick={() => navigate('/shop')}
                        className="mt-2 px-4 py-2 text-sm bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                      >
                        View All Products
                      </button>
                    </div>
                  </div>
                )}
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