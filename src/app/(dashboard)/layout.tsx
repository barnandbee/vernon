'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { normalizePathname } from '@/lib/utils';
import { DIAGNOSTIC_PENDING_SESSION_KEY, getDiagnosticAnswers, saveDiagnosticAnswers } from '@/lib/diagnostic';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';
import DiagnosticModal from '@/components/DiagnosticModal';

const ORG_STAFF_ROUTES = ['/dashboard', '/dashboard/reports', '/dashboard/profile'];
const COACH_ROUTES = ['/dashboard', '/dashboard/clients', '/dashboard/schedule', '/dashboard/resources', '/dashboard/development', '/dashboard/profile'];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = normalizePathname(usePathname());
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  // Member accounts complete the Vernon Insights diagnostic once per login.
  useEffect(() => {
    if (isLoading || !user || user.accountType !== 'member') return;
    if (sessionStorage.getItem(DIAGNOSTIC_PENDING_SESSION_KEY) === 'true') {
      setShowDiagnostic(true);
      sessionStorage.removeItem(DIAGNOSTIC_PENDING_SESSION_KEY);
    }
  }, [user, isLoading]);

  // Organisation staff only have access to the aggregate dashboard, and
  // coaches only have access to their coaching-focused set of pages.
  useEffect(() => {
    if (isLoading) return;
    if (user?.accountType === 'org_staff' && !ORG_STAFF_ROUTES.includes(pathname)) {
      router.replace('/dashboard');
    } else if (user?.accountType === 'coach' && !COACH_ROUTES.includes(pathname)) {
      router.replace('/dashboard');
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--primary)' }} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top nav */}
        <div className="md:hidden">
          <MobileNav />
        </div>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {showDiagnostic && (
        <DiagnosticModal
          initialAnswers={getDiagnosticAnswers()}
          onComplete={(answers) => {
            saveDiagnosticAnswers(answers);
            setShowDiagnostic(false);
          }}
        />
      )}
    </div>
  );
}
