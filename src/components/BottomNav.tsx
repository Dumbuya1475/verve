'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/cover', label: 'Cover', icon: 'description' },
  { href: '/document', label: 'Builder', icon: 'edit_note' },
  { href: '/exam', label: 'Master', icon: 'quiz' },
  { href: '/submit', label: 'Git', icon: 'terminal' },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-2 pb-safe bg-surface shadow-[0px_-4px_20px_-2px_rgba(28,25,23,0.08)] z-50 print:hidden">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
        
        if (active) {
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center text-primary font-bold bg-primary-fixed/20 rounded-xl px-4 py-1 transition-all active:scale-95">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                {item.icon}
              </span>
              <span className="text-xs font-semibold tracking-wider mt-1">{item.label}</span>
            </Link>
          );
        }

        return (
          <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center text-secondary px-4 py-1 hover:text-foreground transition-all active:scale-95">
            <span className="material-symbols-outlined">
              {item.icon}
            </span>
            <span className="text-xs font-medium mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
