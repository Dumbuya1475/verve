'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, this is a mocked redirect to the app as requested.
    router.push('/cover');
  };

  return (
    <div className="w-full max-w-md space-y-8 bg-surface-strong p-10 rounded-container shadow-soft">
      <div className="flex flex-col items-center">
        <img src="/verve_logo.png" alt="Verve Logo" className="h-16 w-auto mb-2" />
        <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-foreground">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-secondary">
          Join Verve to assemble your assignments
        </p>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSignup}>
        <div className="space-y-4 rounded-md shadow-sm">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="relative block w-full rounded-control border border-outline-variant/50 bg-surface px-3 py-2 text-foreground focus-ring sm:text-sm"
              placeholder="Alex Rivera"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1" htmlFor="email-address">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="relative block w-full rounded-control border border-outline-variant/50 bg-surface px-3 py-2 text-foreground focus-ring sm:text-sm"
              placeholder="student@university.edu"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="relative block w-full rounded-control border border-outline-variant/50 bg-surface px-3 py-2 text-foreground focus-ring sm:text-sm"
              placeholder="Create a strong password"
              defaultValue="defaultPassword123!"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="group relative flex w-full justify-center rounded-control bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary-container focus-ring transition-colors shadow-soft"
          >
            Sign up
          </button>
        </div>
      </form>
      <div className="text-center text-sm">
        <span className="text-secondary">Already have an account? </span>
        <Link href="/login" className="font-medium text-primary hover:text-primary-container transition-colors">
          Sign in
        </Link>
      </div>
    </div>
  );
}
