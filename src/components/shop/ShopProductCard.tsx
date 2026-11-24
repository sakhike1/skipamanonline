import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../../types';

interface ShopProductCardProps {
  product: Product;
  onClick: (id: string) => void;
}

const ShopProductCard: React.FC<ShopProductCardProps> = ({ product, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-rotate images every 6 seconds when not hovered
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
    }, 6000); // Change every 6 seconds

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

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="group relative flex h-full flex-col"
      onMouseLeave={() => setCurrentImageIndex(0)}
    >
      <div
        className="relative aspect-[4/5] cursor-pointer overflow-hidden rounded-2xl bg-[#f3eff5] ring-1 ring-[#211527]/5 transition duration-500 group-hover:shadow-[0_28px_50px_-30px_rgba(33,21,39,0.55)]"
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
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out
              ${index === currentImageIndex ? 'z-10 opacity-100' : 'z-0 opacity-0'}
              ${isTransitioning ? 'blur-[0.5px]' : 'blur-0'}
              group-hover:scale-[1.04]
            `}
          />
        ))}

        <span className="absolute left-4 top-4 z-20 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#3a2646] backdrop-blur">
          {product.category}
        </span>

        <span
          aria-hidden
          className="absolute right-4 top-4 z-20 grid h-10 w-10 translate-y-1 place-items-center rounded-full bg-white text-[#211527] opacity-0 shadow-md transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <ArrowRight size={16} />
        </span>

        {product.images.length > 1 && (
          <div aria-hidden className="absolute inset-x-0 bottom-4 z-20 flex justify-center gap-1.5">
            {product.images.map((_, index) => (
              <span
                key={index}
                className={`h-1 rounded-full bg-white transition-all duration-300 ${
                  index === currentImageIndex ? 'w-6 opacity-100' : 'w-2 opacity-60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-base font-semibold leading-snug tracking-tight text-[#211527]">{product.name}</h3>
            <p className="mt-1 text-sm text-[#6b5a73]">
              {product.tags?.length
                ? product.tags
                    .slice(0, 3)
                    .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
                    .join(' · ')
                : 'Skipaman'}
            </p>
          </div>
          <span className="shrink-0 text-base font-semibold tabular-nums text-[#211527]">
            R{(product.price / 100).toFixed(2)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onClick(product.id)}
          className="group/button mt-auto inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[#211527] px-5 py-2.5 text-sm font-semibold text-[#211527] transition-colors duration-300 hover:bg-[#211527] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#211527]"
          style={{ marginTop: '1rem' }}
        >
          View product
          <ArrowRight size={16} className="transition group-hover/button:translate-x-1" aria-hidden />
        </button>
      </div>
    </motion.article>
  );
};

export default ShopProductCard;


