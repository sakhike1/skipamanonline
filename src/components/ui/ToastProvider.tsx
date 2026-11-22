import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  toasts: Toast[];
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success', duration: number = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, message, type, duration };
    
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-white" />;
      case 'error':
        return <XCircle size={20} className="text-white" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-white" />;
      case 'info':
        return <Info size={20} className="text-white" />;
    }
  };

  const getBgColor = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
        return 'bg-blue-500';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, toasts }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, x: 100 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="pointer-events-auto"
            >
              <div
                className={`${getBgColor(toast.type)} text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 min-w-[300px] max-w-md`}
              >
                {getIcon(toast.type)}
                <p className="flex-1 font-medium text-sm">{toast.message}</p>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="hover:bg-white/20 rounded-full p-1 transition-colors"
                  aria-label="Close notification"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

