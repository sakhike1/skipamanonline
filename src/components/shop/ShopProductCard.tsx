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
      whileHover={{ y: -12, scale: 1.01 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="group relative flex flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white p-1.5 shadow-[0_26px_60px_-40px_rgba(15,23,42,0.45)] transition-all duration-500 hover:border-slate-300 hover:shadow-[0_32px_80px_-46px_rgba(15,23,42,0.35)]"
      onMouseLeave={() => setCurrentImageIndex(0)}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[26px]">
        <div className="absolute -top-14 -right-12 h-40 w-40 rounded-full bg-slate-100 blur-3xl opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute -bottom-16 -left-14 h-48 w-48 rounded-full bg-slate-100 blur-3xl opacity-60 transition-opacity duration-500 group-hover:opacity-90" />
        <div className="absolute inset-0 rounded-[26px] bg-[radial-gradient(circle_at_top,_rgba(241,245,249,0.9),_transparent_62%)]" />
      </div>

      <div
        className="relative z-[1] aspect-[4/5] overflow-hidden rounded-[24px] border border-slate-100 bg-slate-50"
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
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-in-out
              ${index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}
              ${isTransitioning ? 'blur-[0.5px]' : 'blur-0'}
              group-hover:scale-[1.06]
            `}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-slate-900/80" />

        <div className="absolute top-5 left-5 flex items-center gap-2 rounded-full border border-white/40 bg-white/40 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-700 backdrop-blur-xl">
          {product.category}
        </div>

        {product.images.length > 1 && (
          <div className="absolute top-5 right-5 rounded-full border border-white/50 bg-white/40 px-3 py-1 text-[11px] font-semibold text-slate-800 backdrop-blur-xl">
            {currentImageIndex + 1}/{product.images.length}
          </div>
        )}
      </div>

      <div className="relative z-10 -mt-10 px-5 pb-5">
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.45)] transition-all duration-500 group-hover:border-slate-200">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-[1.1rem] font-black uppercase tracking-tight text-slate-900 leading-tight">{product.name}</h3>
              <p className="mt-2 text-sm font-medium text-slate-600">
                {product.tags?.length
                  ? product.tags
                      .slice(0, 3)
                      .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
                      .join(' · ')
                  : 'Skipaman'}
              </p>
            </div>
            <span className="rounded-full bg-slate-900 text-white px-3 py-1.5 text-sm font-semibold shadow-md">
              R{(product.price / 100).toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => onClick(product.id)}
            className="group/button mt-6 flex w-full items-center justify-between gap-3 overflow-hidden rounded-full border border-slate-900/25 bg-slate-900 py-3.5 px-5 text-[11px] font-semibold uppercase tracking-[0.4em] text-white transition-all duration-500 hover:border-slate-900 hover:bg-black"
          >
            <span className="relative z-10">View Product</span>
            <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-all duration-300 group-hover/button:translate-x-1 group-hover/button:bg-white/25">
              <ArrowRight size={16} />
            </span>
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default ShopProductCard;


