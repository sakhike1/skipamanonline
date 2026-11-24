import React from 'react';
import { Product } from '../../types';
import ShopHeroSection from './ShopHeroSection';
import FeaturedProductsGrid from './FeaturedProductsGrid';

interface ShopNewArrivalsSectionProps {
  onProductClick: (id: string) => void;
  featuredProducts?: Product[];
}

const ShopNewArrivalsSection: React.FC<ShopNewArrivalsSectionProps> = ({ 
  onProductClick, 
  featuredProducts = [] 
}) => {
  return (
    <div className="w-full">
      <ShopHeroSection />
      {featuredProducts.length > 0 && (
        <FeaturedProductsGrid products={featuredProducts} onProductClick={onProductClick} />
      )}
    </div>
  );
};

export default ShopNewArrivalsSection;
































































