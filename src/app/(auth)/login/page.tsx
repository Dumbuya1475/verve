import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'Sign in',
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md rounded-container bg-surface-strong p-10 shadow-soft">
          <p className="text-sm text-secondary">Loading sign in…</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
