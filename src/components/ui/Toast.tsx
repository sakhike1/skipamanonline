import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { ToastType } from '../../hooks/useToast';

interface ToastProps {
  show: boolean;
  message: string;
  type: ToastType;
  onClose?: () => void;
}

/**
 * Reusable Toast notification component
 * Displays success, error, warning, or info messages
 */
export const Toast: React.FC<ToastProps> = ({ show, message, type, onClose }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="flex-shrink-0" />;
      case 'error':
        return <AlertCircle size={20} className="flex-shrink-0" />;
      case 'warning':
        return <AlertCircle size={20} className="flex-shrink-0" />;
      case 'info':
        return <CheckCircle size={20} className="flex-shrink-0" />;
      default:
        return null;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-4 right-4 z-50"
          onClick={onClose}
        >
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg max-w-sm cursor-pointer ${getBackgroundColor()}`}>
            {getIcon()}
            <p className="text-sm font-medium">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

