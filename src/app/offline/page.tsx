export default function OfflinePage() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center px-4 py-16 text-center">
      <span className="material-symbols-outlined text-5xl text-secondary" aria-hidden="true">
        cloud_off
      </span>
      <h1 className="mt-4 text-2xl font-bold text-foreground">You&apos;re offline</h1>
      <p className="mt-3 text-base leading-relaxed text-secondary">
        No connection right now. Your saved cover pages and drafts live on this device, so you
        can keep editing — and downloads still work once you open a page you&apos;ve visited
        before.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <a
          href="/cover"
          className="rounded-control bg-primary px-4 py-2 text-sm font-bold text-primary-foreground focus-ring"
        >
          Open cover editor
        </a>
        <a
          href="/document"
          className="rounded-control bg-surface px-4 py-2 text-sm font-medium text-foreground focus-ring"
        >
          Open document editor
        </a>
      </div>
      <p className="mt-6 text-sm text-secondary">
        Tip: open the cover and document pages once while online so the app can save everything
        it needs for offline downloads.
      </p>
    </div>
  );
}
