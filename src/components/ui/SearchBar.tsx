import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, X, Filter, Sparkles } from 'lucide-react';
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
      <div className="relative">
        <motion.div
          className="relative flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full overflow-hidden focus-within:border-yellow-400 transition-all duration-300"
          whileFocus={{ scale: 1.02 }}
        >
          <Search className="absolute left-4 h-5 w-5 text-gray-400" />
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full pl-12 pr-20 py-4 bg-transparent text-white placeholder-gray-400 focus:outline-none text-lg"
          />
          
          <div className="absolute right-2 flex items-center gap-2">
            {query && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setQuery('');
                  setSuggestions([]);
                  setShowSuggestions(false);
                }}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={startVoiceSearch}
              className={`p-2 rounded-full transition-all duration-300 ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Mic size={18} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-2 rounded-full font-semibold hover:shadow-lg hover:shadow-yellow-400/30 transition-all duration-300"
            >
              Search
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Search Suggestions */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden z-50 max-h-96 overflow-y-auto"
          >
            {suggestions.length > 0 ? (
              <div className="p-4 space-y-2">
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 cursor-pointer transition-all duration-200 group"
                  >
                    <div className="flex-shrink-0">
                      {suggestion.type === 'trending' && (
                        <Sparkles className="h-4 w-4 text-yellow-400" />
                      )}
                      {suggestion.type === 'product' && (
                        <Search className="h-4 w-4 text-blue-400" />
                      )}
                      {suggestion.type === 'category' && (
                        <Filter className="h-4 w-4 text-green-400" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{suggestion.name}</p>
                      <p className="text-gray-400 text-sm">{suggestion.category}</p>
                    </div>
                    
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-400">
                No results found
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar; 