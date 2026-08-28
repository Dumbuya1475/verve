'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { isProtectedPath } from '@/lib/firebase/constants';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading, configured } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const mustSignIn = configured && isProtectedPath(pathname ?? '');

  useEffect(() => {
    if (!mustSignIn || loading) return;
    if (!user) {
      const next = pathname ? `?next=${encodeURIComponent(pathname)}` : '';
      router.replace(`/login${next}`);
    }
  }, [mustSignIn, loading, user, pathname, router]);

  if (!mustSignIn) return children;

  if (loading) {
    return (
      <div className="rounded-container bg-surface-strong p-8 shadow-soft">
        <p className="text-sm font-medium text-secondary">Checking your session…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-container bg-surface-strong p-8 shadow-soft">
        <p className="text-sm font-medium text-secondary">Redirecting to sign in…</p>
      </div>
    );
  }

  return children;
}
