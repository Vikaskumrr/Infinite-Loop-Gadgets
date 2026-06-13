import React from 'react';
import { AuthContext, type AuthContextValue } from './AuthContextValue';
import { authService } from './authService';
import type { AuthSession } from './types';

const STORAGE_KEY = 'ilg.auth';

const readStoredSession = (): AuthSession | null => {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) as AuthSession : null;
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = React.useState<AuthSession | null>(() => readStoredSession());
  const [loading, setLoading] = React.useState(false);

  const persistSession = React.useCallback((nextSession: AuthSession | null) => {
    setSession(nextSession);
    if (nextSession) localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
    else localStorage.removeItem(STORAGE_KEY);
  }, []);

  const login = React.useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      persistSession(await authService.login({ email, password }));
    } finally {
      setLoading(false);
    }
  }, [persistSession]);

  const register = React.useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      persistSession(await authService.register({ name, email, password }));
    } finally {
      setLoading(false);
    }
  }, [persistSession]);

  const logout = React.useCallback(() => persistSession(null), [persistSession]);

  const value = React.useMemo<AuthContextValue>(() => ({
    user: session?.user || null,
    token: session?.token || null,
    loading,
    login,
    register,
    logout,
  }), [loading, login, logout, register, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
