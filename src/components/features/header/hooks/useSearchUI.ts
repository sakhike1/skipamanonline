import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export const useSearchUI = () => {
  const location = useLocation();
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleSearchFocus = useCallback(() => {
    setIsSearchFocused(true);
    setShowSearchDropdown(true);
    setIsInteracting(true);
  }, []);

  const handleSearchBlur = useCallback(() => {
    setIsSearchFocused(false);
    if (!isInteracting) {
      setShowSearchDropdown(false);
    }
  }, [isInteracting]);

  const handleMouseMove = useCallback(() => {
    if (isSearchFocused || showSearchDropdown) {
      setIsInteracting(true);
    }
  }, [isSearchFocused, showSearchDropdown]);

  const handleMouseLeave = useCallback(() => {
    if (!isSearchFocused) {
      setIsInteracting(false);
      setShowSearchDropdown(false);
    }
  }, [isSearchFocused]);

  useEffect(() => {
    const handleScroll = () => {
      setShowSearchDropdown(false);
      setIsSearchFocused(false);
      setIsInteracting(false);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close search dropdown when route changes
    setShowSearchDropdown(false);
    setIsSearchFocused(false);
    setIsInteracting(false);
  }, [location.pathname]);

  return {
    showSearchDropdown,
    setShowSearchDropdown,
    isSearchFocused,
    setIsSearchFocused,
    searchInputRef,
    searchContainerRef,
    handleSearchFocus,
    handleSearchBlur,
    handleMouseMove,
    handleMouseLeave
  };
};



