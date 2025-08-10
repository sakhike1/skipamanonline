import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen: React.FC = () => {
  const [isLoadingContent, setIsLoadingContent] = useState(true); 
  const [displayComponent, setDisplayComponent] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');
  const initialScreenHandled = useRef(false);

  useEffect(() => {
    const removeInitialHtmlLoadingScreen = () => {
      if (initialScreenHandled.current) return;
      const initialLoadingScreen = document.getElementById('loading-screen');
      if (initialLoadingScreen) {
        initialLoadingScreen.style.opacity = '0';
        initialLoadingScreen.style.transition = 'opacity 0.5s ease-out';
        
        setTimeout(() => {
          initialLoadingScreen.remove();
          initialScreenHandled.current = true;
        }, 500);
      } else {
        initialScreenHandled.current = true;
      }
    };

    removeInitialHtmlLoadingScreen();

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Update loading text based on progress
    const textInterval = setInterval(() => {
      setLoadingText(prev => {
        if (loadingProgress < 20) return 'Initializing...';
        if (loadingProgress < 40) return 'Loading assets...';
        if (loadingProgress < 60) return 'Preparing interface...';
        if (loadingProgress < 80) return 'Almost ready...';
        return 'Finalizing...';
      });
    }, 500);

    const handlePageLoaded = () => {
      setLoadingProgress(100);
      setLoadingText('Ready!');
      
      setTimeout(() => {
        setIsLoadingContent(false);
      }, 500);
      
      setTimeout(() => {
        setDisplayComponent(false);
      }, 1200);
    };

    if (document.readyState === 'complete') {
      handlePageLoaded();
      return;
    }

    window.addEventListener('load', handlePageLoaded);

    const minDisplayTimer = setTimeout(() => {
      if (isLoadingContent) { 
        handlePageLoaded();
      }
    }, 2000);

    const maxDisplayTimer = setTimeout(() => {
      if (isLoadingContent) {
        handlePageLoaded();
      }
    }, 10000);

    return () => {
      window.removeEventListener('load', handlePageLoaded);
      clearTimeout(minDisplayTimer);
      clearTimeout(maxDisplayTimer);
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, [loadingProgress]);

  if (!displayComponent) return null;

  return (
    <AnimatePresence>
      <motion.div 
        role="status"
        aria-live="polite"
        aria-label="Page loading"
        className="fixed inset-0 z-[9999] bg-gradient-to-br from-black via-gray-900 to-black backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoadingContent ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl"
            animate={{
              x: [0, 60, 0],
              y: [0, -40, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          <motion.div 
            className="flex flex-col items-center justify-center text-center max-w-md mx-auto px-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Enhanced Spinner */}
            <div className="relative mb-12">
              {/* Outer ring */}
              <motion.div
                className="w-24 h-24 border-4 border-white/20 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Inner ring */}
              <motion.div
                className="absolute inset-2 border-4 border-transparent border-t-purple-500 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Center dot */}
              <motion.div
                className="absolute inset-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Progress indicator */}
              <motion.div
                className="absolute inset-0 border-4 border-transparent border-t-white rounded-full"
                style={{
                  background: `conic-gradient(from 0deg, white ${loadingProgress * 3.6}deg, transparent ${loadingProgress * 3.6}deg)`
                }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Brand Name */}
            <motion.div 
              className="text-white text-5xl sm:text-6xl font-black tracking-widest leading-none mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="drop-shadow-2xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                SKIPA
              </span>
              <span className="drop-shadow-2xl bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                MAN
              </span>
            </motion.div>
            
            {/* Loading Text */}
            <motion.p 
              className="text-white/80 text-lg sm:text-xl font-medium tracking-wide mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {loadingText}
            </motion.p>

            {/* Progress Bar */}
            <motion.div 
              className="w-64 h-2 bg-white/10 rounded-full overflow-hidden mb-4"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>

            {/* Progress Percentage */}
            <motion.p 
              className="text-white/60 text-sm font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              {Math.round(loadingProgress)}%
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingScreen;