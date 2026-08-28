export const GUEST_EXPORT_LIMIT = 2;
const STORAGE_KEY = 'verve-guest-export-count';

function readCount(): number {
  if (typeof window === 'undefined') return 0;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.floor(n);
}

export function getGuestExportCount(): number {
  return readCount();
}

export function remainingGuestExports(): number {
  return Math.max(0, GUEST_EXPORT_LIMIT - readCount());
}

export function canGuestExport(): boolean {
  return readCount() < GUEST_EXPORT_LIMIT;
}

export function recordGuestExport(): void {
  window.localStorage.setItem(STORAGE_KEY, String(readCount() + 1));
}
