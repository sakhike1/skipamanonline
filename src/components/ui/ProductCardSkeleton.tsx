import React from 'react';
import { motion } from 'framer-motion';

interface ProductCardSkeletonProps {
  theme?: 'dark' | 'light';
}

const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({ theme = 'light' }) => {
  const isDark = theme === 'dark';
  
  return (
    <div className="animate-pulse">
      {/* Image Skeleton */}
      <div 
        className={`aspect-[3/4] rounded-2xl ${
          isDark ? 'bg-gray-800' : 'bg-gray-200'
        }`}
      />
      
      {/* Content Skeleton */}
      <div className="mt-5 space-y-3">
        <div className={`h-6 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
        <div className={`h-5 w-20 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
        <div className={`h-10 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
