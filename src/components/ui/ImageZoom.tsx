import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
  zoomScale?: number;
  children?: React.ReactNode;
}

const ImageZoom: React.FC<ImageZoomProps> = ({
  src,
  alt,
  className = '',
  zoomScale = 1.5,
  children
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {children || (
        <motion.img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          animate={{
            scale: isHovered ? zoomScale : 1,
            x: isHovered ? (mousePosition.x - 50) * 0.1 : 0,
            y: isHovered ? (mousePosition.y - 50) * 0.1 : 0,
          }}
          transition={{
            duration: 0.3,
            ease: 'easeOut'
          }}
          style={{
            transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
          }}
        />
      )}
    </div>
  );
};

export default ImageZoom;


































































