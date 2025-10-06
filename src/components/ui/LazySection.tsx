import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LazySectionProps {
  children: React.ReactNode;
  className?: string;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  delay?: number;
}

const LazySection: React.FC<LazySectionProps> = ({
  children,
  className = '',
  fallback,
  rootMargin = '100px',
  threshold = 0.1,
  delay = 0
}) => {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Add a small delay to prevent overwhelming the browser
          setTimeout(() => {
            setIsLoaded(true);
          }, delay);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold, delay]);

  return (
    <div ref={sectionRef} className={className}>
      {isInView ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {isLoaded ? children : (fallback || <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />)}
        </motion.div>
      ) : (
        fallback || <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
      )}
    </div>
  );
};

export default LazySection;
