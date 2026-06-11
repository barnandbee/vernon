'use client';

import { useState, useEffect, FormEvent } from 'react';

// Change these to control who can access this prototype.
const SITE_USERNAME = 'vernon';
const SITE_PASSWORD = 'prototype2026';

const STORAGE_KEY = 'site_access_granted';

export default function SiteGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setUnlocked(localStorage.getItem(STORAGE_KEY) === 'true');
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (username === SITE_USERNAME && password === SITE_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, 'true');
      setUnlocked(true);
    } else {
      setError('Incorrect username or password.');
    }
  };

  // Avoid a flash of the form before we've checked localStorage.
  if (unlocked === null) {
    return <div style={{ minHeight: '100vh', background: '#fafafa' }} />;
  }

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fafafa',
        fontFamily: 'system-ui, sans-serif',
        padding: '1rem',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: '320px',
          background: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '2rem',
        }}
      >
        <h1
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: '#222',
            textAlign: 'center',
            margin: '0 0 1.5rem',
          }}
        >
          Sign in
        </h1>

        <div style={{ marginBottom: '1rem' }}>
          <label
            htmlFor="gate-username"
            style={{ display: 'block', fontSize: '0.8rem', color: '#444', marginBottom: '0.375rem' }}
          >
            Username
          </label>
          <input
            id="gate-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            autoComplete="username"
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '0.9rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label
            htmlFor="gate-password"
            style={{ display: 'block', fontSize: '0.8rem', color: '#444', marginBottom: '0.375rem' }}
          >
            Password
          </label>
          <input
            id="gate-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '0.9rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {error && (
          <p style={{ color: '#c0392b', fontSize: '0.8rem', margin: '0 0 1rem' }}>{error}</p>
        )}

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.6rem',
            background: '#222',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
