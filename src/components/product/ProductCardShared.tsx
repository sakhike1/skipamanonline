import React, { useState, useEffect } from 'react';
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-rotate images every 7 seconds when not hovered
  useEffect(() => {
    if (isHovered || product.images.length <= 1) return; // Pause auto-rotation on hover
    
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
        );
        setIsTransitioning(false);
      }, 300);
    }, 7000); // Change every 7 seconds

    return () => clearInterval(interval);
  }, [isHovered, product.images.length]);

  const handleImageHover = () => {
    if (product.images.length > 1) {
      setIsHovered(true);
      // Immediately change image on hover
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
        );
        setIsTransitioning(false);
      }, 300); // Smooth fade transition
    }
  };

  if (variant === 'compact') {
    return (
      <div 
        className="group relative bg-white border border-neutral-300 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
        onClick={() => onClick(product.id)}
        onMouseEnter={handleImageHover}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsTransitioning(false);
        }}
      >
        <div className="aspect-square overflow-hidden relative">
          {product.images.map((imageSrc, index) => (
            <img
              key={index}
              src={imageSrc}
              alt={`${product.name} - Image ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in-out
                ${index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}
                ${isTransitioning ? 'blur-[0.5px]' : 'blur-0'}
                group-hover:scale-105
              `}
            />
          ))}
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
        onMouseLeave={() => {
          setIsHovered(false);
          setIsTransitioning(false);
        }}
      >
        {product.images.map((imageSrc, index) => (
          <img
            key={index}
            src={imageSrc}
            alt={`${product.name} - Image ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in-out
              ${index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}
              ${isTransitioning ? 'blur-[0.5px]' : 'blur-0'}
              group-hover:scale-105
            `}
          />
        ))}
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

