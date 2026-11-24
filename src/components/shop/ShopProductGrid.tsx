import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../../types';
import ShopProductCard from './ShopProductCard';

interface ShopProductGridProps {
  products: Product[];
  onProductClick: (id: string) => void;
}

const ShopProductGrid: React.FC<ShopProductGridProps> = ({
  products,
  onProductClick
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-10 sm:gap-x-6 lg:gap-x-8 lg:gap-y-12">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: index * 0.03,
            ease: [0.16, 1, 0.3, 1]
          }}
          whileHover={{ y: -4 }}
          className="h-full"
        >
          <ShopProductCard product={product} onClick={onProductClick} />
        </motion.div>
      ))}
    </div>
  );
};

export default ShopProductGrid;
































































