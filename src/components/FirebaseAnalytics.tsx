'use client';

import { useEffect } from 'react';
import { getFirebaseAnalytics } from '@/lib/firebase/analytics';

export function FirebaseAnalytics() {
  useEffect(() => {
    void getFirebaseAnalytics().catch((error: unknown) => {
      console.error('Could not initialize Firebase Analytics', error);
    });
  }, []);

  return null;
}
