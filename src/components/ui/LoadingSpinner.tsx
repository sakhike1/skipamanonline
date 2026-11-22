import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'dots' | 'pulse' | 'bars' | 'ripple' | 'gradient';
  color?: 'primary' | 'secondary' | 'white' | 'purple' | 'gold';
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  color = 'primary',
  text,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'border-gray-300 border-t-black',
    secondary: 'border-gray-300 border-t-gray-600',
    white: 'border-white/30 border-t-white',
    purple: 'border-purple-300 border-t-purple-600',
    gold: 'border-yellow-300 border-t-yellow-600'
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`${sizeClasses[size]} bg-current rounded-full`}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <motion.div
            className={`${sizeClasses[size]} bg-current rounded-full`}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        );

      case 'bars':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-1 bg-current rounded-full"
                style={{ height: size === 'sm' ? '12px' : size === 'md' ? '16px' : size === 'lg' ? '20px' : '24px' }}
                animate={{
                  scaleY: [1, 2, 1]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
        );

      case 'ripple':
        return (
          <div className="relative">
            <motion.div
              className={`${sizeClasses[size]} border-2 border-current rounded-full`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
            <motion.div
              className={`${sizeClasses[size]} border-2 border-current rounded-full absolute inset-0`}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.5,
                ease: "easeOut"
              }}
            />
          </div>
        );

      case 'gradient':
        // Use black/white gradient when color is white, otherwise use original
        if (color === 'white') {
          return (
            <div className="relative">
              <motion.div
                className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-white via-gray-300 to-white bg-[length:200%_100%]`}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <motion.div
                className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent absolute inset-0`}
                animate={{
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>
          );
        }
        return (
          <div className="relative">
            <motion.div
              className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-[length:200%_100%]`}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.div
              className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent absolute inset-0`}
              animate={{
                rotate: [0, 360]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>
        );

      default:
        return (
          <motion.div
            className={`${sizeClasses[size]} border-2 ${colorClasses[color]} rounded-full`}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        );
    }
  };

  // Determine text color based on background context
  const textColorClass = color === 'white' 
    ? 'text-white' 
    : 'text-gray-600 dark:text-gray-400';

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {renderSpinner()}
      {text && (
        <motion.p
          className={`mt-3 text-sm ${textColorClass} text-center`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;
