'use client';

import { useEffect, useState } from 'react';

const DISMISS_KEY = 'verve-install-prompt-dismissed';

export function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in navigator &&
        Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    const dismissed = window.localStorage.getItem(DISMISS_KEY) === '1';
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);

    setIsIOS(ios);
    setVisible(!standalone && !dismissed);
  }, []);

  if (!visible) return null;

  function dismiss() {
    window.localStorage.setItem(DISMISS_KEY, '1');
    setVisible(false);
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-40 flex justify-center px-4 print:hidden md:bottom-6">
      <div className="pointer-events-auto flex w-full max-w-lg items-start gap-3 rounded-container bg-surface-strong p-4 shadow-soft">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">Install Verve</p>
          <p className="mt-1 text-sm leading-relaxed text-secondary">
            {isIOS
              ? 'On iPhone or iPad, tap Share, then Add to Home Screen.'
              : 'Add Verve to your home screen for quicker access to cover pages.'}
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-control bg-surface px-3 py-2 text-sm font-medium text-foreground focus-ring"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
