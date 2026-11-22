import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { Button } from '../ui/Button';
import WishlistButton from './WishlistButton';

interface ProductCardProps {
  product: Product;
  onClick: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const formatPrice = (price: number) => {
    return `R${(price / 100).toFixed(2)}`;
  };

  // Auto-rotate images every 7 seconds when not hovered
  useEffect(() => {
    if (isHovered || product.images.length <= 1) return; // Pause auto-rotation on hover
    
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
        setIsTransitioning(false);
      }, 300);
    }, 7000); // Change every 7 seconds

    return () => clearInterval(interval);
  }, [isHovered, product.images.length]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (product.images.length > 1) {
      // Immediately change image on hover
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
        setIsTransitioning(false);
      }, 300); // Smooth fade transition
    }
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsTransitioning(false);
  };
  

  const handleViewProduct = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(product.id);
  };
  
  return (
    <div 
      className="group h-full flex flex-col"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(product.id)}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
        {product.images.map((imageSrc, index) => (
          <img
            key={index}
            src={imageSrc}
            alt={`${product.name} - Image ${index + 1}`}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-500 ease-in-out
              ${index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}
              ${isTransitioning ? 'blur-[0.5px]' : 'blur-0'}
              group-hover:scale-105
            `}
          />
        ))}
        
        <div className="absolute top-4 right-4">
          <WishlistButton 
            product={product} 
            size="md" 
            variant="icon"
            className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
          />
        </div>
      </div>
      
      <div className="mt-6 space-y-2">
        <h3 className="text-lg tracking-wider text-white">{product.name}</h3>
        
        {/* Rating Display */}
        {product.rating && (
          <div className="flex items-center space-x-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.round(product.rating!) ? 'text-yellow-400' : 'text-gray-400'}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-white/70">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>
        )}
        
        <p className="text-white/70">{formatPrice(product.price)}</p>
        
        <div className="flex gap-2 mt-4">
          {product.colors.map(color => (
            <div 
              key={color.name}
              className="w-4 h-4 rounded-full border border-white/20"
              style={{ backgroundColor: color.value }}
              title={color.name}
            ></div>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleViewProduct}
          className="mt-4 w-full border border-white/30 text-white hover:bg-white hover:text-black transition-all rounded-none active:scale-95 active:shadow-lg focus:scale-95 focus:shadow-lg"
        >
          View Product
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;