import React, { useState } from 'react';
import { usePoints } from '../../context/PointsContext';
import { Gift, Trophy, Star, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import PointsRedemption from './PointsRedemption';

interface PointsDisplayProps {
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'badge' | 'minimal';
  showRedeemButton?: boolean;
}

const PointsDisplay: React.FC<PointsDisplayProps> = ({ 
  showIcon = true, 
  size = 'md',
  variant = 'default',
  showRedeemButton = false
}) => {
  const { totalPoints, canRedeem } = usePoints();
  const [showRedemption, setShowRedemption] = useState(false);

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20
  };

  if (variant === 'minimal') {
    return (
      <span className={`text-gray-600 ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'}`}>
        {totalPoints} pts
      </span>
    );
  }

  if (variant === 'badge') {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 rounded-full ${sizeClasses[size]} font-bold flex items-center gap-1 shadow-md`}
      >
        {showIcon && <Trophy size={iconSizes[size]} />}
        <span>{totalPoints}</span>
      </motion.div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {showIcon && (
        <div className="relative">
          <Gift className={`text-yellow-500 ${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'}`} />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold"
          >
            {totalPoints > 999 ? '999+' : totalPoints}
          </motion.div>
        </div>
      )}
      <span className={`font-semibold text-gray-700 ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'}`}>
        {totalPoints} points
      </span>
    </div>
  );
};

export default PointsDisplay;
