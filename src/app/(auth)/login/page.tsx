'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import VernonLogo from '@/components/VernonLogo';

export default function LoginPage() {
  const { user, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      router.push('/dashboard');
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--background)' }}>
      {/* Left brand panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{ background: 'var(--primary)' }}
      >
        <div className="flex items-center gap-3">
          <VernonLogo size={40} light />
          <span className="text-white text-2xl font-semibold tracking-tight">Vernon</span>
        </div>

        <div>
          <blockquote className="text-white/90 text-2xl font-light leading-relaxed mb-6">
            &ldquo;The first step towards getting somewhere is to decide that you are not going to stay where you are.&rdquo;
          </blockquote>
          <p className="text-white/60 text-sm">— J.P. Morgan</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {['Career Clarity', 'Guided Reflection', 'Expert Coaching'].map((label) => (
            <div key={label} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <p className="text-white/90 text-sm font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <VernonLogo size={36} />
            <span className="text-2xl font-semibold" style={{ color: 'var(--primary)' }}>Vernon</span>
          </div>

          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            Welcome back
          </h1>
          <p className="mb-8" style={{ color: 'var(--text-muted)' }}>
            Sign in to continue your career journey
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm"
                style={{
                  background: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                  Password
                </label>
                <button type="button" className="text-sm" style={{ color: 'var(--primary)' }}>
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl border outline-none transition-all text-sm"
                  style={{
                    background: 'var(--surface)',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm px-4 py-3 rounded-xl" style={{ background: '#fef2f2', color: '#b91c1c' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-opacity disabled:opacity-70"
              style={{ background: 'var(--primary)' }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
