import React, { createContext, useContext, useState, useCallback } from 'react';

export type UserRole = 'user' | 'vendor';

type AuthContextType = {
  isAuthenticated: boolean;
  userRole: UserRole;
  login: (role?: UserRole) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('user');

  const login = useCallback((role: UserRole = 'user') => {
    setUserRole(role);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUserRole('user');
    // TODO: Clear stored token / user (e.g. AsyncStorage) when integrated
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
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
