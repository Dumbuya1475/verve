'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase/client';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import { friendlyAuthError } from '@/lib/firebase/errors';
import { useAuth } from '@/components/AuthProvider';

const inputClass =
  'relative block w-full rounded-control border border-outline-variant/50 bg-surface px-3 py-2 text-foreground focus:bg-surface-strong focus-ring sm:text-sm';

function safeNextPath(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/cover';
  return value;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshSessionCookie } = useAuth();
  const configured = isFirebaseConfigured();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function finishSignIn(user: import('firebase/auth').User) {
    await refreshSessionCookie(user);
    router.push(safeNextPath(searchParams.get('next')));
    router.refresh();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const auth = getFirebaseAuth();
    if (!auth) {
      setError('Firebase is not configured. Add the NEXT_PUBLIC_FIREBASE_* keys to .env.local.');
      return;
    }
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '').trim();
    const password = String(form.get('password') ?? '');
    setPending(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      await finishSignIn(credential.user);
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setPending(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    const auth = getFirebaseAuth();
    if (!auth) {
      setError('Firebase is not configured. Add the NEXT_PUBLIC_FIREBASE_* keys to .env.local.');
      return;
    }
    setPending(true);
    try {
      const credential = await signInWithPopup(auth, new GoogleAuthProvider());
      await finishSignIn(credential.user);
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="w-full max-w-md space-y-8 rounded-container bg-surface-strong p-10 shadow-soft">
      <div className="flex flex-col items-center">
        <img src="/verve_logo.png" alt="Verve" className="mb-2 h-16 w-auto" />
        <h1 className="mt-2 text-center text-3xl font-bold tracking-tight text-foreground">
          Sign in to Verve
        </h1>
        <p className="mt-2 text-center text-sm text-secondary">
          Welcome back to your academic workspace
        </p>
      </div>

      {!configured ? (
        <p className="rounded-control bg-error-container px-3 py-2 text-sm text-error">
          Firebase Auth is not configured yet. Copy .env.local.example to .env.local and add your
          Firebase web keys.
        </p>
      ) : null}

      {error ? (
        <p className="rounded-control bg-error-container px-3 py-2 text-sm text-error" role="alert">
          {error}
        </p>
      ) : null}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground" htmlFor="email-address">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={inputClass}
              placeholder="student@university.edu"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className={inputClass}
              placeholder="Password"
            />
          </div>
        </div>

        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary hover:text-primary-container focus-ring rounded-control"
          >
            Forgot your password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={pending || !configured}
          className="flex w-full justify-center rounded-control bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-soft transition-colors hover:bg-primary-container focus-ring disabled:opacity-60"
        >
          {pending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={pending || !configured}
        className="flex w-full justify-center rounded-control bg-surface px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary-container focus-ring disabled:opacity-60"
      >
        Continue with Google
      </button>

      <p className="text-center text-sm">
        <span className="text-secondary">Don&apos;t have an account? </span>
        <Link
          href="/signup"
          className="font-medium text-primary hover:text-primary-container focus-ring rounded-control"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
