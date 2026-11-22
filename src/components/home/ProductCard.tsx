import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Plus, Star } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  index: number;
  hoveredProduct: string | null;
  currentImageIndex: { [key: string]: number };
  isTransitioning: boolean;
  onMouseEnter: (productId: string) => void;
  onMouseLeave: () => void;
  onViewProduct: (e: React.MouseEvent, productId: string) => void;
}

const ProductCard = memo<ProductCardProps>(({
  product,
  index,
  hoveredProduct,
  currentImageIndex,
  isTransitioning,
  onMouseEnter,
  onMouseLeave,
  onViewProduct,
}) => {
  const currentIndex = currentImageIndex[product.id] || 0;
  const isHovered = hoveredProduct === product.id;

  return (
    <motion.article 
      className="group"
      onMouseEnter={() => onMouseEnter(product.id)}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
    >
      <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-900 to-black rounded-2xl relative border border-white/10 backdrop-blur-sm">
        {/* Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-2xl"></div>
        
        {/* Preload all images with lazy loading */}
        {product.images.map((imageSrc, imgIndex) => {
          return (
            <motion.img
              key={imgIndex}
              src={imageSrc}
              alt={`${product.name} - Image ${imgIndex + 1}`}
              className={`absolute inset-0 w-full h-full object-cover rounded-2xl transition-all duration-500 ease-in-out
                ${imgIndex === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}
              `}
              animate={{
                scale: isHovered ? 1.05 : 1,
                filter: isTransitioning ? 'blur(0.5px)' : 'blur(0px)',
              }}
              transition={{ duration: 0.5 }}
              loading={imgIndex === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
          );
        })}
        
        {/* Featured Badge */}
        {product.featured && (
          <motion.div 
            className="absolute top-4 left-4 z-30"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="bg-black text-white px-3 py-1 text-xs font-bold tracking-widest rounded-md flex items-center gap-1">
              <Star size={12} />
              NEW
            </div>
          </motion.div>
        )}
        
        {/* Image indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-40">
          {product.images.map((_, imgIndex) => {
            return (
              <motion.div
                key={imgIndex}
                className={`w-2 h-2 rounded-full transition-all duration-300
                  ${imgIndex === currentIndex 
                    ? 'bg-white' 
                    : 'bg-white/40'
                  }`}
                whileHover={{ scale: 1.2 }}
              />
            );
          })}
        </div>
        
        {/* Quick add button */}
        {isHovered && (
          <motion.div 
            className="absolute bottom-4 right-4 z-40"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button 
              onClick={(e) => onViewProduct(e, product.id)}
              className="flex items-center justify-center w-12 h-12 bg-white/90 rounded-md text-black hover:bg-white shadow-lg transition-colors duration-200"
              aria-label="Quick view"
            >
              <Plus size={20} />
            </button>
          </motion.div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="mt-6 space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="text-white text-lg font-semibold tracking-wider">{product.name}</h3>
          <motion.p 
            className="text-white font-bold text-lg"
            animate={{ color: isHovered ? '#f59e0b' : 'rgba(255, 255, 255, 1)' }}
          >
            R500
          </motion.p>
        </div>
        <p className="text-gray-300 text-sm uppercase tracking-wider">{product.category}</p>
        
        <motion.button
          onClick={(e) => onViewProduct(e, product.id)}
          className="mt-4 w-full bg-white text-black border border-gray-400 py-4 text-sm tracking-widest hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2 rounded-md group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ShoppingBag size={16} />
          <span>View Product</span>
        </motion.button>
      </div>
    </motion.article>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;


