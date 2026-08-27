'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    // Chrome only offers Install after a service worker controls the page.
    // Register on localhost too so the Install button can work in development.

    const register = async () => {
      try {
        await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none',
        });
      } catch {
        // Installation still works from the manifest even if the worker fails.
      }
    };

    void register();
  }, []);

  return null;
}
