import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SignupForm } from '@/components/SignupForm';

export const metadata: Metadata = {
  title: 'Sign up',
};

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md rounded-container bg-surface-strong p-10 shadow-soft">
          <p className="text-sm text-secondary">Loading sign up…</p>
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
