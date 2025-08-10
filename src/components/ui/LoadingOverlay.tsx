import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

interface LoadingOverlayProps {
  isLoading: boolean;
  variant?: 'fullscreen' | 'inline' | 'card' | 'button';
  text?: string;
  spinnerVariant?: 'default' | 'dots' | 'pulse' | 'bars' | 'ripple' | 'gradient';
  spinnerSize?: 'sm' | 'md' | 'lg' | 'xl';
  spinnerColor?: 'primary' | 'secondary' | 'white' | 'purple' | 'gold';
  className?: string;
  children?: React.ReactNode;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  variant = 'inline',
  text,
  spinnerVariant = 'default',
  spinnerSize = 'md',
  spinnerColor = 'white',
  className = '',
  children
}) => {
  const renderOverlay = () => {
    switch (variant) {
      case 'fullscreen':
        return (
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center">
              <LoadingSpinner
                variant={spinnerVariant}
                size="xl"
                color={spinnerColor}
                text={text}
              />
            </div>
          </motion.div>
        );

      case 'card':
        return (
          <motion.div
            className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center">
              <LoadingSpinner
                variant={spinnerVariant}
                size={spinnerSize}
                color={spinnerColor}
                text={text}
              />
            </div>
          </motion.div>
        );

      case 'button':
        return (
          <motion.div
            className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-md flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <LoadingSpinner
              variant={spinnerVariant}
              size="sm"
              color={spinnerColor}
            />
          </motion.div>
        );

      default: // inline
        return (
          <motion.div
            className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center">
              <LoadingSpinner
                variant={spinnerVariant}
                size={spinnerSize}
                color={spinnerColor}
                text={text}
              />
            </div>
          </motion.div>
        );
    }
  };

  if (variant === 'fullscreen') {
    return (
      <AnimatePresence>
        {isLoading && renderOverlay()}
      </AnimatePresence>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {children}
      <AnimatePresence>
        {isLoading && renderOverlay()}
      </AnimatePresence>
    </div>
  );
};

export default LoadingOverlay;
