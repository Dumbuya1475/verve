'use client';

import { useState } from 'react';
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase/client';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import { friendlyAuthError } from '@/lib/firebase/errors';

const inputClass =
  'relative block w-full rounded-control border border-outline-variant/50 bg-surface px-3 py-2 text-foreground focus:bg-surface-strong focus-ring sm:text-sm';

export function ForgotPasswordForm() {
  const configured = isFirebaseConfigured();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    const auth = getFirebaseAuth();
    if (!auth) {
      setError('Firebase is not configured. Add the NEXT_PUBLIC_FIREBASE_* keys to .env.local.');
      return;
    }
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '').trim();
    setPending(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
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
          Reset your password
        </h1>
        <p className="mt-2 text-center text-sm text-secondary">
          We will email you a link if that address has an account.
        </p>
      </div>

      {error ? (
        <p className="rounded-control bg-error-container px-3 py-2 text-sm text-error" role="alert">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="rounded-control bg-secondary-container px-3 py-2 text-sm text-foreground" role="status">
          Check your inbox for a reset link. If you do not see it, look in spam.
        </p>
      ) : null}

      <form className="space-y-6" onSubmit={handleSubmit}>
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
        <button
          type="submit"
          disabled={pending || !configured}
          className="flex w-full justify-center rounded-control bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-soft transition-colors hover:bg-primary-container focus-ring disabled:opacity-60"
        >
          {pending ? 'Sending…' : 'Send reset link'}
        </button>
      </form>

      <p className="text-center text-sm">
        <Link
          href="/login"
          className="font-medium text-primary hover:text-primary-container focus-ring rounded-control"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
