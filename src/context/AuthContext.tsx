import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { tokenStorage } from '../api/storage';

export type UserRole = 'user' | 'vendor';
export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  isApproved?: boolean;
};

type AuthContextType = {
  isAuthenticated: boolean;
  userRole: UserRole;
  user: AuthUser | null;
  /** False once persisted session has been read (or failed). Root UI should wait for this. */
  isHydrating: boolean;
  login: (payload: { token: string; user: AuthUser }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isHydrating, setIsHydrating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const session = await tokenStorage.restoreSession();
      if (cancelled) return;
      if (session) {
        setUser(session.user);
        setUserRole(session.user.role?.toLowerCase() === 'vendor' ? 'vendor' : 'user');
        setIsAuthenticated(true);
      }
      setIsHydrating(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (payload: { token: string; user: AuthUser }) => {
    await tokenStorage.persistSession(payload.token, payload.user);
    setUser(payload.user);
    setUserRole(payload.user.role?.toLowerCase() === 'vendor' ? 'vendor' : 'user');
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    await tokenStorage.clearSession();
    setUser(null);
    setIsAuthenticated(false);
    setUserRole('user');
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userRole, user, isHydrating, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
