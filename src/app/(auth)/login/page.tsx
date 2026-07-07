'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, this is a mocked redirect to the app as requested.
    router.push('/cover');
  };

  return (
    <div className="w-full max-w-md space-y-8 bg-surface-strong p-10 rounded-container shadow-soft">
      <div>
        <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-foreground">
          Sign in to CommitCraft
        </h2>
        <p className="mt-2 text-center text-sm text-secondary">
          Welcome back to your academic workspace
        </p>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleLogin}>
        <div className="space-y-4 rounded-md shadow-sm">
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
              defaultValue="test@university.edu"
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
              autoComplete="current-password"
              required
              className="relative block w-full rounded-control border border-outline-variant/50 bg-surface px-3 py-2 text-foreground focus-ring sm:text-sm"
              placeholder="Password"
              defaultValue="defaultPassword123!"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-outline-variant/50 text-primary focus:ring-primary"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-secondary">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="font-medium text-primary hover:text-primary-container">
              Forgot your password?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="group relative flex w-full justify-center rounded-control bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary-container focus-ring transition-colors shadow-soft"
          >
            Sign in
          </button>
        </div>
      </form>
      <div className="text-center text-sm">
        <span className="text-secondary">Don't have an account? </span>
        <Link href="/signup" className="font-medium text-primary hover:text-primary-container transition-colors">
          Sign up
        </Link>
      </div>
    </div>
  );
}
