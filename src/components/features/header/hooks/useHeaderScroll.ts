import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { debounce } from 'lodash';

export const useHeaderScroll = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    const debouncedHandler = debounce(() => {
      setIsScrolled(window.scrollY > 20);
      
      if (!location.pathname.includes('/product/')) {
        const sections = document.querySelectorAll('section, div.bg-black, div.bg-white');
        if (sections.length) {
          for (const section of sections) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 80 && rect.bottom >= 80) {
              break;
            }
          }
        }
      }
    }, 100);
    
    return debouncedHandler();
  }, [location.pathname]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return { isScrolled };
};

