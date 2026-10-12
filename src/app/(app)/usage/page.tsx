'use client';

import { useEffect, useState } from 'react';

const EMPTY_STATS = {
  totalExports: 0,
  usersWhoExported: 0,
  guestExports: 0,
  exportsByKind: {} as Record<string, number>,
  generatedAt: null as string | null,
};

export default function UsagePage() {
  const [stats, setStats] = useState(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/exports/record');
        const contentType = response.headers.get('content-type') ?? '';
        if (!contentType.includes('application/json')) {
          throw new Error(
            response.status === 404
              ? 'The analytics API is not available on this deployment. Deploy the latest app version and try again.'
              : `The server returned an unexpected response (HTTP ${response.status}). Check the app deployment and server logs.`,
          );
        }

        let payload: {
          totalExports?: number;
          usersWhoExported?: number;
          guestExports?: number;
          exportsByKind?: Record<string, number>;
          generatedAt?: string | null;
          error?: string;
        };
        try {
          payload = (await response.json()) as typeof payload;
        } catch {
          throw new Error('The analytics API returned invalid data. Check the app server logs.');
        }

        if (!response.ok) {
          throw new Error(payload.error ?? 'Could not load usage data.');
        }

        if (!cancelled) {
          setStats({
            totalExports: payload.totalExports ?? 0,
            usersWhoExported: payload.usersWhoExported ?? 0,
            guestExports: payload.guestExports ?? 0,
            exportsByKind: payload.exportsByKind ?? {},
            generatedAt: payload.generatedAt ?? null,
          });
        }
      } catch (caught) {
        if (!cancelled) {
          setError(caught instanceof Error ? caught.message : 'Could not load usage data.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  const kindEntries = Object.entries(stats.exportsByKind).sort(([left], [right]) => left.localeCompare(right));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Usage</p>
        <h1 className="mt-2 text-3xl font-semibold text-foreground sm:text-4xl">Export analytics</h1>
      </div>

      {error ? (
        <div className="rounded-container bg-error-container px-4 py-3 text-sm text-error shadow-soft">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-container bg-surface-strong p-5 shadow-soft">
          <p className="text-sm text-secondary">Total exports</p>
          <p className="mt-3 text-3xl font-semibold text-foreground">
            {loading ? '…' : stats.totalExports}
          </p>
        </div>
        <div className="rounded-container bg-surface-strong p-5 shadow-soft">
          <p className="text-sm text-secondary">Accounts with exports</p>
          <p className="mt-3 text-3xl font-semibold text-foreground">
            {loading ? '…' : stats.usersWhoExported}
          </p>
        </div>
        <div className="rounded-container bg-surface-strong p-5 shadow-soft">
          <p className="text-sm text-secondary">Free guest exports</p>
          <p className="mt-3 text-3xl font-semibold text-foreground">
            {loading ? '…' : stats.guestExports}
          </p>
        </div>
        <div className="rounded-container bg-surface-strong p-5 shadow-soft">
          <p className="text-sm text-secondary">Updated</p>
          <p className="mt-3 text-sm font-medium text-foreground">
            {loading ? '…' : stats.generatedAt ? new Date(stats.generatedAt).toLocaleString() : 'No data yet'}
          </p>
        </div>
        <p className="text-sm leading-relaxed text-secondary">
          Accounts with exports counts distinct signed-in accounts with at least one event recorded
          by Verve. Free guest exports are counted separately. Exports made before tracking was
          configured are not included. The student survey appears after an account’s fourth recorded
          export and remains available until submitted.
        </p>
      </div>

      <div className="rounded-container bg-surface-strong p-5 shadow-soft">
        <h2 className="text-xl font-semibold text-foreground">By export type</h2>
        {loading ? (
          <p className="mt-4 text-sm text-secondary">Loading export counts…</p>
        ) : kindEntries.length === 0 ? (
          <p className="mt-4 text-sm text-secondary">No exports have been recorded yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {kindEntries.map(([kind, count]) => (
              <li key={kind} className="flex items-center justify-between gap-4 rounded-control bg-surface p-3">
                <span className="text-sm font-medium capitalize text-foreground">{kind}</span>
                <span className="text-sm font-semibold text-primary">{count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
