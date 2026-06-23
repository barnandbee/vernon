'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import {
  ADMIN_LEVELS, CAPABILITY_LABELS, hasCapability, type AdminLevel, type AdminCapability,
} from '@/lib/permissions';
import { getPlatformUsers, updatePlatformUser, type PlatformUser } from '@/lib/platformUsers';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

const CAPABILITIES = Object.keys(CAPABILITY_LABELS) as AdminCapability[];

const inputStyle = { background: 'var(--surface-muted)', borderColor: 'var(--border)', color: 'var(--foreground)' };

export default function AdminPermissionsPage() {
  const { user } = useAuth();
  const canManage = hasCapability(user?.adminLevel, 'manage_permissions');

  const [admins, setAdmins] = useState<PlatformUser[]>([]);

  useEffect(() => {
    setAdmins(getPlatformUsers().filter((u) => u.accountType === 'platform_admin'));
  }, []);

  const changeLevel = (id: string, level: AdminLevel) => {
    if (!canManage) return;
    const updated = updatePlatformUser(id, { adminLevel: level });
    setAdmins(updated.filter((u) => u.accountType === 'platform_admin'));
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-playwrite" style={{ color: 'var(--foreground)' }}>Permissions</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Manage the admin permission levels and what each one is allowed to do.
        </p>
      </div>

      {!canManage && (
        <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: '#fffbeb' }}>
          <ShieldAlert size={18} style={{ color: '#a16207' }} className="flex-shrink-0" />
          <p className="text-sm" style={{ color: '#a16207' }}>
            Your permission level is read-only here — only a Super Admin can reassign admin levels.
          </p>
        </div>
      )}

      {/* Levels overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ADMIN_LEVELS.map((level) => (
          <div key={level.value} className="rounded-2xl p-4" style={{ background: 'var(--surface)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: '#fdf2f8' }}>
              <ShieldCheck size={16} style={{ color: '#be185d' }} />
            </div>
            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--foreground)' }}>{level.label}</p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{level.description}</p>
          </div>
        ))}
      </div>

      {/* Capability matrix */}
      <div>
        <h2 className="text-sm font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
          Capability Matrix
        </h2>
        <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
          <div className="space-y-2">
            {CAPABILITIES.map((cap) => (
              <div key={cap} className="flex items-center gap-3 p-3 rounded-xl flex-wrap" style={{ background: 'var(--surface-muted)' }}>
                <p className="text-sm font-semibold flex-1 min-w-[180px]" style={{ color: 'var(--foreground)' }}>
                  {CAPABILITY_LABELS[cap]}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {ADMIN_LEVELS.map((level) => {
                    const has = hasCapability(level.value, cap);
                    return (
                      <span
                        key={level.value}
                        className="text-xs px-2 py-1 rounded-lg font-medium"
                        style={has ? { background: '#f0fdf4', color: '#15803d' } : { background: 'var(--surface)', color: 'var(--text-muted)' }}
                      >
                        {level.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Admin accounts */}
      <div>
        <h2 className="text-sm font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
          Admin Accounts
        </h2>
        <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
          <div className="space-y-2">
            {admins.map((a) => (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl flex-wrap" style={{ background: 'var(--surface-muted)' }}>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: 'var(--primary)' }}
                >
                  {a.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>{a.name}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{a.email}</p>
                </div>
                {canManage ? (
                  <select
                    value={a.adminLevel ?? 'viewer'}
                    onChange={(e) => changeLevel(a.id, e.target.value as AdminLevel)}
                    className="px-3 py-2 rounded-xl border text-sm outline-none flex-shrink-0"
                    style={inputStyle}
                  >
                    {ADMIN_LEVELS.map((l) => (
                      <option key={l.value} value={l.value}>{l.label}</option>
                    ))}
                  </select>
                ) : (
                  <span className="text-xs px-2 py-1 rounded-lg font-medium flex-shrink-0" style={{ background: '#fdf2f8', color: '#be185d' }}>
                    {ADMIN_LEVELS.find((l) => l.value === a.adminLevel)?.label ?? 'Viewer'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
