import React from 'react';
import { ShoppingBag, Heart, Search, Package } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  type: 'cart' | 'wishlist' | 'search' | 'orders' | 'products';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  const config = {
    cart: {
      icon: ShoppingBag,
      defaultTitle: 'Your cart is empty',
      defaultDescription: 'Looks like you haven\'t added anything to your cart yet. Start shopping to fill it up!',
      defaultAction: 'Start Shopping',
      color: 'from-blue-500 to-cyan-500',
    },
    wishlist: {
      icon: Heart,
      defaultTitle: 'Your wishlist is empty',
      defaultDescription: 'Save your favorite products here to buy them later. Start adding items you love!',
      defaultAction: 'Browse Products',
      color: 'from-pink-500 to-rose-500',
    },
    search: {
      icon: Search,
      defaultTitle: 'No products found',
      defaultDescription: 'We couldn\'t find any products matching your search. Try different keywords or browse our collection.',
      defaultAction: 'Browse All Products',
      color: 'from-purple-500 to-indigo-500',
    },
    orders: {
      icon: Package,
      defaultTitle: 'No orders yet',
      defaultDescription: 'You haven\'t placed any orders yet. Start shopping to see your order history here!',
      defaultAction: 'Start Shopping',
      color: 'from-green-500 to-emerald-500',
    },
    products: {
      icon: Package,
      defaultTitle: 'No products available',
      defaultDescription: 'There are no products in this category at the moment. Check back soon for new arrivals!',
      defaultAction: 'View All Products',
      color: 'from-gray-500 to-slate-500',
    },
  };

  const { icon: Icon, defaultTitle, defaultDescription, defaultAction, color } = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className={`w-24 h-24 bg-gradient-to-br ${color} rounded-full flex items-center justify-center mb-6 shadow-2xl`}
      >
        <Icon className="w-12 h-12 text-white" />
      </motion.div>

      <h3 className="text-2xl font-black text-gray-900 mb-3">
        {title || defaultTitle}
      </h3>

      <p className="text-gray-600 max-w-md mb-8 leading-relaxed">
        {description || defaultDescription}
      </p>

      {onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className={`bg-gradient-to-r ${color} text-white px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all duration-300`}
        >
          {actionLabel || defaultAction}
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyState;





















































