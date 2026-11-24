import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Search, X, Clock, TrendingUp, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
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
      <mark key={index} className="bg-[#fad0e1] text-[#211527] font-semibold px-0.5 rounded">
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
        // Do not stop the event: a click on a nav link must still go through
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
      {/* Search trigger */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="group flex w-full min-w-[12rem] items-center justify-center gap-3 rounded-full bg-[#0b0b0f] px-8 py-3 text-white ring-1 ring-white/15 transition hover:ring-white/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label="Search products"
        whileTap={{ scale: 0.97 }}
      >
        <Search size={18} className="shrink-0" aria-hidden />
        {!isOpen && <span className="hidden text-sm font-semibold md:inline">Search</span>}
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
              className="fixed inset-0 bg-[#211527]/30 z-40 cursor-pointer"
            />

            {/* Search container: flex-centred, so framer-motion's transform never fights a CSS translate */}
            <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex h-screen justify-center sm:top-4 sm:h-auto sm:px-4 md:top-16">
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className="pointer-events-auto h-full w-full max-w-2xl sm:h-auto"
              >
                <div className="relative flex h-full flex-col overflow-hidden rounded-none border border-[#211527]/10 bg-white text-[#211527] shadow-[0_30px_80px_-30px_rgba(33,21,39,0.45)] sm:max-h-[calc(100vh-2rem)] sm:rounded-[2rem] md:max-h-[85vh]">
                  {/* Header */}
                  <div className="flex shrink-0 items-center justify-between px-5 pb-1 pt-5 sm:px-6">
                    <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#211527]/60">Search products</h2>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        forceClose();
                      }}
                      className="grid h-9 w-9 place-items-center rounded-full bg-[#f3eff5] text-[#211527] ring-1 ring-[#211527]/10 transition hover:bg-[#ece5f0]"
                      aria-label="Close search"
                    >
                      <X size={18} aria-hidden />
                    </button>
                  </div>

                  {/* Input */}
                  <div className="shrink-0 px-5 pb-4 pt-3 sm:px-6">
                    <div className="flex items-center gap-2 rounded-full bg-[#f3eff5] p-1.5 ring-1 ring-[#211527]/10 transition focus-within:bg-white focus-within:ring-[#211527]/40">
                      <div className="relative flex-1">
                        {isSearching ? (
                          <Loader2 size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 animate-spin text-[#211527]/50" aria-hidden />
                        ) : (
                          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#211527]/50" aria-hidden />
                        )}
                        <input
                          ref={inputRef}
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder={placeholder}
                          className="w-full bg-transparent py-3 pl-11 pr-10 text-base font-medium text-[#211527] placeholder-[#211527]/40 outline-none focus:outline-none focus-visible:outline-none"
                          autoFocus
                          aria-label="Search input"
                          style={{ outline: 'none', boxShadow: 'none' }}
                          aria-describedby="search-hint"
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => {
                              setSearchQuery('');
                              setSelectedIndex(-1);
                              if (inputRef.current) {
                                inputRef.current.focus();
                              }
                            }}
                            className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-[#f3eff5] transition hover:bg-[#ece5f0]"
                            aria-label="Clear search"
                          >
                            <X size={14} aria-hidden />
                          </button>
                        )}
                      </div>

                      {/* Search button */}
                      <button
                        type="button"
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
                        className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#211527] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#33203f] disabled:cursor-not-allowed disabled:bg-[#f3eff5] disabled:text-[#211527]/40"
                      >
                        <span className="hidden sm:inline">Search</span>
                        <ArrowRight size={16} aria-hidden />
                      </button>
                    </div>

                    {/* Search hint */}
                    <p id="search-hint" className="mt-2.5 hidden text-xs text-[#211527]/40 sm:block">
                      <kbd className="rounded bg-[#f3eff5] px-1.5 py-0.5 text-[10px]">↑</kbd>{' '}
                      <kbd className="rounded bg-[#f3eff5] px-1.5 py-0.5 text-[10px]">↓</kbd> to navigate,{' '}
                      <kbd className="rounded bg-[#f3eff5] px-1.5 py-0.5 text-[10px]">Enter</kbd> to select,{' '}
                      <kbd className="rounded bg-[#f3eff5] px-1.5 py-0.5 text-[10px]">Esc</kbd> to close
                    </p>
                  </div>
                  <div aria-hidden className="h-px shrink-0 bg-[#f3eff5]" />

                {/* Content Section */}
                <div className="flex-1 overflow-y-auto max-h-[calc(100vh-180px)] sm:max-h-[calc(90vh-200px)] md:max-h-[60vh]">
                  {/* Search Results */}
                  {searchQuery && (
                    <>
                      {isSearching ? (
                        <div className="p-6 sm:p-8 text-center">
                          <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-4 text-[#211527]/60 animate-spin" />
                          <p className="text-sm text-[#211527]/60">Searching...</p>
                        </div>
                      ) : results.length > 0 ? (
                        <div className="p-3 sm:p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Sparkles size={14} className="sm:w-4 sm:h-4 text-[#211527]/60" />
                              <h3 className="font-bold text-[#211527] text-xs sm:text-sm uppercase tracking-wider">
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
                                className="text-xs text-[#211527]/60 hover:text-[#211527] transition-colors"
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
                                  transition-all group border
                                  ${selectedIndex === index 
                                    ? 'bg-[#f3eff5] border-[#211527]/30' 
                                    : 'bg-[#f3eff5] hover:bg-[#ece5f0] border-[#211527]/5 hover:border-[#211527]/20'
                                  }`}
                                onMouseEnter={() => setSelectedIndex(index)}
                              >
                                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden bg-[#f3eff5] border border-[#211527]/10 flex-shrink-0">
                                  <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    loading="lazy"
                                  />
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                  <h4 className="font-bold text-[#211527] truncate group-hover:text-[#211527] transition-colors text-sm sm:text-base">
                                    {highlightText(product.name, searchQuery)}
                                  </h4>
                                  <p className="text-xs sm:text-sm text-[#211527]/60 mt-0.5 sm:mt-1">
                                    {highlightText(product.category, searchQuery)}
                                  </p>
                                  <p className="text-base sm:text-lg font-black text-[#211527] mt-1.5 sm:mt-2">
                                    R{(product.price / 100).toFixed(2)}
                                  </p>
                                </div>
                                <ArrowRight 
                                  size={16} 
                                  className={`sm:w-[18px] sm:h-[18px] transition-all flex-shrink-0 ${
                                    selectedIndex === index 
                                      ? 'text-[#211527] translate-x-1' 
                                      : 'text-[#211527]/50 group-hover:text-[#211527] group-hover:translate-x-1'
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
                          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-[#f3eff5] border border-[#211527]/15 flex items-center justify-center">
                            <Search size={20} className="sm:w-6 sm:h-6 text-[#211527]/60" />
                          </div>
                          <p className="font-bold text-[#211527] text-base sm:text-lg mb-2">No products found</p>
                          <p className="text-xs sm:text-sm text-[#211527]/60 mb-4">Try a different search term or browse categories</p>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {popularCategories.slice(0, 3).map((category) => (
                              <button
                                key={category}
                                onClick={() => handleCategoryClick(category)}
                                className="px-3 py-1.5 bg-[#f3eff5] hover:bg-[#ece5f0] rounded-lg text-xs text-[#211527]/70 hover:text-[#211527] transition-all border border-[#211527]/10"
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
                              <Clock size={14} className="sm:w-4 sm:h-4 text-[#211527]/60" />
                              <h3 className="font-bold text-[#211527] text-xs sm:text-sm uppercase tracking-wider">
                                Recent Searches
                              </h3>
                            </div>
                            <motion.button
                              onClick={handleClearRecent}
                              className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-bold text-[#211527]/70 hover:text-[#211527] 
                                hover:bg-[#ece5f0] rounded-lg transition-all border border-[#211527]/10"
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
                                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#f3eff5] hover:bg-[#ece5f0] hover:text-[#211527]
                                  rounded-full text-xs sm:text-sm font-bold text-[#211527] transition-all duration-300
                                  border border-[#211527]/10 hover:border-[#211527]/20 backdrop-blur"
                              >
                                {search}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Popular categories */}
                      <div>
                        <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#211527]/50">
                          <TrendingUp size={14} aria-hidden />
                          Popular categories
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {popularCategories.map((category) => (
                            <button
                              key={category}
                              type="button"
                              onClick={() => handleCategoryClick(category)}
                              className="group inline-flex items-center gap-2 rounded-full bg-[#f3eff5] px-4 py-2.5 text-sm font-medium text-[#211527] ring-1 ring-[#211527]/10 transition hover:bg-[#211527] hover:text-white"
                            >
                              {category}
                              <ArrowRight size={14} className="opacity-50 transition group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Quick actions */}
                      <div className="grid gap-2 border-t border-[#211527]/10 pt-5 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsOpen(false);
                            navigate('/shop');
                          }}
                          className="rounded-full bg-[#211527] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#33203f]"
                        >
                          Browse all products
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsOpen(false);
                            navigate('/new-arrivals');
                          }}
                          className="rounded-full px-5 py-3 text-sm font-semibold text-[#211527] ring-1 ring-[#211527]/20 transition hover:bg-[#ece5f0]"
                        >
                          New arrivals
                        </button>
                      </div>
                        </div>
                      )}
                </div>
                    </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
