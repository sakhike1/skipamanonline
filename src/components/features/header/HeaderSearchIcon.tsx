import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '../../ui/SearchBar';

interface HeaderSearchIconProps {
  textColor: string;
  onSearch?: (query: string) => void;
}

export const HeaderSearchIcon: React.FC<HeaderSearchIconProps> = ({
  textColor,
  onSearch,
}) => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <>
      {/* Icon Button */}
      <motion.button
        onClick={() => setShowSearch(true)}
        className={`
          p-2.5 rounded-full relative transition-all duration-300 ${textColor}
          hover:opacity-80
        `}
        aria-label="Search products"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{ transform: 'none' }}
      >
        <Search 
          size={20} 
          className="[filter:drop-shadow(0px_0px_1px_rgba(255,255,255,0.5))]" 
        />
      </motion.button>

      {/* Search Modal - Show SearchBar when icon is clicked */}
      <AnimatePresence>
        {showSearch && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSearch(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            />
            
            {/* Search Bar Container */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-[101] px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <SearchBar
                onSearch={(query) => {
                  if (onSearch) {
                    onSearch(query);
                  }
                  setShowSearch(false);
                }}
                placeholder="Search products..."
                className="w-full"
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

