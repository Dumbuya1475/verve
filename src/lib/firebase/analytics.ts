'use client';

import { getFirebaseApp } from './client';
import { getFirebaseWebConfig } from './config';

type Analytics = import('firebase/analytics').Analytics;

let analyticsPromise: Promise<Analytics | null> | null = null;

export function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (!getFirebaseWebConfig()?.measurementId) return Promise.resolve(null);

  if (!analyticsPromise) {
    analyticsPromise = (async () => {
      const { getAnalytics, isSupported } = await import('firebase/analytics');
      if (!(await isSupported())) return null;

      const app = getFirebaseApp();
      return app ? getAnalytics(app) : null;
    })();
  }

  return analyticsPromise;
}

export async function trackExportCompleted(
  kind: 'cover' | 'document',
  format: 'pdf' | 'word',
  signedIn: boolean,
): Promise<void> {
  try {
    const [analytics, { logEvent }] = await Promise.all([
      getFirebaseAnalytics(),
      import('firebase/analytics'),
    ]);
    if (!analytics) return;

    logEvent(analytics, 'export_completed', {
      export_kind: kind,
      file_format: format,
      access_type: signedIn ? 'signed_in' : 'guest',
    });
  } catch (error) {
    console.error('Could not send Firebase Analytics export event', error);
  }
}
