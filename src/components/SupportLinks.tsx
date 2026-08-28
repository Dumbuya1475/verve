import Link from 'next/link';
import { hasBuyMeACoffee, BUY_ME_A_COFFEE_URL, GITHUB_REPO_URL } from '@/lib/site';

type SupportLinksProps = {
  className?: string;
  showFeedback?: boolean;
};

export function SupportLinks({ className = '', showFeedback = true }: SupportLinksProps) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {showFeedback ? (
        <Link
          href="/feedback"
          className="rounded-control bg-surface px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary-container focus-ring"
        >
          Send feedback
        </Link>
      ) : null}
      <a
        href={GITHUB_REPO_URL}
        target="_blank"
        rel="noreferrer"
        className="rounded-control bg-surface px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary-container focus-ring"
      >
        GitHub
      </a>
      {hasBuyMeACoffee() ? (
        <a
          href={BUY_ME_A_COFFEE_URL}
          target="_blank"
          rel="noreferrer"
          className="rounded-control bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-container focus-ring"
        >
          Buy me a coffee
        </a>
      ) : null}
    </div>
  );
}
