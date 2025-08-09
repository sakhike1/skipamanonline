import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, X, Filter, Sparkles, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '../../data/products';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange?: (filters: any) => void;
  placeholder?: string;
  className?: string;
}

interface SearchSuggestion {
  id: string;
  name: string;
  category: string;
  type: 'product' | 'category' | 'trending';
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  onFilterChange, 
  placeholder = "Search products, categories, or trends...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches] = useState([
    'Sport Collection', 'Urban Style', 'Premium Quality', 'New Arrivals'
  ]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Generate search suggestions
  const generateSuggestions = (searchQuery: string): SearchSuggestion[] => {
    if (!searchQuery.trim()) {
      return [
        ...trendingSearches.map(term => ({
          id: `trending-${term}`,
          name: term,
          category: 'Trending',
          type: 'trending' as const
        })),
        ...recentSearches.slice(0, 3).map(term => ({
          id: `recent-${term}`,
          name: term,
          category: 'Recent',
          type: 'trending' as const
        }))
      ];
    }

    const results: SearchSuggestion[] = [];
    const queryLower = searchQuery.toLowerCase();

    // Product matches
    products.forEach(product => {
      if (product.name.toLowerCase().includes(queryLower) ||
          product.category.toLowerCase().includes(queryLower)) {
        results.push({
          id: product.id,
          name: product.name,
          category: product.category,
          type: 'product'
        });
      }
    });

    // Category matches
    const categories = [...new Set(products.map(p => p.category))];
    categories.forEach(category => {
      if (category.toLowerCase().includes(queryLower)) {
        results.push({
          id: `category-${category}`,
          name: category,
          category: 'Category',
          type: 'category'
        });
      }
    });

    return results.slice(0, 8);
  };

  // Handle search input changes
  const handleInputChange = (value: string) => {
    setQuery(value);
    const newSuggestions = generateSuggestions(value);
    setSuggestions(newSuggestions);
    setShowSuggestions(true);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.name);
    setShowSuggestions(false);
    
    // Add to recent searches
    const updated = [suggestion.name, ...recentSearches.filter(s => s !== suggestion.name)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    
    onSearch(suggestion.name);
  };

  // Handle search submission
  const handleSearch = () => {
    if (query.trim()) {
      setShowSuggestions(false);
      onSearch(query.trim());
      
      // Add to recent searches
      const updated = [query.trim(), ...recentSearches.filter(s => s !== query.trim())].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    }
  };

  // Voice search functionality
  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window) {
      setIsListening(true);
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        handleInputChange(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Voice search is not supported in this browser');
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full max-w-2xl ${className}`} ref={suggestionsRef}>
      {/* Search Input */}
      <div className="relative group">
        {/* Glow effect on focus */}
        <div className="absolute inset-0 rounded-2xl blur-xl transition-all duration-500 opacity-0 group-focus-within:opacity-100 bg-gradient-to-r from-yellow-400/20 via-orange-400/15 to-pink-400/20"></div>
        
        <motion.div
          className="relative flex items-center bg-white/15 backdrop-blur-xl border-2 border-white/25 rounded-2xl overflow-hidden focus-within:border-yellow-400/60 focus-within:shadow-2xl focus-within:shadow-yellow-400/20 transition-all duration-500 group-hover:border-white/40"
          whileFocus={{ scale: 1.02 }}
          whileHover={{ scale: 1.01 }}
        >
          {/* Search icon with pulse animation */}
          <motion.div 
            className="absolute left-5 h-5 w-5 text-gray-400 group-focus-within:text-yellow-400"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Search size={20} />
          </motion.div>
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full pl-14 pr-32 py-5 bg-transparent text-white placeholder-gray-400 focus:outline-none text-lg font-medium"
          />
          
          <div className="absolute right-3 flex items-center gap-2">
            {/* Clear button with modern animation */}
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setQuery('');
                  setSuggestions([]);
                  setShowSuggestions(false);
                }}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
              >
                <X size={18} />
              </motion.button>
            )}
            
            {/* Voice search button with modern styling */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={startVoiceSearch}
              className={`p-2.5 rounded-full transition-all duration-300 ${
                isListening 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/30 animate-pulse' 
                  : 'text-gray-400 hover:text-white hover:bg-white/10 hover:shadow-lg hover:shadow-white/10'
              }`}
            >
              <Mic size={18} />
            </motion.button>
            
            {/* Search button with gradient and modern effects */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              className="bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 text-black px-6 py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-yellow-400/30 transition-all duration-300 relative overflow-hidden group"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative z-10">Search</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Search Suggestions with modern styling */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden z-50 max-h-96 overflow-y-auto shadow-2xl shadow-black/20"
          >
            {/* Glass morphism effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-white/10"></div>
            
            {suggestions.length > 0 ? (
              <div className="p-4 space-y-2 relative">
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="group cursor-pointer relative p-3 rounded-xl hover:bg-white/20 transition-all duration-300 border border-transparent hover:border-white/20"
                  >
                    <div className="flex items-center gap-3">
                      {/* Icon based on suggestion type */}
                    <div className="flex-shrink-0">
                      {suggestion.type === 'product' && (
                          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                            <Sparkles size={16} className="text-black" />
                          </div>
                      )}
                      {suggestion.type === 'category' && (
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                            <Filter size={16} className="text-white" />
                          </div>
                        )}
                        {suggestion.type === 'trending' && (
                          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-500 rounded-lg flex items-center justify-center">
                            <TrendingUp size={16} className="text-white" />
                          </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{suggestion.name}</p>
                      <p className="text-gray-400 text-sm">{suggestion.category}</p>
                    </div>
                    
                      {/* Arrow indicator */}
                      <motion.div
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ x: -10 }}
                        whileHover={{ x: 0 }}
                      >
                        <TrendingUp size={16} className="text-yellow-400" />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Search size={24} className="text-black" />
                </div>
                <p className="text-gray-400">No suggestions found</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar; 