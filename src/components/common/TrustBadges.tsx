import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Truck, RotateCcw, Award, Lock, CreditCard, Clock, CheckCircle } from 'lucide-react';

interface TrustBadge {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

interface TrustBadgesProps {
  variant?: 'horizontal' | 'vertical' | 'grid';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const TrustBadges: React.FC<TrustBadgesProps> = ({ 
  variant = 'horizontal', 
  size = 'md', 
  className = '' 
}) => {
  const badges: TrustBadge[] = [
    {
      icon: Shield,
      title: "Secure Payment",
      description: "SSL encrypted checkout",
      color: "text-purple-600",
      bgColor: "bg-purple-50 border-purple-200"
    },
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders over R500",
      color: "text-pink-600",
      bgColor: "bg-pink-50 border-pink-200"
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "30-day return policy",
      color: "text-purple-600",
      bgColor: "bg-purple-50 border-purple-200"
    },
    {
      icon: Award,
      title: "Premium Quality",
      description: "Handpicked products",
      color: "text-blue-600",
      bgColor: "bg-blue-50 border-blue-200"
    },
    {
      icon: Lock,
      title: "Privacy Protected",
      description: "Your data is safe",
      color: "text-purple-600",
      bgColor: "bg-purple-50 border-purple-200"
    },
    {
      icon: CreditCard,
      title: "Multiple Payment",
      description: "Cards, EFT, PayPal",
      color: "text-pink-600",
      bgColor: "bg-pink-50 border-pink-200"
    }
  ];

  const sizeClasses = {
    sm: {
      container: "p-3",
      icon: "w-5 h-5",
      title: "text-sm font-semibold",
      description: "text-xs"
    },
    md: {
      container: "p-4",
      icon: "w-6 h-6",
      title: "text-sm font-semibold",
      description: "text-xs"
    },
    lg: {
      container: "p-6",
      icon: "w-8 h-8",
      title: "text-base font-semibold",
      description: "text-sm"
    }
  };

  const variantClasses = {
    horizontal: "flex flex-wrap gap-4",
    vertical: "flex flex-col gap-4",
    grid: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`${variantClasses[variant]} ${className}`}>
      {badges.map((badge, index) => (
        <motion.div
          key={badge.title}
          className={`flex items-center gap-3 ${currentSize.container} ${badge.bgColor} border rounded-xl hover:shadow-md transition-all duration-300`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className={`${currentSize.icon} ${badge.color}`}>
            <badge.icon className="w-full h-full" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`${currentSize.title} ${badge.color} mb-1`}>
              {badge.title}
            </h3>
            <p className={`${currentSize.description} text-gray-600`}>
              {badge.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Compact version for checkout
export const CheckoutTrustBadges: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-center gap-6 text-center">
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Shield className="w-5 h-5 text-purple-600" />
          <span className="text-sm font-medium text-gray-700">Secure</span>
        </motion.div>
        
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Lock className="w-5 h-5 text-purple-600" />
          <span className="text-sm font-medium text-gray-700">Encrypted</span>
        </motion.div>
        
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <CheckCircle className="w-5 h-5 text-pink-600" />
          <span className="text-sm font-medium text-gray-700">Trusted</span>
        </motion.div>
      </div>
    </div>
  );
};

// Security assurance for payment forms
export const SecurityAssurance: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <motion.div
      className={`flex items-center justify-center gap-2 text-sm text-gray-600 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <Shield className="w-4 h-4 text-purple-500" />
      <span>Your payment information is secure and encrypted</span>
    </motion.div>
  );
};

export default TrustBadges;
