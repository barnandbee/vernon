'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const DEMO_CREDENTIALS = {
  email: 'demo@vernon.app',
  password: 'demo1234',
};

const DEMO_USER: User = {
  id: 'demo-user',
  name: 'Jamie Rivera',
  email: DEMO_CREDENTIALS.email,
  role: 'Member · Demo Account',
};

function userFromEmail(email: string): User {
  const namePart = email.split('@')[0].replace(/[._-]+/g, ' ').trim();
  const name = namePart
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ') || 'Explorer';

  return {
    id: `user-${email.toLowerCase()}`,
    name,
    email,
    role: 'Member',
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('vernon_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) return false;

    const isDemoAccount =
      email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
      password === DEMO_CREDENTIALS.password;

    const loggedInUser = isDemoAccount ? DEMO_USER : userFromEmail(email.trim());

    setUser(loggedInUser);
    localStorage.setItem('vernon_user', JSON.stringify(loggedInUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vernon_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
