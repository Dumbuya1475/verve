'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase/client';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import { safeNextPath } from '@/lib/firebase/constants';
import { friendlyAuthError } from '@/lib/firebase/errors';
import { useAuth } from '@/components/AuthProvider';

const inputClass =
  'relative block w-full rounded-control border border-outline-variant/50 bg-surface px-3 py-2 text-foreground focus:bg-surface-strong focus-ring sm:text-sm';

export function SignupForm() {
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
    const name = String(form.get('name') ?? '').trim();
    const email = String(form.get('email') ?? '').trim();
    const password = String(form.get('password') ?? '');
    setPending(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(credential.user, { displayName: name });
      }
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
          Create an account
        </h1>
        <p className="mt-2 text-center text-sm text-secondary">
          Join Verve to assemble your assignments
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
            <label className="mb-1 block text-sm font-medium text-foreground" htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className={inputClass}
              placeholder="Alex Rivera"
            />
          </div>
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
              autoComplete="new-password"
              minLength={6}
              required
              className={inputClass}
              placeholder="At least 6 characters"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={pending || !configured}
          className="flex w-full justify-center rounded-control bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-soft transition-colors hover:bg-primary-container focus-ring disabled:opacity-60"
        >
          {pending ? 'Creating account…' : 'Sign up'}
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
        <span className="text-secondary">Already have an account? </span>
        <Link
          href={searchParams.get('next') ? `/login?next=${encodeURIComponent(searchParams.get('next') ?? '')}` : '/login'}
          className="font-medium text-primary hover:text-primary-container focus-ring rounded-control"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
