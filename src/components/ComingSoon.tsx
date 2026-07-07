type ComingSoonProps = {
  eyebrow: string;
  title: string;
  description: string;
  issue: string;
};

export function ComingSoon({ eyebrow, title, description, issue }: ComingSoonProps) {
  return (
    <div className="rounded-container bg-surface-strong p-8 shadow-soft sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">{eyebrow}</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-secondary">{description}</p>
      <div className="mt-6 inline-flex items-center gap-2 rounded-control bg-surface px-3 py-1.5 text-sm text-secondary">
        Built in {issue}
      </div>
    </div>
  );
}
