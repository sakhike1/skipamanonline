import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import socketService from '../../services/socket';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  XCircle, 
  X,
  Package,
  Truck,
  Bell
} from 'lucide-react';

interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'order_update' | 'admin_message';
  title: string;
  message: string;
  timestamp: string;
  duration?: number; // Auto-dismiss duration in ms
  actionUrl?: string;
}

interface ToastContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxNotifications?: number;
}

const ToastNotification: React.FC<ToastContainerProps> = ({ 
  position = 'top-right',
  maxNotifications = 5
}) => {
  const { user, isAuthenticated } = useAuth();
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Listen for order updates
    const handleOrderUpdate = (data: any) => {
      addToast({
        id: `order-${data.orderId}-${Date.now()}`,
        type: 'order_update',
        title: 'Order Update',
        message: data.message || `Order ${data.orderNumber} status updated`,
        timestamp: data.timestamp || new Date().toISOString(),
        duration: 8000,
        actionUrl: `/orders/${data.orderId}`
      });
    };

    // Listen for new notifications
    const handleNewNotification = (data: any) => {
      addToast({
        id: `notification-${data.id}`,
        type: data.type === 'admin_message' ? 'admin_message' : 'info',
        title: data.title || 'New Notification',
        message: data.message,
        timestamp: data.createdAt || new Date().toISOString(),
        duration: 6000
      });
    };

    // Listen for admin broadcasts
    const handleAdminBroadcast = (data: any) => {
      addToast({
        id: `admin-broadcast-${Date.now()}`,
        type: 'admin_message',
        title: data.title || 'Admin Message',
        message: data.message,
        timestamp: data.timestamp || new Date().toISOString(),
        duration: data.priority === 'urgent' ? 12000 : 8000
      });
    };

    socketService.onOrderUpdate(handleOrderUpdate);
    socketService.onNewNotification(handleNewNotification);
    socketService.onAdminBroadcast(handleAdminBroadcast);

    return () => {
      socketService.offOrderUpdate(handleOrderUpdate);
      socketService.offNewNotification(handleNewNotification);
      socketService.offAdminBroadcast(handleAdminBroadcast);
    };
  }, [isAuthenticated, user]);

  const addToast = (toast: ToastNotification) => {
    setToasts(prev => {
      const newToasts = [toast, ...prev].slice(0, maxNotifications);
      return newToasts;
    });

    // Auto-dismiss after duration
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        removeToast(toast.id);
      }, toast.duration);
    }
  };

  const removeToast = (toastId: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== toastId));
  };

  const getToastIcon = (type: string) => {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'error':
        return XCircle;
      case 'warning':
        return AlertTriangle;
      case 'order_update':
        return Package;
      case 'admin_message':
        return Bell;
      default:
        return Info;
    }
  };

  const getToastColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'order_update':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'admin_message':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'order_update':
        return 'text-blue-500';
      case 'admin_message':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  if (!isAuthenticated || toasts.length === 0) {
    return null;
  }

  return (
    <div className={`fixed ${getPositionClasses()} z-50 space-y-2 max-w-sm`}>
      <AnimatePresence>
        {toasts.map((toast, index) => {
          const Icon = getToastIcon(toast.type);
          
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: position.includes('right') ? 300 : -300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: position.includes('right') ? 300 : -300, scale: 0.8 }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
              className={`border rounded-lg shadow-lg p-4 ${getToastColor(toast.type)}`}
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 ${getIconColor(toast.type)}`}>
                  <Icon className="h-5 w-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium">
                    {toast.title}
                  </h4>
                  <p className="text-sm mt-1 opacity-90">
                    {toast.message}
                  </p>
                  <p className="text-xs mt-1 opacity-75">
                    {new Date(toast.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                
                <button
                  onClick={() => removeToast(toast.id)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              {/* Progress bar for auto-dismiss */}
              {toast.duration && toast.duration > 0 && (
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-current opacity-30 rounded-b-lg"
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: toast.duration / 1000, ease: 'linear' }}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ToastNotification;
