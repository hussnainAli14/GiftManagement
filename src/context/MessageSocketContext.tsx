import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { API_ORIGIN } from '../api/config';
import { tokenStorage } from '../api/storage';
import { useAuth } from './AuthContext';

type MessageSocketContextValue = {
  socket: Socket | null;
  connected: boolean;
};

const MessageSocketContext = createContext<MessageSocketContextValue>({
  socket: null,
  connected: false,
});

export const MessageSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isHydrating, user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || isHydrating || !user?.id) {
      setSocket((prev) => {
        prev?.disconnect();
        return null;
      });
      setConnected(false);
      return;
    }

    const token = tokenStorage.getToken();
    if (!token) {
      setConnected(false);
      return;
    }

    const s = io(API_ORIGIN, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 12,
      reconnectionDelay: 1500,
    });

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    s.on('connect', onConnect);
    s.on('disconnect', onDisconnect);
    setSocket(s);

    return () => {
      s.off('connect', onConnect);
      s.off('disconnect', onDisconnect);
      s.disconnect();
      setConnected(false);
      setSocket(null);
    };
  }, [isAuthenticated, isHydrating, user?.id]);

  const value = useMemo(() => ({ socket, connected }), [socket, connected]);

  return (
    <MessageSocketContext.Provider value={value}>{children}</MessageSocketContext.Provider>
  );
};

export function useMessageSocket(): MessageSocketContextValue {
  return useContext(MessageSocketContext);
}
