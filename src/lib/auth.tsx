'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  accountType: 'member' | 'org_staff';
  orgName?: string;
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

export const ORG_DEMO_CREDENTIALS = {
  email: 'org@vernon.app',
  password: 'org1234',
};

const DEMO_USER: User = {
  id: 'demo-user',
  name: 'Jamie Rivera',
  email: DEMO_CREDENTIALS.email,
  role: 'Member · Demo Account',
  accountType: 'member',
};

const ORG_DEMO_USER: User = {
  id: 'org-staff-demo',
  name: 'Priya Anand',
  email: ORG_DEMO_CREDENTIALS.email,
  role: 'Programme Lead · Lighthouse Partners',
  accountType: 'org_staff',
  orgName: 'Lighthouse Partners',
};

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

    const normalizedEmail = email.trim().toLowerCase();

    const isDemoAccount =
      normalizedEmail === DEMO_CREDENTIALS.email &&
      password === DEMO_CREDENTIALS.password;

    const isOrgDemoAccount =
      normalizedEmail === ORG_DEMO_CREDENTIALS.email &&
      password === ORG_DEMO_CREDENTIALS.password;

    if (!isDemoAccount && !isOrgDemoAccount) return false;

    const loggedInUser = isOrgDemoAccount ? ORG_DEMO_USER : DEMO_USER;

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
