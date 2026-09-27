// Pre-download the heavy export libraries (docx, jspdf, html2canvas,
// file-saver) while the user is online so PDF/Word downloads keep working
// offline. They are loaded with dynamic `import()` in the export modules,
// which means Next.js serves them as separate chunks — the service worker
// caches /_next/static requests, but only if the chunks were fetched at
// least once. Warming them on idle fixes first-time-offline exports.

let warmed = false;

export function warmExportModules(): void {
  if (warmed) return;
  if (typeof window === 'undefined') return;
  if (!navigator.onLine) return;
  warmed = true;

  const warm = () => {
    void import('docx').catch(() => undefined);
    void import('jspdf').catch(() => undefined);
    void import('html2canvas').catch(() => undefined);
    void import('file-saver').catch(() => undefined);
  };

  const idleCallback = (
    window as unknown as { requestIdleCallback?: (cb: () => void) => void }
  ).requestIdleCallback;

  if (typeof idleCallback === 'function') {
    idleCallback(warm);
  } else {
    window.setTimeout(warm, 2000);
  }
}
