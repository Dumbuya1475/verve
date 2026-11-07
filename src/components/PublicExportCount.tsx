'use client';

import { useEffect, useState } from 'react';

export function PublicExportCount() {
  const [totalExports, setTotalExports] = useState<number | null>(null);
  const [countStatus, setCountStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;

    async function loadTotalExports() {
      try {
        const response = await fetch('/api/exports/total');
        if (!response.ok) {
          throw new Error(`Export count request failed with HTTP ${response.status}.`);
        }

        const result: unknown = await response.json();
        if (
          !result ||
          typeof result !== 'object' ||
          !('totalExports' in result) ||
          typeof result.totalExports !== 'number' ||
          !Number.isSafeInteger(result.totalExports) ||
          result.totalExports < 0
        ) {
          throw new Error('The export count service returned an invalid response.');
        }

        if (!cancelled) {
          setTotalExports(result.totalExports);
          setCountStatus('loaded');
        }
      } catch (error) {
        console.error('Could not load the public export total', error);
        if (!cancelled) setCountStatus('error');
      }
    }

    void loadTotalExports();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="px-2 pb-8 pt-10 sm:pb-10" aria-label="Verve export total">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-2 rounded-container bg-surface px-6 py-7 text-center shadow-soft sm:flex-row sm:justify-center sm:gap-5 sm:px-10">
        <p
          className="text-4xl font-bold tracking-tight text-primary"
          role="status"
          aria-live="polite"
          aria-label={
            countStatus === 'loading'
              ? 'Loading total exports'
              : countStatus === 'error'
                ? 'Total exports unavailable'
                : `${totalExports?.toLocaleString()} total exports`
          }
        >
          {countStatus === 'loading'
            ? '…'
            : countStatus === 'error'
              ? 'Unavailable'
              : totalExports?.toLocaleString()}
        </p>
        <p className="text-sm font-semibold text-secondary sm:text-base">
          total exports created with Verve
        </p>
      </div>
    </section>
  );
}
