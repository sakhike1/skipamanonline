import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface HeaderLogoProps {
  textColor: string;
  isDarkPage: boolean;
}

export const HeaderLogo: React.FC<HeaderLogoProps> = ({ textColor, isDarkPage }) => {
  return (
    <motion.div
      className="text-3xl font-black"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link to="/" className="group relative" aria-label="SkipaMan Home">
        <span className={`tracking-tighter ${textColor}`}>SKIPA</span>
        <span className={`relative tracking-tighter ${textColor}`}>
          MAN
          <span
            className={`absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full ${
              isDarkPage ? 'bg-white' : 'bg-black'
            }`}
          />
        </span>
      </Link>
    </motion.div>
  );
};
