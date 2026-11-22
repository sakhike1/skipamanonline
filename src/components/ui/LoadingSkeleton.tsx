import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  count?: number;
  type?: 'product' | 'text' | 'image' | 'button' | 'card' | 'list' | 'header' | 'checkout' | 'grid' | 'hero' | 'product-list';
  theme?: 'light' | 'dark';
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  count = 1, 
  type = 'product',
  theme = 'light'
}) => {
  const isDark = theme === 'dark';
  const baseShimmer = isDark 
    ? "animate-pulse bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%]"
    : "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]";
  
  const shimmer = `${baseShimmer} animate-shimmer-enhanced`;

  const renderSkeleton = () => {
    switch (type) {
      case 'product':
        return (
          <motion.div 
            className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative aspect-square overflow-hidden">
              {/* Image skeleton with shimmer */}
              <div className={`w-full h-full ${shimmer} rounded-2xl relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent animate-shimmer"></div>
              </div>
              
              {/* Content skeleton */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3">
                  {/* Title skeleton */}
                  <div className={`h-6 w-3/4 ${shimmer} rounded mb-2`}></div>
                  {/* Price skeleton */}
                  <div className={`h-5 w-1/3 ${shimmer} rounded mb-2`}></div>
                  {/* Category skeleton */}
                  <div className={`h-4 w-1/2 ${shimmer} rounded mb-3`}></div>
                  {/* Button skeleton */}
                  <div className={`h-10 w-full ${shimmer} rounded-full`}></div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      
      case 'card':
        return (
          <motion.div 
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 ${shimmer} rounded-full`}></div>
              <div className="flex-1">
                <div className={`h-4 w-2/3 ${shimmer} rounded mb-2`}></div>
                <div className={`h-3 w-1/2 ${shimmer} rounded`}></div>
              </div>
            </div>
            {/* Content */}
            <div className="space-y-3">
              <div className={`h-4 w-full ${shimmer} rounded`}></div>
              <div className={`h-4 w-5/6 ${shimmer} rounded`}></div>
              <div className={`h-4 w-4/6 ${shimmer} rounded`}></div>
            </div>
          </motion.div>
        );

      case 'checkout':
        return (
          <motion.div 
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Header */}
            <div className="mb-8">
              <div className={`h-8 w-1/3 ${shimmer} rounded mb-4`}></div>
              <div className={`h-4 w-2/3 ${shimmer} rounded`}></div>
            </div>
            
            {/* Form fields */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className={`h-4 w-1/3 ${shimmer} rounded`}></div>
                    <div className={`h-12 w-full ${shimmer} rounded-lg`}></div>
                  </div>
                ))}
              </div>
              
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className={`h-4 w-1/4 ${shimmer} rounded`}></div>
                  <div className={`h-12 w-full ${shimmer} rounded-lg`}></div>
                </div>
              ))}
              
              {/* Payment section */}
              <div className="pt-4 border-t border-white/10">
                <div className={`h-6 w-1/4 ${shimmer} rounded mb-4`}></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`h-10 w-full ${shimmer} rounded-lg`}></div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );
      
      case 'text':
        return (
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`h-4 w-full ${shimmer} rounded`}></div>
            <div className={`h-4 w-5/6 ${shimmer} rounded`}></div>
            <div className={`h-4 w-4/6 ${shimmer} rounded`}></div>
            <div className={`h-4 w-3/4 ${shimmer} rounded`}></div>
          </motion.div>
        );
      
      case 'image':
        return (
          <motion.div 
            className={`aspect-square ${shimmer} rounded-2xl relative overflow-hidden`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent animate-shimmer"></div>
          </motion.div>
        );
      
      case 'button':
        return (
          <motion.div 
            className={`h-12 w-32 ${shimmer} rounded-full`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          ></motion.div>
        );

      case 'header':
        return (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className={`h-12 w-3/4 ${shimmer} rounded`}></div>
            <div className={`h-6 w-1/2 ${shimmer} rounded`}></div>
            <div className={`h-4 w-2/3 ${shimmer} rounded`}></div>
          </motion.div>
        );

      case 'list':
        return (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                <div className={`w-12 h-12 ${shimmer} rounded-full flex-shrink-0`}></div>
                <div className="flex-1 space-y-2">
                  <div className={`h-4 w-2/3 ${shimmer} rounded`}></div>
                  <div className={`h-3 w-1/2 ${shimmer} rounded`}></div>
                </div>
                <div className={`w-20 h-8 ${shimmer} rounded`}></div>
              </div>
            ))}
          </motion.div>
        );

      case 'grid':
        return (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="space-y-3">
                <div className={`aspect-square ${shimmer} rounded-xl`}></div>
                <div className={`h-4 w-3/4 ${shimmer} rounded`}></div>
                <div className={`h-4 w-1/2 ${shimmer} rounded`}></div>
              </div>
            ))}
          </motion.div>
        );

      case 'hero':
        return (
          <motion.div 
            className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className={`absolute inset-0 ${shimmer}`}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
              <div className={`h-12 w-3/4 ${shimmer} rounded`}></div>
              <div className={`h-6 w-1/2 ${shimmer} rounded`}></div>
              <div className={`h-12 w-40 ${shimmer} rounded-full`}></div>
            </div>
          </motion.div>
        );

      case 'product-list':
        return (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-xl">
                <div className={`w-24 h-24 sm:w-32 sm:h-32 ${shimmer} rounded-lg flex-shrink-0`}></div>
                <div className="flex-1 space-y-3">
                  <div className={`h-5 w-2/3 ${shimmer} rounded`}></div>
                  <div className={`h-4 w-1/2 ${shimmer} rounded`}></div>
                  <div className={`h-6 w-1/4 ${shimmer} rounded`}></div>
                </div>
                <div className={`w-24 h-10 ${shimmer} rounded-full`}></div>
              </div>
            ))}
          </motion.div>
        );
      
      default:
        return (
          <motion.div 
            className={`h-20 w-full ${shimmer} rounded`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          ></motion.div>
        );
    }
  };

  if (count === 1) {
    return (
      <div className={className}>
        {renderSkeleton()}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
        >
          {renderSkeleton()}
        </motion.div>
      ))}
    </div>
  );
};

export default Skeleton;