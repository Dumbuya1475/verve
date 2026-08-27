'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { BottomNav } from '@/components/BottomNav';
import { GITHUB_REPO_URL } from '@/lib/site';

export default function LandingPage() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-4');
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      el.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-4');
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-hidden bg-background pb-20 font-sans md:pb-0">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="rounded-control focus-ring">
            <img src="/verve_logo.png" alt="Verve" className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-2">
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-control px-3 py-2 text-sm font-medium text-secondary hover:text-foreground focus-ring"
            >
              GitHub
            </a>
            <Link
              href="/login"
              className="rounded-control px-3 py-2 text-sm font-medium text-secondary hover:text-foreground focus-ring"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-control bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:scale-105 active:scale-95"
            >
              Create account
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 pb-8 pt-12 text-center lg:gap-16 lg:pb-16 lg:pt-24">
          <div className="z-10 flex flex-col items-center">
            <div className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-secondary-container px-4 py-1.5 text-secondary lg:mb-8">
              <span className="material-symbols-outlined text-[16px]">school</span>
              <span className="text-xs font-bold tracking-wide uppercase">
                For university students in Sierra Leone
              </span>
            </div>

            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
              Cover pages your lecturer will accept
            </h1>

            <p className="mb-8 max-w-lg text-base text-secondary md:text-xl lg:mb-10">
              Fill in your faculty details, preview the layout, and export PDF or Word. Try two
              free downloads, then create an account. More campuses will follow.
            </p>

            <div className="flex w-full flex-col justify-center gap-4 sm:flex-row lg:w-auto">
              <Link
                href="/cover"
                className="w-full rounded-xl bg-primary px-8 py-3.5 text-center text-base font-semibold text-primary-foreground shadow-soft transition-all hover:brightness-110 active:scale-95 sm:w-auto"
              >
                Make a cover
              </Link>
              <Link
                href="/signup"
                className="w-full rounded-xl border border-outline-variant/30 bg-surface-strong px-8 py-3.5 text-center text-base font-semibold text-foreground transition-all hover:bg-surface active:scale-95 sm:w-auto"
              >
                Create a free account
              </Link>
            </div>
          </div>
        </section>

        <section className="my-8 bg-surface-strong py-10">
          <p className="mb-6 text-center text-xs font-bold uppercase tracking-widest text-secondary">
            Trusted by students at
          </p>
          <div className="mx-auto flex max-w-xl flex-col items-center gap-3 px-6 text-center">
            <img
              src="/cover_logo/LUCT.jpeg"
              alt="Limkokwing University of Creative Technology Sierra Leone"
              className="h-16 w-auto object-contain sm:h-20"
            />
            <p className="text-base font-semibold text-foreground">
              Limkokwing University of Creative Technology
            </p>
            <p className="text-sm text-secondary">Sierra Leone</p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl space-y-6 px-4 py-16 lg:py-24">
          <div className="mb-12 flex flex-col items-center lg:mb-16">
            <h2 className="text-center text-3xl font-bold text-foreground md:text-4xl">
              What Verve does today
            </h2>
            <div className="mt-4 h-1.5 w-16 rounded-full bg-primary" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            <div className="animate-on-scroll flex flex-col gap-4 rounded-[24px] border border-outline-variant/30 bg-surface p-8 shadow-soft transition-transform duration-300 hover:-translate-y-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <span className="material-symbols-outlined text-[32px] text-primary">description</span>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-bold text-foreground">Faculty-style covers</h3>
                <p className="text-sm leading-relaxed text-secondary">
                  Individual and group templates follow the faculty layout: logo, course line,
                  details table, attestation, and the lecturer comments box.
                </p>
              </div>
            </div>

            <div className="animate-on-scroll flex flex-col gap-4 rounded-[24px] border border-outline-variant/30 bg-surface p-8 shadow-soft transition-transform duration-300 hover:-translate-y-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary-container">
                <span className="material-symbols-outlined text-[32px] text-secondary">download</span>
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

        <section className="mx-auto max-w-5xl px-4 py-16 lg:py-24">
          <div className="relative flex animate-on-scroll flex-col items-center overflow-hidden rounded-[32px] bg-primary p-8 text-center text-primary-foreground shadow-soft md:p-16">
            <h2 className="relative z-10 mb-4 text-3xl font-bold tracking-tight lg:text-4xl">
              Start with two free covers
            </h2>
            <p className="relative z-10 mb-10 max-w-lg text-lg text-primary-foreground/90">
              Build one now. If it looks right, export it. After two downloads, sign up to keep
              using Verve.
            </p>
            <Link
              href="/cover"
              className="relative z-10 w-full rounded-xl bg-surface-strong px-10 py-4 text-base font-bold text-foreground shadow-soft transition-all hover:bg-surface active:scale-95 sm:inline-block sm:w-auto md:text-lg"
            >
              Open the cover editor
            </Link>
          </div>
        </section>
      </main>

      <footer className="mt-12 border-t border-outline-variant/30 bg-surface-strong px-6 pb-32 pt-16 md:pb-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-12">
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
                className="text-primary hover:underline focus-ring rounded-control"
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
                {process.env.NEXT_PUBLIC_BUY_ME_A_COFFEE_URL ? (
                  <a
                    className="text-sm text-secondary transition-colors hover:text-primary"
                    href={process.env.NEXT_PUBLIC_BUY_ME_A_COFFEE_URL}
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
