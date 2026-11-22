import React from 'react';
import { Sparkles, Flame, Star, Tag } from 'lucide-react';
import { Product } from '../../types';

interface ProductBadgesProps {
  product: Product;
  className?: string;
}

export const ProductBadges: React.FC<ProductBadgesProps> = ({ product, className = '' }) => {
  const badges: JSX.Element[] = [];

  // New badge (products added in last 30 days)
  if (product.new) {
    badges.push(
      <span
        key="new"
        className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full shadow-lg"
      >
        <Sparkles className="w-3 h-3" />
        NEW
      </span>
    );
  }

  // Featured badge
  if (product.featured) {
    badges.push(
      <span
        key="featured"
        className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg"
      >
        <Star className="w-3 h-3" />
        FEATURED
      </span>
    );
  }

  // Sale badge
  if (product.compareAtPrice && product.compareAtPrice > product.price) {
    const discount = Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100);
    badges.push(
      <span
        key="sale"
        className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg"
      >
        <Tag className="w-3 h-3" />
        {discount}% OFF
      </span>
    );
  }

  // Bestseller badge
  if (product.bestseller) {
    badges.push(
      <span
        key="bestseller"
        className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold rounded-full shadow-lg"
      >
        <Flame className="w-3 h-3" />
        BESTSELLER
      </span>
    );
  }

  // Limited stock badge
  if (product.stock && product.stock < 10 && product.stock > 0) {
    badges.push(
      <span
        key="limited"
        className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse"
      >
        <Flame className="w-3 h-3" />
        ONLY {product.stock} LEFT
      </span>
    );
  }

  if (badges.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {badges}
    </div>
  );
};

export default ProductBadges;





















































