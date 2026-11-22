import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

interface ModernDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
}

const ModernDropdown: React.FC<ModernDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Choose an option',
  label,
  required = false,
  className = '',
  labelClassName = 'text-gray-800'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const selectedOption = options && options.length > 0 ? options.find(opt => opt === value) || null : null;

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {label && (
        <label className={`block text-lg font-bold flex items-center mb-3 ${labelClassName}`}>
          {required && <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-6 py-5 bg-white/90 backdrop-blur-sm border border-slate-200/70 rounded-2xl 
          text-left flex items-center justify-between
          transition-all duration-300 cursor-pointer
          ${isOpen 
            ? 'border-slate-400 shadow-xl bg-white' 
            : 'border-slate-200/70 hover:border-slate-300 shadow-lg hover:shadow-xl'
          }
          ${selectedOption ? 'text-black' : 'text-gray-500'}
        `}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <span className={`text-lg font-medium ${selectedOption ? 'text-black' : 'text-gray-400'}`}>
          {selectedOption || placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={20} className="text-gray-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[9998] bg-transparent"
              style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
            />

            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute z-[9999] w-full mt-2 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden"
            >
              <div className="max-h-64 overflow-y-auto">
                {options && options.length > 0 ? options.map((option, index) => {
                  const isSelected = value === option;
                  return (
                    <motion.button
                      key={option}
                      type="button"
                      onClick={() => {
                        onChange(option);
                        setIsOpen(false);
                      }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className={`w-full px-6 py-4 text-left flex items-center justify-between
                        transition-all duration-200
                        ${isSelected
                          ? 'bg-black text-white'
                          : 'hover:bg-gray-50 text-black'
                        }
                        ${index !== options.length - 1 ? 'border-b border-gray-100' : ''}
                      `}
                      whileHover={{ x: 4 }}
                    >
                      <span className={`font-medium text-base ${isSelected ? 'text-white' : 'text-black'}`}>
                        {option}
                      </span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        >
                          <Check size={18} className="text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                }) : (
                  <div className="px-6 py-4 text-center text-gray-500">
                    No options available
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModernDropdown;

