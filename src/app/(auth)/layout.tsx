import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Account',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-surface px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 self-center rounded-control text-sm font-medium text-secondary hover:text-foreground focus-ring sm:self-start sm:max-w-md sm:w-full"
      >
        <span className="material-symbols-outlined text-[18px]" aria-hidden>
          arrow_back
        </span>
        Back to home
      </Link>
      {children}
    </div>
  );
}
