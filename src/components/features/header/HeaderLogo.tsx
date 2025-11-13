import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface HeaderLogoProps {
  textColor: string;
  isDarkPage: boolean;
  isScrolled: boolean;
}

export const HeaderLogo: React.FC<HeaderLogoProps> = ({ textColor, isDarkPage, isScrolled }) => {
  return (
    <motion.div 
      className="text-3xl font-black"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link 
        to="/" 
        className="relative group"
        aria-label="SkipaMan Home"
      >
        <span className={`tracking-tighter ${textColor} [text-shadow:0px_0px_1px_rgba(255,255,255,0.5)]`}>
          SKIPA
        </span>
        <span className={`tracking-tighter relative ${textColor} [text-shadow:0px_0px_1px_rgba(255,255,255,0.5)]`}>
          MAN
          <span 
            className={`absolute left-0 bottom-0 h-0.5 ${
              isDarkPage && !isScrolled ? 'bg-white' : 'bg-black'
            } w-0 group-hover:w-full transition-all duration-300`}
          />
        </span>
        <motion.span 
          className="absolute -inset-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 group-hover:opacity-100 blur-sm"
          initial={{ x: -100 }}
          animate={{ x: 100 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </Link>
    </motion.div>
  );
};

