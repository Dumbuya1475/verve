import Link from 'next/link';
import { AccountMenu } from '@/components/AccountMenu';

export function PublicHeader() {
  return (
    <header className="border-b border-outline-variant/40 bg-surface-strong">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-control text-lg font-semibold tracking-tight text-foreground focus-ring"
        >
          <img src="/verve_logo.png" alt="Verve" className="h-8 w-auto" />
        </Link>
        <AccountMenu />
      </div>
    </header>
  );
}
