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
    <div className="flex flex-col min-h-screen bg-background font-sans pb-20 md:pb-0">
      
      {/* Top Header */}
      <header className="bg-background/90 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">school</span>
            <span className="font-bold text-xl tracking-tight text-primary">Verve</span>
          </div>
          <Link href="/cover" className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-control hover:scale-105 active:scale-95 transition-all shadow-soft">
            Connect GitHub
          </Link>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="px-4 pt-12 pb-8 flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-secondary-container text-secondary px-4 py-1.5 rounded-full mb-6 animate-[fadeIn_0.8s_ease-out_forwards]">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span className="text-xs font-bold tracking-wide uppercase">Academic Excellence Platform</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight leading-tight">
            Elevate Your <br className="md:hidden" />Academic Potential
          </h1>
          
          <p className="text-base md:text-lg text-secondary mb-8 max-w-md mx-auto">
            Transform your studies with AI-powered document creation, interactive version control, and comprehensive exam preparation tools.
          </p>
          
          <div className="flex flex-col sm:flex-row w-full gap-4 justify-center">
            <Link href="/cover" className="bg-coral text-white font-semibold text-base py-3 px-8 rounded-xl shadow-soft hover:brightness-110 active:scale-95 transition-all w-full sm:w-auto text-center">
              Get Started Free
            </Link>
            <Link href="/document" className="bg-surface-strong text-foreground font-semibold text-base py-3 px-8 rounded-xl hover:bg-surface border border-outline-variant/30 active:scale-95 transition-all w-full sm:w-auto text-center">
              View Demo
            </Link>
          </div>

          {/* Hero Mockup */}
          <div className="mt-12 w-full relative group animate-on-scroll">
            <div className="absolute -inset-1 bg-gradient-to-r from-coral/20 to-primary/20 rounded-[32px] blur-xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>
            <div className="relative bg-surface rounded-[24px] shadow-soft overflow-hidden border border-outline-variant/30">
              <img 
                className="w-full h-auto object-cover" 
                alt="App Dashboard Preview" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDh7giMISESVyvcd9RRxUFrS_Vy_4gTP-oOzqjyA5XYeopwQ4mE1LpTqLkl4B1d1D-3WPDzaR19KyYXLOUYmQSZrLdDKBG4e0ceYS1htOvznbw3nJdtZHu9Bj5rEWw5Wnl5GXKd_JR3hnkna7oMJ2FBZ5yacwsd6r38-U85G9jR7jEUcxmTrAdxO3PZLRd3Ad0NcF6xHkpdZv-6hZJHddFHLvSG2EuJe-BumxU0Mr5BpC3RFmCWk9rVbUIS6MIHuxqbt8-QQ5INNaL3" 
              />
            </div>
          </div>
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
        <section className="px-4 py-12 max-w-xl mx-auto space-y-6">
          <div className="flex flex-col items-center mb-10">
            <h3 className="text-2xl font-bold text-foreground text-center">Built for Modern Scholars</h3>
            <div className="h-1 w-12 bg-coral rounded-full mt-3"></div>
          </div>

          <div className="bg-surface p-6 rounded-[24px] shadow-soft border border-outline-variant/30 flex flex-col gap-4 animate-on-scroll">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[28px]">edit_note</span>
            </div>
            <div>
              <h4 className="text-xl font-bold text-foreground mb-1.5">AI Document Builder</h4>
              <p className="text-sm text-secondary leading-relaxed">Smart formatting and content suggestions that help you draft academic papers 3x faster while maintaining rigorous standards.</p>
            </div>
          </div>

          <div className="bg-surface p-6 rounded-[24px] shadow-soft border border-outline-variant/30 flex flex-col gap-4 animate-on-scroll">
            <div className="w-12 h-12 bg-secondary-container rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-[28px]">description</span>
            </div>
            <div>
              <h4 className="text-xl font-bold text-foreground mb-1.5">Cover Design</h4>
              <p className="text-sm text-secondary leading-relaxed">Generate professional, institution-compliant cover pages automatically for every report or thesis you create.</p>
            </div>
          </div>

          <div className="bg-surface p-6 rounded-[24px] shadow-soft border border-outline-variant/30 flex flex-col gap-4 animate-on-scroll">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[28px]">quiz</span>
            </div>
            <div>
              <h4 className="text-xl font-bold text-foreground mb-1.5">Exam Master</h4>
              <p className="text-sm text-secondary leading-relaxed">Turn your notes into interactive quizzes and study schedules. Adaptive learning that focuses on your weak spots.</p>
            </div>
          </div>

          <div className="bg-surface p-6 rounded-[24px] shadow-soft border border-outline-variant/30 flex flex-col gap-4 animate-on-scroll">
            <div className="w-12 h-12 bg-secondary-container rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-foreground text-[28px]">terminal</span>
            </div>
            <div>
              <h4 className="text-xl font-bold text-foreground mb-1.5">Git-Inspired Versioning</h4>
              <p className="text-sm text-secondary leading-relaxed">Never lose a draft again. Track changes, branch out ideas, and merge final versions with professional-grade version control.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-12 max-w-xl mx-auto">
          <div className="bg-coral rounded-[32px] p-8 text-center text-white shadow-soft overflow-hidden relative animate-on-scroll">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -translate-x-8 translate-y-8"></div>
            </div>
            <h3 className="text-2xl font-bold mb-4 relative z-10">Ready to master your studies?</h3>
            <p className="text-base opacity-90 mb-8 relative z-10">Join 50,000+ students already elevating their academic game with Verve.</p>
            <Link href="/cover" className="block bg-white text-coral font-bold text-base px-6 py-4 rounded-xl shadow-soft hover:bg-surface-strong active:scale-95 transition-all relative z-10 w-full">
              Get Started Now
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-strong px-6 pt-12 pb-32 border-t border-outline-variant/30 mt-8">
        <div className="grid grid-cols-2 gap-8 mb-10 max-w-xl mx-auto">
          <div className="flex flex-col gap-4">
            <h5 className="text-sm font-bold text-foreground uppercase tracking-wider">Product</h5>
            <nav className="flex flex-col gap-3">
              <Link className="text-sm text-secondary hover:text-primary transition-colors" href="#">Features</Link>
              <Link className="text-sm text-secondary hover:text-primary transition-colors" href="#">Templates</Link>
              <Link className="text-sm text-secondary hover:text-primary transition-colors" href="#">Pricing</Link>
            </nav>
          </div>
          <div className="flex flex-col gap-4">
            <h5 className="text-sm font-bold text-foreground uppercase tracking-wider">Company</h5>
            <nav className="flex flex-col gap-3">
              <Link className="text-sm text-secondary hover:text-primary transition-colors" href="#">About Us</Link>
              <Link className="text-sm text-secondary hover:text-primary transition-colors" href="#">Careers</Link>
              <Link className="text-sm text-secondary hover:text-primary transition-colors" href="#">Terms</Link>
            </nav>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-6 max-w-xl mx-auto border-t border-outline-variant/30 pt-8">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">school</span>
            <span className="font-bold text-2xl tracking-tight text-primary">Verve</span>
          </div>
          <p className="text-xs font-semibold text-secondary tracking-wide">© 2026 Verve Academic. All rights reserved.</p>
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
