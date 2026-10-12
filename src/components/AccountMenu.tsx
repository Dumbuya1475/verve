'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/components/AuthProvider';
import { getFirebaseAuth } from '@/lib/firebase/client';
import { hasBuyMeACoffee, BUY_ME_A_COFFEE_URL } from '@/lib/site';

export function AccountMenu() {
  const { user, loading, configured, displayName, email, initials, refreshSessionCookie } =
    useAuth();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  async function handleSignOut() {
    const auth = getFirebaseAuth();
    setOpen(false);
    if (auth) await signOut(auth);
    await refreshSessionCookie(null);
    router.push('/');
    router.refresh();
  }

  if (!configured) {
    return (
      <Link
        href="/login"
        className="rounded-control px-3 py-2 text-sm font-medium text-secondary hover:text-foreground focus-ring"
      >
        Sign in
      </Link>
    );
  }

  if (loading) {
    return (
      <div
        className="h-9 w-9 shrink-0 rounded-full bg-secondary-container"
        aria-hidden="true"
      />
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-control bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-container focus-ring"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 max-w-[12rem] items-center gap-2 rounded-control px-1 py-1 text-left focus-ring"
      >
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-container text-xs font-semibold text-foreground"
        >
          {initials}
        </span>
        <span className="hidden min-w-0 flex-col sm:flex">
          <span className="truncate text-sm font-medium text-foreground">{displayName}</span>
        </span>
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-64 rounded-container bg-surface-strong p-2 shadow-soft"
        >
          <div className="border-b border-outline-variant/40 px-3 py-3">
            <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
            {email ? (
              <p className="mt-0.5 truncate text-xs text-secondary">{email}</p>
            ) : null}
          </div>
          <Link
            href="/feedback"
            role="menuitem"
            className="mt-1 block rounded-control px-3 py-2 text-sm font-medium text-foreground hover:bg-surface focus-ring"
            onClick={() => setOpen(false)}
          >
            Send feedback
          </Link>
          {hasBuyMeACoffee() ? (
            <a
              href={BUY_ME_A_COFFEE_URL}
              target="_blank"
              rel="noreferrer"
              role="menuitem"
              className="block rounded-control px-3 py-2 text-sm font-medium text-foreground hover:bg-surface focus-ring"
              onClick={() => setOpen(false)}
            >
              Buy me a coffee
            </a>
          ) : null}
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            className="mt-1 w-full rounded-control px-3 py-2 text-left text-sm font-medium text-foreground hover:bg-surface focus-ring"
          >
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
