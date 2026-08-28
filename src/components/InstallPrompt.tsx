'use client';

import { useEffect, useState } from 'react';

const DISMISS_KEY = 'verve-install-prompt-dismissed';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installing, setInstalling] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in navigator &&
        Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    const dismissed = window.localStorage.getItem(DISMISS_KEY) === '1';
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);

    setIsIOS(ios);
    setVisible(!standalone && !dismissed);

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setVisible(false);
      setInstallEvent(null);
    };

    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (!visible) return null;

  function dismiss() {
    window.localStorage.setItem(DISMISS_KEY, '1');
    setVisible(false);
  }

  async function install() {
    setHint(null);
    if (installEvent) {
      setInstalling(true);
      try {
        await installEvent.prompt();
        const choice = await installEvent.userChoice;
        if (choice.outcome === 'accepted') {
          setVisible(false);
        }
        setInstallEvent(null);
      } catch {
        setHint('Could not open the install dialog. Try the install icon in the address bar.');
      } finally {
        setInstalling(false);
      }
      return;
    }

    setHint(
      isIOS
        ? 'Tap Share, then Add to Home Screen.'
        : 'Use the install icon in the address bar, or the browser menu → Install Verve.',
    );
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
          {hint ? <p className="mt-2 text-sm text-secondary">{hint}</p> : null}
        </div>
        <div className="flex shrink-0 flex-col gap-2">
          {!isIOS ? (
            <button
              type="button"
              onClick={() => void install()}
              disabled={installing}
              className="rounded-control bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground focus-ring disabled:opacity-60"
            >
              {installing ? 'Installing…' : 'Install'}
            </button>
          ) : null}
          <button
            type="button"
            onClick={dismiss}
            className="rounded-control bg-surface px-3 py-2 text-sm font-medium text-foreground focus-ring"
          >
            {isIOS ? 'Got it' : 'Not now'}
          </button>
        </div>
      </div>
    </div>
  );
}
