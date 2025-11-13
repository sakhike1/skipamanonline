import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useHeaderSearch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchFocused(false);
    }
  }, [searchQuery, navigate]);

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

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsInteracting(true);
  }, []);

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
    if (showSearchDropdown) {
      setShowSearchDropdown(false);
      setIsSearchFocused(false);
      setIsInteracting(false);
    }
  }, [location.pathname]);

  return {
    searchQuery,
    setSearchQuery,
    showSearchDropdown,
    setShowSearchDropdown,
    isSearchFocused,
    searchInputRef,
    searchContainerRef,
    handleSearch,
    handleSearchFocus,
    handleSearchBlur,
    handleSearchChange,
    handleMouseMove,
    handleMouseLeave
  };
};



