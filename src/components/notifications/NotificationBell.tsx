import React, { useState } from 'react';
import { useAuth } from '../../context/useAuth';
import { useNotifications } from '../../context/NotificationContext';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import NotificationCenter from './NotificationCenter';

const notificationsEnabled = import.meta.env.VITE_NOTIFICATIONS_ENABLED !== 'false';

const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const { unreadCount, loading, refetch } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const handleBellClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    void refetch();
  };

  if (!user || !notificationsEnabled) return null;

  return (
    <>
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBellClick}
          className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-lg"
          disabled={loading}
        >
          <Bell className="h-6 w-6" />

          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.span>
          )}

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600" />
            </div>
          )}
        </motion.button>
      </div>

      <NotificationCenter isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export default NotificationBell;
