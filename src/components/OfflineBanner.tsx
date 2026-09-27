'use client';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export function OfflineBanner() {
  const online = useOnlineStatus();
  if (online) return null;

  return (
    <div
      role="status"
      className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-secondary-container px-4 py-2 text-center text-sm font-medium text-secondary print:hidden"
    >
      <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
        cloud_off
      </span>
      <span>
        You&apos;re offline. Editing and downloads keep working from what&apos;s saved on this
        device.
      </span>
    </div>
  );
}
