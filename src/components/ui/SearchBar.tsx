import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Search, X, Clock, TrendingUp, Sparkles, ArrowRight, ArrowLeft, Loader2, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProductData } from '../../context/ProductDataContext';
import { Product } from '../../types';
import { debounce } from '../../utils/performanceOptimizer';

interface SearchBarProps {
  onProductClick?: (productId: string) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

// Highlight matching text in search results
const highlightText = (text: string, query: string): React.ReactNode => {
  if (!query.trim()) return text;
  
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, index) => 
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={index} className="bg-white/20 text-white font-semibold px-0.5 rounded">
        {part}
      </mark>
    ) : (
      part
    )
  );
};

const SearchBar: React.FC<SearchBarProps> = ({ 
  onProductClick, 
  onSearch, 
  placeholder = 'Search products...',
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Force close function that can be called from anywhere
  const forceClose = useCallback(() => {
    setIsOpen(false);
    setSearchQuery('');
    setSelectedIndex(-1);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularCategories] = useState(['T-Shirts', 'Hoodies', 'Graphic Tees', 'Minimalist', 'Vintage']);
  const { products } = useProductData();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  // Improved search function with scoring
  const performSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    // Use requestAnimationFrame for smoother UI
    requestAnimationFrame(() => {
      const searchTerms = query.toLowerCase().trim().split(/\s+/).filter(term => term.length > 0);
      const scoredResults: Array<{ product: Product; score: number }> = [];

      products.forEach(product => {
        let score = 0;
        const productName = product.name.toLowerCase();
        const productDescription = product.description?.toLowerCase() || '';
        const productCategory = product.category.toLowerCase();
        const productTags = product.tags?.map(tag => tag.toLowerCase()) || [];

        searchTerms.forEach(term => {
          // Exact name match (highest priority)
          if (productName === term) {
            score += 100;
          } else if (productName.startsWith(term)) {
            score += 50;
          } else if (productName.includes(term)) {
            score += 30;
          }

          // Category match
          if (productCategory.includes(term)) {
            score += 20;
          }

          // Tag match
          productTags.forEach(tag => {
            if (tag === term) {
              score += 25;
            } else if (tag.includes(term)) {
              score += 15;
            }
          });

          // Description match (lower priority)
          if (productDescription.includes(term)) {
            score += 10;
          }
        });

        if (score > 0) {
          scoredResults.push({ product, score });
        }
      });

      // Sort by score and take top 8 results
      const sortedResults = scoredResults
        .sort((a, b) => b.score - a.score)
        .slice(0, 8)
        .map(item => item.product);

      setResults(sortedResults);
      setIsSearching(false);
      setSelectedIndex(-1);
    });
  }, [products]);

  // Debounced search
  const debouncedSearch = useMemo(
    () => {
      const searchFn = (...args: unknown[]) => {
        const query = args[0] as string;
        performSearch(query);
      };
      return debounce(searchFn, 300) as (query: string) => void;
    },
    [performSearch]
  );

  // Handle search query changes
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setIsSearching(true);
      debouncedSearch(searchQuery);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  }, [searchQuery, debouncedSearch]);

  // Save recent searches
  const saveRecentSearch = useCallback((query: string) => {
    if (!query.trim()) return;
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent_searches', JSON.stringify(updated));
  }, [recentSearches]);

  // Close on outside click and scroll
  useEffect(() => {
    if (!isOpen) return;

    const closeSearch = () => {
      forceClose();
    };

    // Use a ref to track if we should ignore the next click (when opening)
    let ignoreNextClick = true;
    const ignoreTimeout = setTimeout(() => {
      ignoreNextClick = false;
    }, 150);

    const handleClickOutside = (event: MouseEvent) => {
      if (ignoreNextClick) return;
      
      const target = event.target as Node;
      // Close if click is outside the search modal
      if (searchRef.current && !searchRef.current.contains(target)) {
        event.stopPropagation();
        closeSearch();
      }
    };

    // Handle mouse wheel scroll - close immediately when scrolling
    const handleWheel = () => {
      if (!ignoreNextClick) {
        closeSearch();
      }
    };

    // Handle scroll events
    const handleScroll = () => {
      if (!ignoreNextClick) {
        closeSearch();
      }
    };

    // Click outside detection
    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('click', handleClickOutside, true);
    
    // Also close on route change
    const handleRouteChange = () => {
      closeSearch();
    };
    window.addEventListener('popstate', handleRouteChange);
    
    // Mouse wheel scroll - close immediately
    window.addEventListener('wheel', handleWheel, { passive: true });
    
    // Handle scroll events
    window.addEventListener('scroll', handleScroll, true);
    document.addEventListener('scroll', handleScroll, true);
    
    return () => {
      clearTimeout(ignoreTimeout);
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('click', handleClickOutside, true);
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll, true);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, forceClose]);

  // Keyboard shortcut (⌘K / Ctrl+K) and Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
        setSearchQuery('');
        setSelectedIndex(-1);
        if (inputRef.current) {
          inputRef.current.blur();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close search on route change
  useEffect(() => {
    setIsOpen(false);
    setSearchQuery('');
    setSelectedIndex(-1);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  }, [location.pathname]);

  // Close search on unmount
  useEffect(() => {
    return () => {
      setIsOpen(false);
      setSearchQuery('');
      setSelectedIndex(-1);
    };
  }, []);

  // Scroll selected result into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultRefs.current[selectedIndex]) {
      resultRefs.current[selectedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedIndex]);

  const handleProductClick = useCallback((productId: string) => {
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery);
    }
    setSearchQuery('');
    setSelectedIndex(-1);
    setIsOpen(false);
    if (inputRef.current) {
      inputRef.current.blur();
    }
    if (onProductClick) {
      onProductClick(productId);
    } else {
      navigate(`/product/${productId}`);
    }
  }, [onProductClick, navigate, searchQuery, saveRecentSearch]);

  const handleCategoryClick = useCallback((category: string) => {
    setSearchQuery(category);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleRecentSearchClick = useCallback((query: string) => {
    setSearchQuery(query);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery('');
      setSelectedIndex(-1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleProductClick(results[selectedIndex].id);
      } else if (searchQuery.trim()) {
        saveRecentSearch(searchQuery);
        if (onSearch) {
          onSearch(searchQuery);
        } else {
          navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
        setIsOpen(false);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < results.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    }
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent_searches');
  };

  // Get total match count (for display)
  const totalMatches = useMemo(() => {
    if (!searchQuery.trim()) return 0;
    // This is approximate - actual count would require full search
    return results.length;
  }, [searchQuery, results.length]);

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Modern Search Button */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="group relative flex items-center gap-2 px-4 py-2 rounded-full 
          bg-gradient-to-r from-black via-gray-900 to-black text-white hover:from-gray-800 hover:via-gray-900 hover:to-gray-800
          transition-all duration-300 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.8)] hover:shadow-[0_25px_70px_-28px_rgba(255,255,255,0.1)]
          border border-white/10 hover:border-white/20
          overflow-hidden backdrop-blur"
        aria-label="Search products"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Animated shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
          animate={{ 
            x: ['-100%', '100%'],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatDelay: 1,
            ease: "linear"
          }}
        />
        
        {/* Subtle glow on hover */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 blur-xl"
          transition={{ duration: 0.3 }}
        />
        
        <Search size={18} className="relative z-10 text-white font-bold" />
        {!isOpen && (
          <span className="hidden md:inline text-sm font-black text-white relative z-10 tracking-tight">
            Search
          </span>
        )}
        {!isOpen && (
          <span className="hidden lg:inline text-xs text-white/80 relative z-10 ml-1.5 font-bold bg-white/10 backdrop-blur-sm px-2 py-1 rounded-md border border-white/20 flex items-center gap-1">
            <Command size={10} className="text-white/80" />
            <span>K</span>
          </span>
        )}
      </motion.button>

      {/* Modern Search Modal */}
        <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                forceClose();
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                forceClose();
              }}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 cursor-pointer"
            />

            {/* Search Container */}
              <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              className="fixed top-0 sm:top-4 md:top-16 left-0 right-0 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 
                w-full sm:w-[calc(100%-2rem)] md:w-full max-w-2xl z-50 sm:px-2 md:px-4 h-screen sm:h-auto"
            >
              <div className="relative bg-[#0b0b0f] backdrop-blur-none rounded-none sm:rounded-2xl md:rounded-3xl shadow-[0_24px_80px_-32px_rgba(0,0,0,0.9)] border border-white/10 border-[0.5px]
                overflow-hidden h-full sm:max-h-[calc(100vh-2rem)] md:max-h-[90vh] flex flex-col text-white">
                {/* Header with Close Button */}
                <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200/20 flex-shrink-0">
                  <motion.button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      forceClose();
                    }}
                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white/5 hover:bg-white/10 text-white
                      rounded-xl font-black transition-all duration-300
                      border border-white/5 hover:border-white/30
                      shadow-[0_10px_30px_-18px_rgba(255,255,255,0.5)] text-xs sm:text-sm backdrop-blur"
                    whileHover={{ scale: 1.05, x: -2 }}
                    whileTap={{ scale: 0.95 }}
                  aria-label="Close search"
                >
                    <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px] text-white font-bold" />
                    <span className="font-black text-white hidden xs:inline">Back</span>
                  </motion.button>
                  
                  <h2 className="text-base sm:text-lg md:text-xl font-black text-white uppercase tracking-[0.2em] px-2">
                    <span className="hidden sm:inline">Search Products</span>
                    <span className="sm:hidden">Search</span>
                  </h2>
                  
                  <motion.button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      forceClose();
                    }}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 hover:bg-white/15
                      flex items-center justify-center transition-all duration-300 backdrop-blur
                      border border-white/5 hover:border-white/30
                      shadow-[0_10px_35px_-20px_rgba(255,255,255,0.5)]"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Close search"
                  >
                    <X size={18} className="sm:w-5 sm:h-5 text-white font-bold transition-colors" />
                  </motion.button>
                </div>

                {/* Search Input Section */}
                <div className="relative p-3 sm:p-4 border-b border-gray-200/20 flex-shrink-0">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                    <div className="relative flex-1">
                      {isSearching ? (
                        <Loader2 
                          size={16} 
                          className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/50 sm:w-[18px] sm:h-[18px] animate-spin" 
                        />
                      ) : (
                        <Search 
                          size={16} 
                          className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/50 sm:w-[18px] sm:h-[18px]" 
                        />
                      )}
                  <input
                    ref={inputRef}
                    type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                        className="w-full pl-9 sm:pl-12 pr-9 sm:pr-12 py-2 sm:py-2.5 md:py-3 bg-[#0f111a]/80 rounded-lg sm:rounded-xl 
                          border-none focus:ring-0 focus:outline-none focus:bg-black/60
                          outline-none text-white placeholder-white/50
                          text-sm sm:text-base md:text-base font-medium transition-all duration-300"
                        autoFocus
                        aria-label="Search input"
                        aria-describedby="search-hint"
                      />
                      {searchQuery && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedIndex(-1);
                          if (inputRef.current) {
                            inputRef.current.focus();
                          }
                        }}
                          className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2
                            w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20
                            flex items-center justify-center transition-colors border border-white/10 backdrop-blur"
                          aria-label="Clear search"
                        >
                          <X size={14} className="sm:w-4 sm:h-4 text-white" />
                        </motion.button>
                      )}
                    </div>

                    {/* Search Button */}
                    <motion.button
                      onClick={() => {
                        if (searchQuery.trim()) {
                          saveRecentSearch(searchQuery);
                          if (onSearch) {
                            onSearch(searchQuery);
                          } else {
                            navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
                          }
                          setIsOpen(false);
                          setSearchQuery('');
                          setSelectedIndex(-1);
                          if (inputRef.current) {
                            inputRef.current.blur();
                          }
                        }
                      }}
                      disabled={!searchQuery.trim()}
                      className="px-4 sm:px-6 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-black via-gray-900 to-black text-white rounded-xl sm:rounded-2xl font-black
                        hover:from-white hover:via-gray-100 hover:to-gray-300 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed
                        active:from-gray-300 active:via-gray-400 active:to-white active:text-black
                        transition-all flex items-center gap-2 shadow-[0_18px_45px_-20px_rgba(0,0,0,0.8)] hover:shadow-[0_22px_55px_-22px_rgba(0,0,0,0.9)]
                        w-full sm:w-auto sm:min-w-[100px] md:min-w-[120px] justify-center text-sm sm:text-base"
                      whileHover={{ scale: searchQuery.trim() ? 1.05 : 1 }}
                      whileTap={{ scale: searchQuery.trim() ? 0.95 : 1 }}
                    >
                      <span className="text-current font-black">Search</span>
                      <ArrowRight size={16} className="text-current font-bold sm:hidden" />
                      <ArrowRight size={18} className="text-current font-bold hidden sm:block" />
                    </motion.button>
                </div>
                
                {/* Search Hint */}
                <div id="search-hint" className="px-3 sm:px-4 pb-2 text-xs text-white/40 hidden sm:block">
                  Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">↓</kbd> to navigate, <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">Enter</kbd> to select, <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">Esc</kbd> to close
                </div>
              </div>

                {/* Content Section */}
                <div className="flex-1 overflow-y-auto max-h-[calc(100vh-180px)] sm:max-h-[calc(90vh-200px)] md:max-h-[60vh]">
                  {/* Search Results */}
                  {searchQuery && (
                    <>
                      {isSearching ? (
                        <div className="p-6 sm:p-8 text-center">
                          <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-4 text-white/60 animate-spin" />
                          <p className="text-sm text-white/60">Searching...</p>
                        </div>
                      ) : results.length > 0 ? (
                        <div className="p-3 sm:p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Sparkles size={14} className="sm:w-4 sm:h-4 text-white/60" />
                              <h3 className="font-bold text-white text-xs sm:text-sm uppercase tracking-wider">
                                Results ({results.length}{totalMatches > results.length ? ` of ${totalMatches}+` : ''})
                              </h3>
                            </div>
                            {results.length >= 8 && (
                              <button
                                onClick={() => {
                                  saveRecentSearch(searchQuery);
                                  navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                                  setIsOpen(false);
                                }}
                                className="text-xs text-white/60 hover:text-white transition-colors"
                              >
                                View all →
                              </button>
                            )}
                          </div>
                          <div className="space-y-2">
                            {results.map((product, index) => (
                              <motion.button
                                key={product.id}
                                ref={(el) => { resultRefs.current[index] = el; }}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.03 }}
                                onClick={() => handleProductClick(product.id)}
                                className={`w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl 
                                  transition-all group border shadow-[0_10px_35px_-24px_rgba(255,255,255,0.7)]
                                  ${selectedIndex === index 
                                    ? 'bg-white/15 border-white/30' 
                                    : 'bg-white/5 hover:bg-white/10 border-white/5 hover:border-white/20'
                                  }`}
                                onMouseEnter={() => setSelectedIndex(index)}
                              >
                                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden bg-white/10 border border-white/10 flex-shrink-0">
                                  <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    loading="lazy"
                                  />
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                  <h4 className="font-bold text-white truncate group-hover:text-white transition-colors text-sm sm:text-base">
                                    {highlightText(product.name, searchQuery)}
                                  </h4>
                                  <p className="text-xs sm:text-sm text-white/60 mt-0.5 sm:mt-1">
                                    {highlightText(product.category, searchQuery)}
                                  </p>
                                  <p className="text-base sm:text-lg font-black text-white mt-1.5 sm:mt-2">
                                    R{(product.price / 100).toFixed(2)}
                                  </p>
                                </div>
                                <ArrowRight 
                                  size={16} 
                                  className={`sm:w-[18px] sm:h-[18px] transition-all flex-shrink-0 ${
                                    selectedIndex === index 
                                      ? 'text-white translate-x-1' 
                                      : 'text-white/50 group-hover:text-white group-hover:translate-x-1'
                                  }`}
                                />
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="p-6 sm:p-8 text-center"
                        >
                          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
                            <Search size={20} className="sm:w-6 sm:h-6 text-white/60" />
                          </div>
                          <p className="font-bold text-white text-base sm:text-lg mb-2">No products found</p>
                          <p className="text-xs sm:text-sm text-white/60 mb-4">Try a different search term or browse categories</p>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {popularCategories.slice(0, 3).map((category) => (
                              <button
                                key={category}
                                onClick={() => handleCategoryClick(category)}
                                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-white/70 hover:text-white transition-all border border-white/10"
                              >
                                {category}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </>
                  )}

                  {/* Empty State - Show Suggestions */}
                  {!searchQuery && (
                    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
                      {/* Recent Searches */}
                      {recentSearches.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Clock size={14} className="sm:w-4 sm:h-4 text-white/60" />
                              <h3 className="font-bold text-white text-xs sm:text-sm uppercase tracking-wider">
                                Recent Searches
                              </h3>
                            </div>
                            <motion.button
                              onClick={handleClearRecent}
                              className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-bold text-white/70 hover:text-white 
                                hover:bg-white/10 rounded-lg transition-all border border-white/10"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Clear
                            </motion.button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {recentSearches.map((search, index) => (
                              <motion.button
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => handleRecentSearchClick(search)}
                                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 hover:bg-white/10 hover:text-white
                                  rounded-full text-xs sm:text-sm font-bold text-white transition-all duration-300
                                  border border-white/10 hover:border-white/20 backdrop-blur"
                              >
                                {search}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Popular Categories */}
                      <div>
                        <div className="flex items-center gap-2 sm:gap-2.5 mb-4 sm:mb-5">
                          <div className="p-1 sm:p-1.5 bg-gradient-to-br from-white/10 to-white/5 rounded-lg border border-white/10">
                            <TrendingUp size={14} className="sm:w-4 sm:h-4 text-white/70" />
                          </div>
                          <h3 className="font-black text-white text-xs sm:text-sm uppercase tracking-wider">
                            Popular Categories
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-3">
                          {popularCategories.map((category, index) => (
                            <motion.button
                              key={category}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() => handleCategoryClick(category)}
                              className="p-3 sm:p-4 md:p-5 bg-gradient-to-br from-white/5 via-white/5 to-white/5 hover:from-white/10 hover:to-white/10
                                rounded-xl sm:rounded-2xl text-left font-black text-white transition-all duration-300
                                border border-white/5 hover:border-white/20
                                shadow-[0_12px_40px_-24px_rgba(255,255,255,0.8)] hover:shadow-[0_18px_50px_-22px_rgba(255,255,255,0.9)]
                                group relative overflow-hidden"
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {/* Shimmer effect */}
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                              />
                              <div className="flex items-center justify-between relative z-10">
                                <span className="text-white group-hover:text-white text-sm sm:text-base font-black truncate pr-2">{category}</span>
                                <ArrowRight 
                                  size={16} 
                                  className="sm:w-[18px] sm:h-[18px] text-white/50 group-hover:text-white 
                                    group-hover:translate-x-1 transition-all flex-shrink-0" 
                                />
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="pt-4 sm:pt-6 border-t border-gray-200/30">
                        <p className="text-xs text-white/60 mb-3 sm:mb-4 uppercase tracking-wider font-black">
                          Quick Actions
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                          <motion.button
                            onClick={() => {
                              setIsOpen(false);
                              navigate('/shop');
                            }}
                            className="flex-1 px-4 sm:px-5 py-3 sm:py-4 bg-white text-black rounded-xl sm:rounded-2xl 
                              font-black hover:bg-white/90 hover:text-black transition-all text-xs sm:text-sm
                              border border-black/10 hover:border-black/20
                              shadow-[0_20px_55px_-24px_rgba(0,0,0,0.25)] hover:shadow-[0_24px_60px_-22px_rgba(0,0,0,0.45)] relative overflow-hidden group"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {/* Shimmer effect */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                              animate={{ x: ['-100%', '100%'] }}
                              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                            />
                            <span className="relative z-10 text-black font-black">Browse All Products</span>
                          </motion.button>
                          <motion.button
                            onClick={() => {
                              setIsOpen(false);
                              navigate('/new-arrivals');
                            }}
                            className="flex-1 px-4 sm:px-5 py-3 sm:py-4 bg-white/5 text-white rounded-xl sm:rounded-2xl 
                              font-black hover:bg-white/10 transition-all text-xs sm:text-sm 
                              border border-white/15 shadow-[0_20px_55px_-24px_rgba(255,255,255,0.6)] hover:shadow-[0_24px_60px_-22px_rgba(255,255,255,0.5)] relative overflow-hidden group backdrop-blur"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {/* Shimmer effect */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent"
                              animate={{ x: ['-100%', '100%'] }}
                              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                            />
                            <span className="relative z-10 text-white font-black">New Arrivals</span>
                          </motion.button>
                        </div>
                      </div>
                        </div>
                      )}
                </div>
                    </div>
                </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
