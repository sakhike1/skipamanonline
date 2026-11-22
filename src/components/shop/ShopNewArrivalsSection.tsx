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
  if (featuredProducts.length === 0) {
    return null;
  }

  const primaryProduct = featuredProducts[0];
  const secondaryProduct = featuredProducts[1] ?? primaryProduct;

  return (
    <div className="w-full">
      <div className="bg-black">
        <ShopHeroSection
          primaryProduct={primaryProduct}
          secondaryProduct={secondaryProduct}
          featuredProducts={featuredProducts}
          onProductClick={onProductClick}
        />
      </div>
      <FeaturedProductsGrid products={featuredProducts} onProductClick={onProductClick} />
    </div>
  );
};

export default ShopNewArrivalsSection;
































































