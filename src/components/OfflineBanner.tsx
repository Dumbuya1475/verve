'use client';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { Icon } from '@/components/Icon';

export function OfflineBanner() {
  const online = useOnlineStatus();
  if (online) return null;

  return (
    <div
      role="status"
      className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-secondary-container px-4 py-2 text-center text-sm font-medium text-secondary print:hidden"
    >
      <Icon name="cloud_off" className="text-[18px]" />
      <span>
        You&apos;re offline. Editing and downloads keep working from what&apos;s saved on this
        device.
      </span>
    </div>
  );
}
