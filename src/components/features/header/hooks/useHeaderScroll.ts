import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const useHeaderScroll = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  const pathnameRef = useRef(location.pathname);
  pathnameRef.current = location.pathname;

  const scrollHandler = useMemo(() => {
    let timer: number | null = null;
    return () => {
      if (timer !== null) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        setIsScrolled(window.scrollY > 20);

        if (!pathnameRef.current.includes('/product/')) {
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
    };
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', scrollHandler, { passive: true });
    scrollHandler();

    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, [scrollHandler]);

  return { isScrolled };
};

