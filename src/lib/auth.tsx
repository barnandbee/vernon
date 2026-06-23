'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DIAGNOSTIC_PENDING_SESSION_KEY } from './diagnostic';
import type { AdminLevel } from './permissions';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  accountType: 'member' | 'org_staff' | 'coach' | 'platform_admin';
  orgName?: string;
  avatar?: string;
  adminLevel?: AdminLevel;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<Pick<User, 'name' | 'email'>>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const DEMO_CREDENTIALS = {
  email: 'demo@vernon.app',
  password: '1nsects',
};

export const ORG_DEMO_CREDENTIALS = {
  email: 'org@vernon.app',
  password: 'o1lbeetle',
};

export const COACH_DEMO_CREDENTIALS = {
  email: 'coach@vernon.app',
  password: 'caterp1llar',
};

export const ADMIN_DEMO_CREDENTIALS = {
  email: 'admin@vernon.app',
  password: 'dr4gonfly',
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

const COACH_DEMO_USER: User = {
  id: 'coach-demo',
  name: 'Sarah Mitchell',
  email: COACH_DEMO_CREDENTIALS.email,
  role: 'Career Coach · Demo Account',
  accountType: 'coach',
};

const ADMIN_DEMO_USER: User = {
  id: 'admin-demo',
  name: 'Jordan Blake',
  email: ADMIN_DEMO_CREDENTIALS.email,
  role: 'Platform Admin · Demo Account',
  accountType: 'platform_admin',
  adminLevel: 'super_admin',
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

    const isCoachAccount =
      normalizedEmail === COACH_DEMO_CREDENTIALS.email &&
      password === COACH_DEMO_CREDENTIALS.password;

    const isAdminAccount =
      normalizedEmail === ADMIN_DEMO_CREDENTIALS.email &&
      password === ADMIN_DEMO_CREDENTIALS.password;

    if (!isDemoAccount && !isOrgDemoAccount && !isCoachAccount && !isAdminAccount) return false;

    const loggedInUser = isOrgDemoAccount ? ORG_DEMO_USER : isCoachAccount ? COACH_DEMO_USER : isAdminAccount ? ADMIN_DEMO_USER : DEMO_USER;

    setUser(loggedInUser);
    localStorage.setItem('vernon_user', JSON.stringify(loggedInUser));
    if (loggedInUser.accountType === 'member') {
      // Demo behaviour: re-run the Vernon Insights diagnostic on every login,
      // not just the first, so it's easy to showcase the flow repeatedly.
      sessionStorage.setItem(DIAGNOSTIC_PENDING_SESSION_KEY, 'true');
    }
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vernon_user');
  };

  const updateUser = (updates: Partial<Pick<User, 'name' | 'email'>>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem('vernon_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
