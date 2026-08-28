'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AccountMenu } from '@/components/AccountMenu';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/cover', label: 'Cover Page' },
  // { href: '/document', label: 'Document' },
  { href: '/feedback', label: 'Feedback' },
] as const;

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-outline-variant/40 bg-surface-strong">
      <div className="mx-auto flex max-w-6xl min-w-0 flex-wrap items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-control text-lg font-semibold tracking-tight text-foreground focus-ring"
        >
          <img src="/verve_logo.png" alt="Verve" className="h-8 w-auto" />
        </Link>

        <nav className="hidden flex-wrap items-center gap-1 sm:gap-2 md:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href || pathname?.startsWith(`${item.href}/`);
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

        <AccountMenu />
      </div>
    </header>
  );
}
