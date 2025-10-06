import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import socketService from '../../services/socket';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XCircle, 
  X, 
  ExternalLink,
  Bell,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminNotification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: string;
  actionRequired?: boolean;
  actionUrl?: string;
  persistent?: boolean;
}

const AdminNotificationBanner: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [dismissedNotifications, setDismissedNotifications] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Load dismissed notifications from localStorage
    const dismissed = localStorage.getItem('dismissedAdminNotifications');
    if (dismissed) {
      setDismissedNotifications(new Set(JSON.parse(dismissed)));
    }

    // Listen for admin broadcasts
    const handleAdminBroadcast = (data: AdminNotification) => {
      setNotifications(prev => {
        // Don't add if already dismissed
        if (dismissedNotifications.has(data.id)) return prev;
        
        // Add to beginning of array (most recent first)
        return [data, ...prev];
      });
    };

    // Listen for system announcements
    const handleSystemAnnouncement = (data: AdminNotification) => {
      setNotifications(prev => {
        // Don't add if already dismissed
        if (dismissedNotifications.has(data.id)) return prev;
        
        // Add to beginning of array (most recent first)
        return [data, ...prev];
      });
    };

    socketService.onAdminBroadcast(handleAdminBroadcast);
    socketService.onSystemAnnouncement(handleSystemAnnouncement);

    return () => {
      socketService.offAdminBroadcast(handleAdminBroadcast);
      socketService.offSystemAnnouncement(handleSystemAnnouncement);
    };
  }, [isAuthenticated, user, dismissedNotifications]);

  const dismissNotification = (notificationId: string, persistent: boolean = false) => {
    if (!persistent) {
      // Add to dismissed set
      const newDismissed = new Set(dismissedNotifications);
      newDismissed.add(notificationId);
      setDismissedNotifications(newDismissed);
      
      // Save to localStorage
      localStorage.setItem('dismissedAdminNotifications', JSON.stringify(Array.from(newDismissed)));
    }

    // Remove from notifications
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return Info;
      case 'warning':
        return AlertTriangle;
      case 'success':
        return CheckCircle;
      case 'error':
        return XCircle;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'urgent') {
      return 'bg-red-600 text-white border-red-700';
    }
    
    switch (type) {
      case 'info':
        return 'bg-blue-600 text-white border-blue-700';
      case 'warning':
        return 'bg-yellow-600 text-white border-yellow-700';
      case 'success':
        return 'bg-green-600 text-white border-green-700';
      case 'error':
        return 'bg-red-600 text-white border-red-700';
      default:
        return 'bg-purple-600 text-white border-purple-700';
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'urgent') {
      return <Zap className="h-4 w-4 text-yellow-300 animate-pulse" />;
    }
    return null;
  };

  if (!isAuthenticated || notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <AnimatePresence>
        {notifications.map((notification, index) => {
          const Icon = getNotificationIcon(notification.type);
          const isUrgent = notification.priority === 'urgent';
          
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
              className={`relative border-l-4 shadow-lg ${getNotificationColor(notification.type, notification.priority)}`}
            >
              <div className="px-4 py-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium">
                          {notification.title}
                        </h3>
                        {getPriorityIcon(notification.priority)}
                        {notification.actionRequired && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white bg-opacity-20">
                            Action Required
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm opacity-90">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-xs opacity-75">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                      {notification.actionUrl && (
                        <div className="mt-2">
                          <Link
                            to={notification.actionUrl}
                            className="inline-flex items-center text-sm font-medium hover:underline"
                          >
                            Take Action
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!notification.persistent && (
                      <button
                        onClick={() => dismissNotification(notification.id, notification.persistent)}
                        className="text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Urgent notification pulsing border */}
              {isUrgent && (
                <div className="absolute inset-0 border-2 border-yellow-300 animate-pulse rounded-sm pointer-events-none" />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default AdminNotificationBanner;
