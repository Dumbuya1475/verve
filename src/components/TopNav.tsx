'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/cover', label: 'Cover Page' },
  { href: '/document', label: 'Document Builder' },
  // { href: '/exam', label: 'Exam & Slide Master' },
  // { href: '/submit', label: 'Submission & Git' },
] as const;

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-outline-variant/40 bg-surface-strong">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href="/cover"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground focus-ring rounded-control"
        >
          <img src="/verve_logo.png" alt="Verve Logo" className="h-8 w-auto" />
          {/* <span className="hidden sm:inline">Verve</span> */}
        </Link>

        <nav className="flex flex-wrap items-center gap-1 sm:gap-2" aria-label="Primary">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={
                  'flex items-center gap-2 rounded-control px-3 py-2 text-sm font-medium transition-colors focus-ring ' +
                  (active ? 'text-primary' : 'text-secondary hover:text-foreground')
                }
              >
                <span
                  aria-hidden="true"
                  className={
                    'h-4 w-1 rounded-full transition-colors ' +
                    (active ? 'bg-primary' : 'bg-transparent')
                  }
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Account menu (avatar + sign out) is wired up in Issue 2 — Auth */}
        <div
          className="h-8 w-8 shrink-0 rounded-full bg-secondary-container"
          aria-hidden="true"
        />
      </div>
    </header>
  );
}
