import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';
import { getNotificationsApi } from '../api/notificationApi';
import { useAuth } from './AuthContext';
import { useMessageSocket } from './MessageSocketContext';

type Ctx = {
  unreadCount: number;
  refresh: () => Promise<void>;
};

const NotificationBadgeContext = createContext<Ctx>({ unreadCount: 0, refresh: async () => {} });

export const NotificationBadgeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isHydrating } = useAuth();
  const { socket } = useMessageSocket();
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!user?.id) {
      setUnreadCount(0);
      return;
    }
    try {
      const list = await getNotificationsApi(user.id);
      setUnreadCount(list.filter((n) => !n.read).length);
    } catch {
      // Keep previous value to avoid flicker when offline
    }
  }, [user?.id]);

  // Initial load + when user changes
  useEffect(() => {
    if (!isAuthenticated || isHydrating) {
      setUnreadCount(0);
      return;
    }
    refresh();
  }, [isAuthenticated, isHydrating, refresh]);

  // Refresh when app returns to foreground
  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') {
        refresh();
      }
    });
    return () => sub.remove();
  }, [refresh]);

  // Refresh when a message arrives via socket (backend also creates a Notification doc)
  useEffect(() => {
    if (!socket) return;
    const handler = () => {
      refresh();
    };
    socket.on('new_message', handler);
    return () => {
      socket.off('new_message', handler);
    };
  }, [socket, refresh]);

  const value = useMemo(() => ({ unreadCount, refresh }), [unreadCount, refresh]);

  return <NotificationBadgeContext.Provider value={value}>{children}</NotificationBadgeContext.Provider>;
};

export function useNotificationBadge(): Ctx {
  return useContext(NotificationBadgeContext);
}

