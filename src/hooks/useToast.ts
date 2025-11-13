import { useState, useEffect } from 'react';
import { TOAST_DURATION } from '../utils/constants';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastState {
  show: boolean;
  message: string;
  type: ToastType;
}

interface UseToastReturn {
  toast: ToastState;
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
}

/**
 * Custom hook for toast notifications
 * Manages toast state and auto-hide functionality
 */
export const useToast = (duration: number = TOAST_DURATION): UseToastReturn => {
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success',
  });

  const hideToast = () => {
    setToast({
      show: false,
      message: '',
      type: 'success',
    });
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [toast.show, duration]);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({
      show: true,
      message,
      type,
    });
  };

  return {
    toast,
    showToast,
    hideToast,
  };
};
