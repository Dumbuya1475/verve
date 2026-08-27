'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { BottomNav } from '@/components/BottomNav';

export default function LandingPage() {
  // Setup intersection observer for scroll animations
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-4');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      el.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-4');
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="flex flex-col min-h-screen min-w-0 overflow-x-hidden bg-background font-sans pb-20 md:pb-0">
      
      {/* Top Header */}
      <header className="bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <img src="/verve_logo.png" alt="Verve Logo" className="h-8 w-auto" />
            {/* <span className="font-bold text-xl tracking-tight text-primary">Verve</span> */}
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="rounded-control px-3 py-2 text-sm font-medium text-secondary hover:text-foreground focus-ring">
              Sign in
            </Link>
            <Link href="/signup" className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-control hover:scale-105 active:scale-95 transition-all shadow-soft">
              Try Verve
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="px-4 pt-12 lg:pt-24 pb-8 lg:pb-16 flex flex-col lg:flex-col items-center text-center lg:text-center  max-w-7xl mx-auto gap-8 lg:gap-16">
          <div className="flex flex-col items-center lg:items-center z-10">
            <div className="inline-flex items-center gap-1.5 bg-secondary-container text-secondary px-4 py-1.5 rounded-full mb-6 lg:mb-8 animate-[fadeIn_0.8s_ease-out_forwards]">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span className="text-xs font-bold tracking-wide uppercase">Academic Excellence Platform</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight leading-tight">
              Elevate Your <br className="hidden lg:block" />Academic Potential
            </h1>
            
            <p className="text-base md:text-xl text-secondary mb-8 lg:mb-10 max-w-md lg:max-w-lg mx-auto lg:mx-0">
              Transform your studies with AI-powered document creation, interactive version control, and comprehensive exam preparation tools.
            </p>
            
            <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4 justify-center lg:justify-start">
              <Link href="/signup" className="bg-primary text-primary-foreground font-semibold text-base py-3.5 px-8 rounded-xl shadow-soft hover:brightness-110 active:scale-95 transition-all w-full sm:w-auto text-center">
                Get Started Free
              </Link>
              <Link href="/document" className="bg-surface-strong text-foreground font-semibold text-base py-3.5 px-8 rounded-xl hover:bg-surface border border-outline-variant/30 active:scale-95 transition-all w-full sm:w-auto text-center">
                View Demo
              </Link>
            </div>
          </div>

          {/* Hero Mockup */}
          {/* <div className="flex-1 mt-12 w-full relative group animate-on-scroll">
            <div className="absolute -inset-1 bg-gradient-to-r from-coral/20 to-primary/20 rounded-[32px] blur-xl opacity-50 lg:opacity-70 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative bg-surface rounded-[24px] shadow-soft overflow-hidden border border-outline-variant/30 transform lg:rotate-2 lg:group-hover:rotate-0 transition duration-700">
              <img 
                className="w-full h-auto object-cover" 
                alt="App Dashboard Preview" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDh7giMISESVyvcd9RRxUFrS_Vy_4gTP-oOzqjyA5XYeopwQ4mE1LpTqLkl4B1d1D-3WPDzaR19KyYXLOUYmQSZrLdDKBG4e0ceYS1htOvznbw3nJdtZHu9Bj5rEWw5Wnl5GXKd_JR3hnkna7oMJ2FBZ5yacwsd6r38-U85G9jR7jEUcxmTrAdxO3PZLRd3Ad0NcF6xHkpdZv-6hZJHddFHLvSG2EuJe-BumxU0Mr5BpC3RFmCWk9rVbUIS6MIHuxqbt8-QQ5INNaL3" 
              />
            </div>
          </div> */}
        </section>

        {/* Trusted By Marquee */}
        <section className="py-8 bg-surface-strong overflow-hidden my-8">
          <p className="text-center text-xs font-bold text-secondary uppercase tracking-widest mb-6">Trusted by students at</p>
          <div className="relative flex overflow-x-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <div className="flex animate-[marquee_25s_linear_infinite] whitespace-nowrap min-w-full justify-around gap-12 px-6">
              {['Stanford', 'Oxford', 'MIT', 'Harvard', 'ETH Zurich'].map((uni, i) => (
                <div key={i} className="flex items-center gap-2 grayscale opacity-50">
                  <span className="material-symbols-outlined text-2xl">account_balance</span>
                  <span className="font-bold text-xl">{uni}</span>
                </div>
              ))}
            </div>
            <div className="flex animate-[marquee_25s_linear_infinite] whitespace-nowrap min-w-full justify-around gap-12 px-6 absolute top-0 left-full">
              {['Stanford', 'Oxford', 'MIT', 'Harvard', 'ETH Zurich'].map((uni, i) => (
                <div key={i} className="flex items-center gap-2 grayscale opacity-50">
                  <span className="material-symbols-outlined text-2xl">account_balance</span>
                  <span className="font-bold text-xl">{uni}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Stack */}
        <section className="px-4 py-16 lg:py-24 max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col items-center mb-12 lg:mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground text-center">Built for Modern Scholars</h3>
            <div className="h-1.5 w-16 bg-coral rounded-full mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="bg-surface p-8 rounded-[24px] shadow-soft border border-outline-variant/30 flex flex-col gap-4 animate-on-scroll hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[32px]">edit_note</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-foreground mb-2">AI Document Builder</h4>
                <p className="text-sm text-secondary leading-relaxed">Smart formatting and content suggestions that help you draft academic papers 3x faster while maintaining rigorous standards.</p>
              </div>
            </div>

            <div className="bg-surface p-8 rounded-[24px] shadow-soft border border-outline-variant/30 flex flex-col gap-4 animate-on-scroll hover:-translate-y-2 transition-transform duration-300 delay-100">
              <div className="w-14 h-14 bg-secondary-container rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-[32px]">description</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-foreground mb-2">Cover Design</h4>
                <p className="text-sm text-secondary leading-relaxed">Generate professional, institution-compliant cover pages automatically for every report or thesis you create.</p>
              </div>
            </div>

            {/* <div className="bg-surface p-8 rounded-[24px] shadow-soft border border-outline-variant/30 flex flex-col gap-4 animate-on-scroll hover:-translate-y-2 transition-transform duration-300 delay-200">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[32px]">quiz</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-foreground mb-2">Exam Master</h4>
                <p className="text-sm text-secondary leading-relaxed">Turn your notes into interactive quizzes and study schedules. Adaptive learning that focuses on your weak spots.</p>
              </div>
            </div> */}

            {/* <div className="bg-surface p-8 rounded-[24px] shadow-soft border border-outline-variant/30 flex flex-col gap-4 animate-on-scroll hover:-translate-y-2 transition-transform duration-300 delay-300">
              <div className="w-14 h-14 bg-secondary-container rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-foreground text-[32px]">terminal</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-foreground mb-2">Git-Inspired Versioning</h4>
                <p className="text-sm text-secondary leading-relaxed">Never lose a draft again. Track changes, branch out ideas, and merge final versions with professional-grade version control.</p>
              </div>
            </div> */}
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-16 lg:py-24 max-w-5xl mx-auto">
          <div className="bg-primary rounded-[32px] p-8 md:p-16 text-center text-white shadow-soft overflow-hidden relative animate-on-scroll flex flex-col items-center">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full translate-x-24 -translate-y-24"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-12 translate-y-12"></div>
            </div>
            <h3 className="text-3xl text-foreground lg:text-4xl font-bold mb-4 relative z-10 tracking-tight">Ready to master your studies?</h3>
            <p className="text-lg text-surface opacity-90 mb-10 relative z-10 max-w-lg">Join 50,000+ students already elevating their academic game with Verve.</p>
            <Link href="/signup" className="block sm:inline-block bg-surface-strong text-secondary font-bold text-base md:text-lg px-10 py-4 rounded-xl shadow-soft hover:bg-surface-strong active:scale-95 transition-all relative z-10 w-full sm:w-auto">
              Get Started Now
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-strong px-6 pt-16 pb-32 md:pb-16 border-t border-outline-variant/30 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Brand Column */}
          <div className="md:col-span-5 flex flex-col items-center md:items-start gap-6 text-center md:text-left border-b md:border-b-0 border-outline-variant/30 pb-8 md:pb-0">
            <div className="flex items-center gap-2">
              <img src="/verve_logo.png" alt="Verve Logo" className="h-10 w-auto" />
              <span className="font-bold text-3xl tracking-tight text-primary">Verve</span>
            </div>
            <p className="text-sm text-secondary max-w-sm">The premier academic productivity platform designed for students who demand excellence in every assignment.</p>
            <p className="text-xs font-semibold text-secondary tracking-wide mt-auto pt-4">© 2026 Verve. Open source under MIT.</p>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="flex flex-col gap-5">
              <h5 className="text-sm font-bold text-foreground uppercase tracking-wider">Product</h5>
              <nav className="flex flex-col gap-3">
                <Link className="text-sm text-secondary hover:text-primary transition-colors" href="#">Features</Link>
                <Link className="text-sm text-secondary hover:text-primary transition-colors" href="#">Templates</Link>
                <Link className="text-sm text-secondary hover:text-primary transition-colors" href="#">Pricing</Link>
                <Link className="text-sm text-secondary hover:text-primary transition-colors" href="#">Updates</Link>
              </nav>
            </div>
            <div className="flex flex-col gap-5">
              <h5 className="text-sm font-bold text-foreground uppercase tracking-wider">Company</h5>
              <nav className="flex flex-col gap-3">
                <Link className="text-sm text-secondary hover:text-primary transition-colors" href="#">About Us</Link>
                <Link className="text-sm text-secondary hover:text-primary transition-colors" href="#">Careers</Link>
                <Link className="text-sm text-secondary hover:text-primary transition-colors" href="#">Contact</Link>
                <Link className="text-sm text-secondary hover:text-primary transition-colors" href="#">Blog</Link>
              </nav>
            </div>
            <div className="flex flex-col gap-5 col-span-2 sm:col-span-1">
              <h5 className="text-sm font-bold text-foreground uppercase tracking-wider">Support</h5>
              <nav className="flex flex-col gap-3">
                <Link className="text-sm text-secondary hover:text-primary transition-colors" href="/feedback">Feedback</Link>
                <Link className="text-sm text-secondary hover:text-primary transition-colors" href="/cover">Cover pages</Link>
                {process.env.NEXT_PUBLIC_BUY_ME_A_COFFEE_URL ? (
                  <a
                    className="text-sm text-secondary hover:text-primary transition-colors"
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

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
