import Link from 'next/link';
import { BottomNav } from '@/components/BottomNav';
import { COVER_LOGO_PATH } from '@/lib/cover/types';
import { BUY_ME_A_COFFEE_URL, GITHUB_REPO_URL, hasBuyMeACoffee } from '@/lib/site';

const TICKER_ITEMS = [
  'Verve',
  'Cover pages',
  'PDF export',
  'Word export',
  'Limkokwing',
  'Sierra Leone',
  'Open source',
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-hidden bg-background pb-24 font-sans md:pb-8">
      <section className="flex min-h-dvh w-full flex-col bg-surface-strong">
          <header className="flex items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-12">
            <Link href="/" className="flex shrink-0 items-center rounded-full focus-ring">
              <img src="/verve_logo.png" alt="Verve" className="h-8 w-auto" />
            </Link>

            <nav className="hidden items-center gap-8 text-sm font-medium text-foreground md:flex">
              <Link href="/" className="rounded-full focus-ring hover:text-primary">
                Home
              </Link>
              <Link href="/cover" className="rounded-full focus-ring hover:text-primary">
                Cover
              </Link>
              <Link href="/feedback" className="rounded-full focus-ring hover:text-primary">
                Feedback
              </Link>
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-full focus-ring hover:text-primary"
              >
                GitHub
              </a>
            </nav>

            <Link
              href="/signup"
              className="rounded-full border border-outline-variant/60 px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface focus-ring"
            >
              Create account
            </Link>
          </header>

          <div className="grid min-h-0 flex-1 items-stretch gap-8 lg:grid-cols-2 lg:gap-0">
            <div className="flex flex-col justify-center px-5 py-6 sm:px-8 lg:px-12 lg:py-8">
              <p className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-outline-variant/50 bg-surface px-3 py-1.5 text-xs font-semibold tracking-wide text-secondary">
                <span className="material-symbols-outlined text-[14px] text-primary">add</span>
                For students in Sierra Leone
              </p>

              <h1 className="mb-5 text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-7xl">
                Cover pages your
                <span className="block text-secondary">lecturer will</span>
                accept
              </h1>

              <p className="mb-8 max-w-md text-base leading-relaxed text-secondary sm:text-lg">
                Fill in your faculty details, preview the layout, and export PDF or Word. Try two
                free downloads, then create an account. More campuses will follow.
              </p>

              <div className="flex w-full flex-col gap-3 sm:flex-row">
                <Link
                  href="/cover"
                  className="rounded-full bg-primary px-7 py-3.5 text-center text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary-container focus-ring"
                >
                  Make a cover
                </Link>
                <Link
                  href="/login"
                  className="rounded-full bg-surface px-7 py-3.5 text-center text-sm font-semibold text-foreground transition-colors hover:bg-secondary-container focus-ring"
                >
                  Sign in
                </Link>
              </div>
            </div>

            <div className="relative min-h-[22rem] sm:min-h-[28rem] lg:min-h-0">
              <div className="relative h-full min-h-[22rem] overflow-hidden bg-secondary-container sm:min-h-[28rem] lg:min-h-full">
                <div className="absolute inset-0 flex items-center justify-center p-8 sm:p-12">
                  <article className="flex aspect-[210/297] w-[min(78%,20rem)] flex-col items-center bg-surface-strong px-6 py-8 shadow-soft">
                    <img
                      src={COVER_LOGO_PATH}
                      alt="Limkokwing University of Creative Technology"
                      className="mb-5 h-16 w-auto object-contain sm:h-20"
                    />
                    <div className="h-0.5 w-full bg-foreground" />
                    <p className="py-4 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-foreground sm:text-xs">
                      Individual assignment
                    </p>
                    <div className="h-0.5 w-full bg-foreground" />
                    <dl className="mt-6 w-full space-y-2 text-[11px] text-secondary sm:text-xs">
                      <div className="flex justify-between gap-3">
                        <dt>Course</dt>
                        <dd className="font-medium text-foreground">Cover page</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt>Export</dt>
                        <dd className="font-medium text-foreground">PDF · Word</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt>Campus</dt>
                        <dd className="font-medium text-foreground">Sierra Leone</dd>
                      </div>
                    </dl>
                  </article>
                </div>
              </div>

              <Link
                href="/cover"
                aria-label="Make a cover with Verve"
                className="absolute top-1/2 left-4 z-10 flex h-28 w-28 -translate-y-1/2 items-center justify-center rounded-full bg-foreground text-primary-foreground shadow-soft focus-ring sm:left-0 sm:h-32 sm:w-32 sm:-translate-x-1/3"
              >
                <svg
                  viewBox="0 0 120 120"
                  className="landing-spin absolute inset-1 h-[calc(100%-0.5rem)] w-[calc(100%-0.5rem)]"
                  aria-hidden="true"
                >
                  <defs>
                    <path
                      id="landing-circle-path"
                      d="M 60,60 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
                    />
                  </defs>
                  <text fill="currentColor" fontSize="8.5" letterSpacing="2.4">
                    <textPath href="#landing-circle-path">
                      MAKE A COVER WITH VERVE · MAKE A COVER WITH VERVE ·
                    </textPath>
                  </text>
                </svg>
                <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-surface-strong text-foreground sm:h-14 sm:w-14">
                  <span className="material-symbols-outlined text-[22px]">arrow_outward</span>
                </span>
              </Link>
            </div>
          </div>

          <div className="overflow-hidden bg-foreground py-3 text-primary-foreground">
            <div className="landing-marquee flex w-max items-center gap-10 whitespace-nowrap px-6 text-sm font-semibold tracking-wide">
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, index) => (
                <span key={`${item}-${index}`} className="inline-flex items-center gap-10">
                  <span className="inline-flex items-center gap-2">
                    <span aria-hidden="true" className="text-primary">
                      +
                    </span>
                    {item}
                  </span>
                </span>
              ))}
            </div>
          </div>
      </section>

      <div className="mx-auto w-full max-w-7xl flex-grow px-4 sm:px-6 lg:px-8">
        <section className="px-2 py-14 sm:py-16">
          <p className="mb-6 text-center text-xs font-bold uppercase tracking-widest text-secondary">
            Trusted by students at
          </p>
          <div className="mx-auto flex max-w-xl flex-col items-center gap-3 text-center">
            <img
              src={COVER_LOGO_PATH}
              alt="Limkokwing University of Creative Technology Sierra Leone"
              className="h-16 w-auto object-contain sm:h-20"
            />
            <p className="text-base font-semibold text-foreground">
              Limkokwing University of Creative Technology
            </p>
            <p className="text-sm text-secondary">Sierra Leone</p>
          </div>
        </section>

        <section className="rounded-[2rem] bg-surface-strong px-5 py-12 shadow-soft sm:rounded-[2.5rem] sm:px-8 lg:px-10 lg:py-16">
          <div className="mb-10 flex flex-col items-start gap-3 sm:mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              What Verve does today
            </h2>
            <p className="max-w-lg text-sm leading-relaxed text-secondary sm:text-base">
              One calm place to assemble a faculty-style cover and take it to class.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-4 rounded-[1.5rem] bg-surface p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <span className="material-symbols-outlined text-[26px] text-primary">description</span>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-bold text-foreground">Faculty-style covers</h3>
                <p className="text-sm leading-relaxed text-secondary">
                  Individual and group templates follow the faculty layout: logo, course line,
                  details table, attestation, and the lecturer comments box.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-[1.5rem] bg-surface p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-container">
                <span className="material-symbols-outlined text-[26px] text-secondary">download</span>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-bold text-foreground">PDF and Word export</h3>
                <p className="text-sm leading-relaxed text-secondary">
                  Download the same page you preview. Guests get two exports. Create an account on
                  the third so you can keep submitting work all semester.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-2 py-12 sm:py-16">
          <div className="relative flex flex-col items-start overflow-hidden rounded-[2rem] bg-primary p-8 text-primary-foreground shadow-soft sm:rounded-[2.5rem] md:p-14">
            <h2 className="relative z-10 mb-4 text-3xl font-bold tracking-tight lg:text-4xl">
              Start with two free covers
            </h2>
            <p className="relative z-10 mb-8 max-w-lg text-base text-primary-foreground/90 sm:text-lg">
              Build one now. If it looks right, export it. After two downloads, sign up to keep
              using Verve.
            </p>
            <Link
              href="/cover"
              className="relative z-10 rounded-full bg-surface-strong px-8 py-3.5 text-sm font-bold text-foreground shadow-soft transition-colors hover:bg-surface focus-ring"
            >
              Open the cover editor
            </Link>
          </div>
        </section>
      </div>

      <footer className="mx-auto w-full max-w-7xl px-6 pb-10 pt-4 md:pb-8">
        <div className="grid grid-cols-1 gap-12 border-t border-outline-variant/30 pt-12 md:grid-cols-12">
          <div className="flex flex-col items-center gap-6 border-b border-outline-variant/30 pb-8 text-center md:col-span-5 md:items-start md:border-b-0 md:pb-0 md:text-left">
            <div className="flex items-center gap-2">
              <img src="/verve_logo.png" alt="" className="h-10 w-auto" />
              <span className="text-3xl font-bold tracking-tight text-primary">Verve</span>
            </div>
            <p className="max-w-sm text-sm text-secondary">
              A calm academic workspace for university students in Sierra Leone. Build assignment
              cover pages and export them for class.
            </p>
            <p className="mt-auto pt-4 text-xs font-semibold tracking-wide text-secondary">
              © 2026 Verve.{' '}
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-full text-primary hover:underline focus-ring"
              >
                Open source on GitHub
              </a>
              {' · '}MIT.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-7 sm:grid-cols-3">
            <div className="flex flex-col gap-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Product</h2>
              <nav className="flex flex-col gap-3">
                <Link className="text-sm text-secondary transition-colors hover:text-primary" href="/cover">
                  Cover pages
                </Link>
                <Link className="text-sm text-secondary transition-colors hover:text-primary" href="/signup">
                  Create account
                </Link>
                <Link className="text-sm text-secondary transition-colors hover:text-primary" href="/login">
                  Sign in
                </Link>
              </nav>
            </div>
            <div className="flex flex-col gap-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Support</h2>
              <nav className="flex flex-col gap-3">
                <Link className="text-sm text-secondary transition-colors hover:text-primary" href="/feedback">
                  Send feedback
                </Link>
                <a
                  className="text-sm text-secondary transition-colors hover:text-primary"
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
                {hasBuyMeACoffee() ? (
                  <a
                    className="text-sm text-secondary transition-colors hover:text-primary"
                    href={BUY_ME_A_COFFEE_URL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Buy me a coffee
                  </a>
                ) : null}
              </nav>
            </div>
          </div>
        </div>
      </footer>

      <BottomNav />
    </div>
  );
}
