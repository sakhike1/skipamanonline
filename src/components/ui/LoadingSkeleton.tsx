import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  count?: number;
  type?: 'product' | 'text' | 'image' | 'button';
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '', count = 1, type = 'product' }) => {
  const shimmer = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]";

  const renderSkeleton = () => {
    switch (type) {
      case 'product':
        return (
          <div className="group relative overflow-hidden rounded-2xl">
            <div className="relative aspect-square overflow-hidden">
              {/* Image skeleton */}
              <div className={`w-full h-full ${shimmer} rounded-2xl`}></div>
              
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
          </div>
        );
      
      case 'text':
        return (
          <div className="space-y-2">
            <div className={`h-4 w-full ${shimmer} rounded`}></div>
            <div className={`h-4 w-5/6 ${shimmer} rounded`}></div>
            <div className={`h-4 w-4/6 ${shimmer} rounded`}></div>
          </div>
        );
      
      case 'image':
        return (
          <div className={`aspect-square ${shimmer} rounded-2xl`}></div>
        );
      
      case 'button':
        return (
          <div className={`h-12 w-32 ${shimmer} rounded-full`}></div>
        );
      
      default:
        return (
          <div className={`h-20 w-full ${shimmer} rounded`}></div>
        );
    }
  };

  if (count === 1) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={className}
      >
        {renderSkeleton()}
      </motion.div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {renderSkeleton()}
        </motion.div>
      ))}
    </div>
  );
};

export default Skeleton;