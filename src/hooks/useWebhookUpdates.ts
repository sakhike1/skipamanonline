import { useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import webhookHandler from '../services/webhookHandler';

export const useWebhookUpdates = () => {
  const { user } = useAuth();

  // Join user room when user is authenticated
  useEffect(() => {
    if (user?.id) {
      webhookHandler.joinUserRoom(user.id);
    }

    return () => {
      if (user?.id) {
        webhookHandler.leaveUserRoom(user.id);
      }
    };
  }, [user?.id]);

  // Subscribe to order updates
  const onOrderUpdate = useCallback((callback: (data: any) => void) => {
    webhookHandler.on('orderUpdate', callback);
    return () => webhookHandler.off('orderUpdate', callback);
  }, []);

  // Subscribe to payment updates
  const onPaymentUpdate = useCallback((callback: (data: any) => void) => {
    webhookHandler.on('paymentUpdate', callback);
    return () => webhookHandler.off('paymentUpdate', callback);
  }, []);

  // Subscribe to support updates
  const onSupportUpdate = useCallback((callback: (data: any) => void) => {
    webhookHandler.on('supportUpdate', callback);
    return () => webhookHandler.off('supportUpdate', callback);
  }, []);

  return {
    onOrderUpdate,
    onPaymentUpdate,
    onSupportUpdate
  };
};
