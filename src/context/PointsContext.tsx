import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './useAuth';

interface PointsTransaction {
  id: string;
  type: 'review' | 'purchase' | 'referral' | 'bonus' | 'redemption';
  points: number;
  description: string;
  date: Date;
  productId?: string;
  reviewId?: string;
  redemptionType?: 'free_delivery' | 'free_item';
  redemptionValue?: number;
}

interface PointsContextType {
  totalPoints: number;
  transactions: PointsTransaction[];
  addPoints: (points: number, type: PointsTransaction['type'], description: string, metadata?: { productId?: string; reviewId?: string }) => void;
  redeemPoints: (redemptionType: 'free_delivery' | 'free_item', value: number, description: string) => boolean;
  canRedeem: (redemptionType: 'free_delivery' | 'free_item') => boolean;
  getPointsHistory: () => PointsTransaction[];
  getPointsForReview: (reviewData: any) => number;
  getRedemptionOptions: () => Array<{ type: 'free_delivery' | 'free_item'; cost: number; description: string; value: number }>;
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);

export const usePoints = () => {
  const context = useContext(PointsContext);
  if (!context) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
};

interface PointsProviderProps {
  children: ReactNode;
}

export const PointsProvider: React.FC<PointsProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [totalPoints, setTotalPoints] = useState(0);
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);

  // Load points data from localStorage
  useEffect(() => {
    if (user) {
      const savedPoints = localStorage.getItem(`points_${user.id}`);
      const savedTransactions = localStorage.getItem(`points_transactions_${user.id}`);
      
      if (savedPoints) {
        setTotalPoints(parseInt(savedPoints));
      }
      
      if (savedTransactions) {
        try {
          const parsedTransactions = JSON.parse(savedTransactions).map((t: any) => ({
            ...t,
            date: new Date(t.date)
          }));
          setTransactions(parsedTransactions);
        } catch (error) {
          console.error('Error parsing points transactions:', error);
        }
      }
    } else {
      // Reset points when user logs out
      setTotalPoints(0);
      setTransactions([]);
    }
  }, [user]);

  // Save points data to localStorage whenever it changes
  useEffect(() => {
    if (user && totalPoints >= 0) {
      localStorage.setItem(`points_${user.id}`, totalPoints.toString());
    }
  }, [totalPoints, user]);

  useEffect(() => {
    if (user && transactions.length >= 0) {
      localStorage.setItem(`points_transactions_${user.id}`, JSON.stringify(transactions));
    }
  }, [transactions, user]);

  const addPoints = (points: number, type: PointsTransaction['type'], description: string, metadata?: { productId?: string; reviewId?: string }) => {
    if (!user) return;

    const transaction: PointsTransaction = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      points,
      description,
      date: new Date(),
      ...metadata
    };

    setTransactions(prev => [transaction, ...prev]);
    setTotalPoints(prev => prev + points);

    // Show notification
    if (points > 0) {
      // You can integrate with your notification system here
      console.log(`🎉 Earned ${points} points! ${description}`);
    }
  };

  const getPointsHistory = () => {
    return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  const redeemPoints = (redemptionType: 'free_delivery' | 'free_item', value: number, description: string): boolean => {
    if (!user) return false;

    const pointsCost = 200; // Fixed cost for redemption
    if (totalPoints < pointsCost) {
      return false;
    }

    const transaction: PointsTransaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'redemption',
      points: -pointsCost, // Negative points for redemption
      description,
      date: new Date(),
      redemptionType,
      redemptionValue: value
    };

    setTransactions(prev => [transaction, ...prev]);
    setTotalPoints(prev => prev - pointsCost);

    return true;
  };

  const canRedeem = (redemptionType: 'free_delivery' | 'free_item'): boolean => {
    return totalPoints >= 200;
  };

  const getRedemptionOptions = () => {
    return [
      {
        type: 'free_delivery' as const,
        cost: 200,
        description: 'Free Delivery',
        value: 50 // R50 delivery value
      },
      {
        type: 'free_item' as const,
        cost: 200,
        description: 'Free Item (up to R100)',
        value: 100
      }
    ];
  };

  const getPointsForReview = (reviewData: any) => {
    let points = 0;
    
    // Base points for writing a review
    points += 50;
    
    // Bonus points for rating
    if (reviewData.rating >= 4) {
      points += 25;
    }
    
    // Bonus points for detailed review
    if (reviewData.comment && reviewData.comment.length > 100) {
      points += 30;
      if (reviewData.comment.length > 300) {
        points += 20; // Extra bonus for detailed reviews
      }
    }
    
    // Bonus points for images
    if (reviewData.images && reviewData.images.length > 0) {
      points += reviewData.images.length * 15; // 15 points per image
    }
    
    // Bonus points for complete information
    if (reviewData.size && reviewData.color) {
      points += 20;
    }
    
    if (reviewData.title && reviewData.title.length > 10) {
      points += 15;
    }
    
    // Bonus for recommendation
    if (reviewData.wouldRecommend) {
      points += 10;
    }
    
    return points;
  };

  const value: PointsContextType = {
    totalPoints,
    transactions,
    addPoints,
    redeemPoints,
    canRedeem,
    getPointsHistory,
    getPointsForReview,
    getRedemptionOptions
  };

  return (
    <PointsContext.Provider value={value}>
      {children}
    </PointsContext.Provider>
  );
};
