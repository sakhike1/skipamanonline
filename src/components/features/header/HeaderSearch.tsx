import React, { useCallback, useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchUI } from './hooks/useSearchUI';
import { Product } from '../../../types';
import { useProductData } from '../../../context/ProductDataContext';

interface HeaderSearchProps {
  isAuthenticated: boolean;
  isScrolled: boolean;
  hotProducts: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

export const HeaderSearch: React.FC<HeaderSearchProps> = ({
  isAuthenticated,
  isScrolled,
  hotProducts,
  searchQuery,
  setSearchQuery,
  onSearch
}) => {
  const navigate = useNavigate();
  const {
    showSearchDropdown,
    setShowSearchDropdown,
    isSearchFocused,
    searchInputRef,
    searchContainerRef,
    handleSearchFocus,
    handleSearchBlur,
    handleMouseMove,
    handleMouseLeave
  } = useSearchUI();
  const { searchProducts } = useProductData();
  
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Generate search suggestions based on query
  const suggestions = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) {
      return hotProducts.slice(0, 5);
    }
    
    // Get search results and limit to 5
    return searchProducts(searchQuery.trim()).slice(0, 5);
  }, [searchQuery, hotProducts, searchProducts]);
  
  // Update suggestions with debouncing
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      setSearchSuggestions(suggestions);
    }, 150);
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [suggestions]);
  
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim()) {
      setShowSearchDropdown(true);
    }
  }, [setSearchQuery, setShowSearchDropdown]);
  
  const handleSuggestionClick = useCallback((productId: string) => {
    navigate(`/product/${productId}`);
    setSearchQuery('');
    setShowSearchDropdown(false);
  }, [navigate, setSearchQuery, setShowSearchDropdown]);
  
  const handleQuickSearch = useCallback((query: string) => {
    setSearchQuery(query);
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setShowSearchDropdown(false);
  }, [setSearchQuery, navigate, setShowSearchDropdown]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="relative hidden sm:block">
      <form onSubmit={onSearch}>
        <motion.div
          ref={searchContainerRef}
          initial={false}
          animate={{
            width: isSearchFocused ? (window.innerWidth < 1024 ? 200 : 280) : 48,
            scale: isSearchFocused ? 1.02 : 1
          }}
          className="relative group"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Glow effect on focus */}
          <div className={`
            absolute inset-0 rounded-full blur-xl transition-all duration-500
            ${isSearchFocused
              ? 'bg-gradient-to-r from-yellow-400/30 via-orange-400/20 to-pink-400/30'
              : 'bg-transparent'
            }
          `} />

          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            placeholder={isSearchFocused ? "Search products..." : ""}
            className={`
              relative w-full px-3 py-1 lg:py-1.5 rounded-full
              ${isSearchFocused
                ? 'bg-white/25 backdrop-blur-xl border-white/40 shadow-lg shadow-white/10'
                : 'bg-black/15 backdrop-blur-md border-white/15 hover:bg-black/20'
              }
              ${isScrolled ? 'text-black placeholder-black/70' : 'text-white placeholder-white/70'}
              border
              focus:outline-none focus:ring-1 focus:ring-yellow-400/50 focus:border-yellow-400/50
              shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]
              transition-all duration-500 ease-out
              text-sm font-medium
              group-hover:border-white/30
            `}
            aria-label="Search products"
          />

          {/* Search icon with animation */}
          <motion.button
            type="button"
            onClick={() => searchInputRef.current?.focus()}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-white/10 transition-all duration-300 cursor-pointer z-10"
            animate={{
              opacity: isSearchFocused ? 0 : 1,
              scale: isSearchFocused ? 0.8 : 1,
              x: isSearchFocused ? -10 : 0
            }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Search
              size={18}
              className={`
                ${isScrolled ? 'text-black/70' : 'text-white/70'}
                transition-colors duration-300
              `}
            />
          </motion.button>

          {/* Submit button */}
          <motion.button
            type="submit"
            className={`
              absolute right-2 top-1/2 -translate-y-1/2 p-2
              rounded-full transition-all duration-300
              ${isSearchFocused
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg shadow-yellow-400/30'
                : `${isScrolled ? 'text-black/70 hover:text-black' : 'text-white/70 hover:text-white'} hover:bg-white/20`
              }
              backdrop-blur-sm
              hover:scale-110
              active:scale-95
            `}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Submit search"
          >
            <Search size={16} />
          </motion.button>

          {/* Loading indicator */}
          {isSearchFocused && searchQuery && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-12 top-1/2 -translate-y-1/2"
            >
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </motion.div>
          )}
        </motion.div>
      </form>

      {/* Search Dropdown with suggestions */}
      <AnimatePresence>
        {showSearchDropdown && (isSearchFocused || searchQuery) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-80 md:w-96 bg-white/95 backdrop-blur-xl rounded-xl overflow-hidden z-[100] border border-gray-200 shadow-2xl"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative max-h-96 overflow-y-auto">
              {searchQuery && searchQuery.trim() ? (
                // Search results
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-800">
                      Search Results
                    </h3>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setShowSearchDropdown(false);
                      }}
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                      aria-label="Close search"
                    >
                      <X size={16} className="text-gray-600" />
                    </button>
                  </div>
                  
                  {searchSuggestions.length > 0 ? (
                    <div className="space-y-2">
                      {searchSuggestions.map((product) => (
                        <motion.div
                          key={product.id}
                          whileHover={{ scale: 1.01, x: 4 }}
                          className="group cursor-pointer"
                          onClick={() => handleSuggestionClick(product.id)}
                        >
                          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200">
                            <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                              <img
                                src={product.images?.[0] || '/images/placeholder.png'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/images/placeholder.png';
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium truncate text-gray-800">
                                {product.name}
                              </h4>
                              <p className="text-xs text-gray-600">
                                R{(product.price / 100).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      <button
                        onClick={() => handleQuickSearch(searchQuery)}
                        className="w-full mt-2 py-2 px-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                      >
                        View all results
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-600">
                        No products found
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                // Hot products / default view
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="relative">
                      <TrendingUp size={18} className="text-gray-800" />
                      <Sparkles size={12} className="absolute -top-1 -right-1 text-yellow-500 animate-pulse" />
                    </div>
                    <h3 className="font-medium text-gray-800">
                      Popular Products
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {hotProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        whileHover={{ scale: 1.01, x: 4 }}
                        className="group cursor-pointer"
                        onClick={() => handleSuggestionClick(product.id)}
                      >
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200">
                          <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                            <img
                              src={product.images?.[0] || '/images/placeholder.png'}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              loading="lazy"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/images/placeholder.png';
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium truncate text-gray-800">
                              {product.name}
                            </h4>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-gray-800">
                                R{(product.price / 100).toFixed(2)}
                              </p>
                              <span className="text-xs font-medium bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 px-2 py-0.5 rounded-full">
                                Hot
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

