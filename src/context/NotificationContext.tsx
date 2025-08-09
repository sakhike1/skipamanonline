import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { Notification, NotificationType } from '../types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

type NotificationAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'DELETE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ERROR' };

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_NOTIFICATIONS':
      return { 
        ...state, 
        notifications: action.payload,
        unreadCount: action.payload.filter(n => !n.isRead).length
      };
    case 'ADD_NOTIFICATION':
      return { 
        ...state, 
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + (action.payload.isRead ? 0 : 1)
      };
    case 'MARK_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, isRead: true }
            : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      };
    case 'MARK_ALL_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification => ({
          ...notification,
          isRead: true
        })),
        unreadCount: 0
      };
    case 'DELETE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload),
        unreadCount: state.notifications.find(n => n.id === action.payload)?.isRead === false 
          ? Math.max(0, state.unreadCount - 1) 
          : state.unreadCount
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

interface NotificationContextType extends NotificationState {
  // Notification Management
  getNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  
  // Real-time Notifications
  subscribeToNotifications: () => void;
  unsubscribeFromNotifications: () => void;
  
  // Email Notifications
  updateEmailPreferences: (preferences: {
    orderUpdates: boolean;
    promotions: boolean;
    newsletter: boolean;
    productRecommendations: boolean;
  }) => Promise<void>;
  
  // Push Notifications
  requestPushPermission: () => Promise<boolean>;
  sendPushNotification: (title: string, body: string, data?: any) => Promise<void>;
  
  // Utility Functions
  getNotificationIcon: (type: NotificationType) => string;
  getNotificationColor: (type: NotificationType) => string;
  formatNotificationTime: (date: string) => string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const [wsConnection, setWsConnection] = React.useState<WebSocket | null>(null);

  // API Base URL
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  // Get notifications
  const getNotifications = async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await fetch(`${API_BASE}/notifications`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const notifications: Notification[] = await response.json();
      dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch notifications';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string): Promise<void> => {
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await fetch(`${API_BASE}/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      dispatch({ type: 'MARK_AS_READ', payload: notificationId });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark notification as read';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async (): Promise<void> => {
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await fetch(`${API_BASE}/notifications/read-all`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }

      dispatch({ type: 'MARK_ALL_AS_READ' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark all notifications as read';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId: string): Promise<void> => {
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await fetch(`${API_BASE}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }

      dispatch({ type: 'DELETE_NOTIFICATION', payload: notificationId });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete notification';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Subscribe to real-time notifications
  const subscribeToNotifications = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:3001';
    const ws = new WebSocket(`${wsUrl}/notifications?token=${token}`);

    ws.onopen = () => {
      console.log('Connected to notification WebSocket');
    };

    ws.onmessage = (event) => {
      try {
        const notification: Notification = JSON.parse(event.data);
        dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
        
        // Show browser notification if permission granted
        if (Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: notification.id,
          });
        }
      } catch (error) {
        console.error('Error parsing notification:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('Disconnected from notification WebSocket');
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        subscribeToNotifications();
      }, 5000);
    };

    setWsConnection(ws);
  }, []);

  // Unsubscribe from notifications
  const unsubscribeFromNotifications = useCallback(() => {
    if (wsConnection) {
      wsConnection.close();
      setWsConnection(null);
    }
  }, [wsConnection]);

  // Update email preferences
  const updateEmailPreferences = async (preferences: {
    orderUpdates: boolean;
    promotions: boolean;
    newsletter: boolean;
    productRecommendations: boolean;
  }): Promise<void> => {
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await fetch(`${API_BASE}/notifications/email-preferences`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error('Failed to update email preferences');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update email preferences';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Request push notification permission
  const requestPushPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  };

  // Send push notification
  const sendPushNotification = async (title: string, body: string, data?: any): Promise<void> => {
    if (Notification.permission !== 'granted') {
      const granted = await requestPushPermission();
      if (!granted) {
        throw new Error('Push notification permission denied');
      }
    }

    try {
      const response = await fetch(`${API_BASE}/notifications/push`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ title, body, data }),
      });

      if (!response.ok) {
        throw new Error('Failed to send push notification');
      }
    } catch (error) {
      console.error('Error sending push notification:', error);
      throw error;
    }
  };

  // Utility functions
  const getNotificationIcon = (type: NotificationType): string => {
    switch (type) {
      case 'order_confirmation':
        return '📦';
      case 'order_shipped':
        return '🚚';
      case 'order_delivered':
        return '✅';
      case 'low_stock':
        return '⚠️';
      case 'price_drop':
        return '💰';
      case 'back_in_stock':
        return '🔄';
      case 'promotion':
        return '🎉';
      case 'system':
        return '🔔';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type: NotificationType): string => {
    switch (type) {
      case 'order_confirmation':
        return 'text-blue-600 bg-blue-100';
      case 'order_shipped':
        return 'text-indigo-600 bg-indigo-100';
      case 'order_delivered':
        return 'text-green-600 bg-green-100';
      case 'low_stock':
        return 'text-yellow-600 bg-yellow-100';
      case 'price_drop':
        return 'text-green-600 bg-green-100';
      case 'back_in_stock':
        return 'text-blue-600 bg-blue-100';
      case 'promotion':
        return 'text-purple-600 bg-purple-100';
      case 'system':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatNotificationTime = (date: string): string => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  // Initialize notifications and WebSocket connection
  useEffect(() => {
    getNotifications();
    subscribeToNotifications();

    return () => {
      unsubscribeFromNotifications();
    };
  }, [subscribeToNotifications, unsubscribeFromNotifications]);

  const value: NotificationContextType = {
    ...state,
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    subscribeToNotifications,
    unsubscribeFromNotifications,
    updateEmailPreferences,
    requestPushPermission,
    sendPushNotification,
    getNotificationIcon,
    getNotificationColor,
    formatNotificationTime,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 