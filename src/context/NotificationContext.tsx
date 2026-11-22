import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Notification } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

type NotificationContextValue = {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setError(null);
    if (!supabase || !user?.id) {
      setNotifications([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error: qErr } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (qErr) throw qErr;
      const rows = (data ?? []) as Record<string, unknown>[];
      setNotifications(
        rows.map((row) => ({
          id: String(row.id),
          userId: String(row.user_id ?? ''),
          type: (String(row.type ?? 'system') as Notification['type']),
          title: String(row.title ?? ''),
          message: String(row.body ?? row.message ?? ''),
          isRead: Boolean(row.is_read),
          createdAt: String(row.created_at ?? new Date().toISOString()),
          data: row.data as Notification['data'],
        })),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    if (!supabase || !user?.id) return;

    const sb = supabase;
    const channel = sb
      .channel(`notifications:${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        () => {
          void refetch();
        },
      )
      .subscribe();

    return () => {
      void sb.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const markAsRead = async (id: string) => {
    setError(null);
    if (!supabase) return;
    const { error: uErr } = await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    if (uErr) setError(uErr.message);
    await refetch();
  };

  const markAllAsRead = async () => {
    setError(null);
    if (!supabase || !user?.id) return;
    const { error: uErr } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
    if (uErr) setError(uErr.message);
    await refetch();
  };

  const deleteNotification = async (id: string) => {
    setError(null);
    if (!supabase) return;
    const { error: dErr } = await supabase.from('notifications').delete().eq('id', id);
    if (dErr) setError(dErr.message);
    await refetch();
  };

  const unreadCount = useMemo(() => notifications.filter((n: any) => !(n.isRead ?? n.is_read)).length, [notifications]);

  const value = useMemo<NotificationContextValue>(
    () => ({
      notifications,
      unreadCount,
      loading,
      error,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      refetch,
    }),
    [notifications, unreadCount, loading, error],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = (): NotificationContextValue => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within a NotificationProvider');
  return ctx;
};

