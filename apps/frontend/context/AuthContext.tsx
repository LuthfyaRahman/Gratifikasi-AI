'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { login as apiLogin } from '@/lib/api';
import { decodeToken, getStoredToken, setStoredToken, removeStoredToken } from '@/lib/auth';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      try {
        setUser(decodeToken(token));
      } catch {
        removeStoredToken();
      }
    }
    setLoading(false);
  }, []);

  async function login(username: string, password: string) {
    const data = await apiLogin(username, password);
    const token = data.token;
    setStoredToken(token);
    const decoded = decodeToken(token);
    setUser(decoded);
  }

  function logout() {
    removeStoredToken();
    setUser(null);
    window.location.href = '/login';
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
