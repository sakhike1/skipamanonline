import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  description?: string;
}

interface ProductCardSharedProps {
  product: Product;
  onClick: (id: string) => void;
  variant?: 'default' | 'compact';
}

/**
 * Shared ProductCard component
 * Can be used across ShopPage, NewArrivals, and other components
 */
export const ProductCardShared: React.FC<ProductCardSharedProps> = ({ 
  product, 
  onClick,
  variant = 'default'
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageHover = () => {
    if (product.images.length > 1) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  if (variant === 'compact') {
    return (
      <div 
        className="group relative bg-white border border-neutral-300 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
        onClick={() => onClick(product.id)}
        onMouseEnter={handleImageHover}
      >
        <div className="aspect-square overflow-hidden relative">
          <img
            src={product.images[currentImageIndex] || product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 absolute inset-0"
          />
        </div>
        <div className="p-3">
          <h3 className="font-medium text-black text-sm line-clamp-1 mb-1">{product.name}</h3>
لاً          <p className="text-black font-medium text-sm">R{(product.price / 100).toFixed(2)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white border border-neutral-300 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300">
      <div
        className="aspect-square overflow-hidden cursor-pointer relative"
        onClick={() => onClick(product.id)}
        onMouseEnter={handleImageHover}
      >
        <img
          src={product.images[currentImageIndex] || product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 absolute inset-0"
        />
        {product.images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
            {currentImageIndex + 1}/{product.images.length}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-medium text-black line-clamp-1">{product.name}</h3>
          <span className="text-black font-medium">R{(product.price / 100).toFixed(2)}</span>
        </div>
        <p className="text-sm text-neutral-600 mb-3 capitalize">{product.category}</p>
        <button
          onClick={() => onClick(product.id)}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-black rounded-md text-sm font-medium text-black hover:bg-black hover:text-white transition-all duration-300 group-hover:border-black"
        >
          View Product
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform duration-300"
          />
        </button>
      </div>
    </div>
  );
};

