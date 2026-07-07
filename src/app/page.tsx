import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="bg-surface text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md">
        <div className="flex justify-between items-center px-6 md:px-10 max-w-6xl mx-auto w-full h-20">
          <div className="text-3xl font-bold text-primary tracking-tight">CommitCraft</div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-secondary font-semibold text-sm hover:text-primary px-4 py-2 transition-all">Login</Link>
            <Link href="/login" className="bg-primary text-primary-foreground px-6 py-2 rounded-control text-sm font-bold hover:scale-105 active:scale-95 transition-all shadow-soft">
              Connect GitHub
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32">
          <div className="max-w-6xl mx-auto px-6 md:px-10 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-1 bg-secondary-container text-foreground px-4 py-1 rounded-full text-xs font-semibold tracking-wider mb-4">
                <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                AI-Powered Academic Workflow
              </div>
              <h1 className="text-4xl lg:text-[64px] lg:leading-[72px] font-bold tracking-tight">
                Elevate Your <br /><span className="text-primary">Academic Potential</span>
              </h1>
              <p className="text-lg text-secondary max-w-xl mx-auto lg:mx-0">
                The all-in-one suite for ambitious students. Craft stunning document covers, build research papers with AI assistance, and master your exams with ease.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Link href="/cover" className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-soft flex items-center justify-center gap-2">
                  Get Started Free
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <Link href="/cover" className="bg-surface-strong text-secondary px-8 py-3 rounded-full font-bold text-lg hover:bg-surface transition-all shadow-soft border border-outline-variant/40 flex items-center justify-center gap-2">
                  View Demo
                </Link>
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              <div className="bg-surface-strong/70 backdrop-blur-md border border-surface-strong p-6 rounded-[32px] shadow-soft rotate-2 relative z-20">
                <img 
                  className="w-full h-auto rounded-xl" 
                  alt="CommitCraft interface preview" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-YPemcxQjXxSS7Fpoit4zVpg_mKcBr1ECMPCq_E7nQ-Y6IWvrbaUHN3ihhhrqFSgLYcS2bPMK5AEjxaq03_XnFpIM2VHApKoXXnS1ocG6ZIoZQFA25q5a68q3xtVy43iTbYiqwzzvw2rfrOIgO528OKypRDlYMm_ceYe8SNDJQok80UYE1arwf6FBoSP5TJooKnchMrDey_FSdhAEQRNszL9ofB6LKXr4nis5i0nFX6WGsH6qhkJnq3aCs0nYjjSPC8Fn01wmXrOU" 
                />
              </div>
              
              {/* Decorative Floating Elements */}
              <div className="absolute -top-12 -right-12 bg-surface-strong/80 backdrop-blur-md p-4 rounded-container shadow-soft -rotate-6 z-30 flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary-foreground">
                  <span className="material-symbols-outlined">auto_fix_high</span>
                </div>
                <div>
                  <p className="text-sm font-bold">AI Assistant</p>
                  <p className="text-xs text-secondary">Enhancing draft...</p>
                </div>
              </div>
              
              <div className="absolute -bottom-8 -left-8 bg-surface-strong/90 p-4 rounded-container shadow-soft rotate-3 z-10">
                <div className="flex items-center gap-1 mb-2">
                  <span className="material-symbols-outlined text-primary">verified</span>
                  <span className="text-xs font-bold uppercase">Document Grade</span>
                </div>
                <div className="h-2 w-32 bg-outline-variant/40 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[92%]"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-16 bg-surface-strong">
          <div className="max-w-6xl mx-auto px-6 md:px-10">
            <p className="text-center text-xs font-semibold tracking-wider text-secondary mb-8 uppercase">TRUSTED BY AMBITIOUS STUDENTS AT</p>
            <div className="flex flex-wrap justify-center items-center gap-16 grayscale opacity-60">
              <div className="text-xl font-bold">STANFORD</div>
              <div className="text-xl font-bold">OXFORD</div>
              <div className="text-xl font-bold">MIT</div>
              <div className="text-xl font-bold">HARVARD</div>
              <div className="text-xl font-bold">SORBONNE</div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="py-32 bg-surface">
          <div className="max-w-6xl mx-auto px-6 md:px-10">
            <div className="text-center mb-24">
              <h2 className="text-4xl font-bold tracking-tight mb-4">Academic Excellence, <span className="text-primary">Simplified</span></h2>
              <p className="text-lg text-secondary max-w-2xl mx-auto">Everything you need to succeed in your academic journey, from initial research to the final exam.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Feature 1: Document Builder */}
              <div className="md:col-span-8 bg-surface-strong rounded-[32px] p-8 shadow-soft flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
                <div className="max-w-md">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                    <span className="material-symbols-outlined">edit_note</span>
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">AI Document Builder</h3>
                  <p className="text-base text-secondary">
                    Focus on your ideas while our AI handles the formatting, citations, and structure. Seamlessly integrate your research notes into polished papers.
                  </p>
                </div>
                <div className="mt-8 pt-8 border-t border-outline-variant/30 flex items-center justify-between">
                  <span className="text-sm font-bold group-hover:text-primary transition-colors">Learn about the Builder</span>
                  <span className="material-symbols-outlined text-primary">arrow_right_alt</span>
                </div>
                <div className="mt-8 rounded-xl overflow-hidden h-48 bg-surface">
                  <img 
                    className="w-full h-full object-cover" 
                    alt="Document Builder UI" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuACsY_ppEWLs-5FSpjNk7MqOqFwQXB8TjUmrUUwf1HFOUk7_ADoilzZ9mqQsRc8R6dQFf8qLF73Blfdu27atHPDgAeq6X9C6Z8ddVUBzvjy1G2aH3zpoD2ECvcQM_bDUx0ZK1xqS7h0eCVpqef2ktCtgNDDflFLwFHiq3zZZs4TA-Bag4qCGHDTVIBJjfYXPiGSPmkyrBzZcSTwnZ2jOXKxi-t_4LNgj3BYxaFBUzL5d30mmUc8SOK2UdE4LGMrbJkTmCQwuoTR0Bd5" 
                  />
                </div>
              </div>

              {/* Feature 2: Cover Generator */}
              <div className="md:col-span-4 bg-primary rounded-[32px] p-8 shadow-soft text-primary-foreground flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
                <div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white mb-4">
                    <span className="material-symbols-outlined">palette</span>
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">Cover Design</h3>
                  <p className="text-base opacity-90">
                    Create professional cover pages in seconds. Choose from dozens of academic templates.
                  </p>
                </div>
                <div className="mt-20">
                  <div className="flex -space-x-4 mb-4">
                    <div className="w-24 h-32 bg-white/20 rounded-lg border-2 border-white/40 rotate-[-10deg]"></div>
                    <div className="w-24 h-32 bg-white/40 rounded-lg border-2 border-white/60 z-10"></div>
                    <div className="w-24 h-32 bg-surface-strong rounded-lg shadow-soft z-20 rotate-[10deg] flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-primary-container"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 3: Master Hub */}
              <div className="md:col-span-4 bg-secondary-container rounded-[32px] p-8 shadow-soft flex flex-col group hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-surface-strong rounded-xl flex items-center justify-center text-secondary mb-4">
                  <span className="material-symbols-outlined">quiz</span>
                </div>
                <h3 className="text-2xl font-semibold mb-2">Exam Master</h3>
                <p className="text-base text-secondary">
                  Transform your slides and notes into interactive flashcards and practice exams automatically.
                </p>
              </div>

              {/* Feature 4: Collaboration */}
              <div className="md:col-span-8 bg-foreground text-background rounded-[32px] p-8 shadow-soft flex items-center gap-8 group hover:-translate-y-1 transition-all duration-300">
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-2">Git-Inspired Versioning</h3>
                  <p className="text-base opacity-80">
                    Never lose a draft again. Track every change, branch out your ideas, and merge collaboration seamlessly. It's version control for academics.
                  </p>
                  <button className="mt-6 px-4 py-2 border border-white/20 rounded-full text-sm font-medium hover:bg-white/10 transition-all">Explore Git Sync</button>
                </div>
                <div className="hidden sm:flex w-1/3 bg-white/5 rounded-2xl h-48 flex-col p-4 gap-2">
                  <div className="h-2 w-full bg-white/20 rounded-full"></div>
                  <div className="h-2 w-3/4 bg-white/20 rounded-full"></div>
                  <div className="h-2 w-1/2 bg-primary rounded-full"></div>
                  <div className="h-2 w-full bg-white/20 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 md:px-10 text-center">
            <div className="bg-primary/10 p-12 rounded-[48px] shadow-soft relative border border-primary/20">
              <div className="relative z-10 py-8">
                <h2 className="text-4xl font-bold tracking-tight text-foreground mb-4">Ready to master your studies?</h2>
                <p className="text-lg text-secondary max-w-xl mx-auto mb-8">
                  Join 50,000+ students who are already using CommitCraft to stay organized, focus better, and achieve higher grades.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/cover" className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold text-lg shadow-soft hover:scale-105 active:scale-95 transition-all">
                    Get Started Now — It's Free
                  </Link>
                  <Link href="/cover" className="bg-surface-strong text-secondary px-8 py-3 rounded-full font-bold text-lg shadow-soft hover:bg-surface border border-outline-variant/30 transition-all">
                    Contact Sales
                  </Link>
                </div>
                <p className="mt-6 text-xs font-semibold text-secondary uppercase tracking-wider">No credit card required. Cancel anytime.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-strong pt-24 pb-12 border-t border-outline-variant/30">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-24">
            <div className="col-span-2">
              <div className="text-3xl font-bold tracking-tight text-primary mb-4">CommitCraft</div>
              <p className="text-secondary text-base max-w-xs">
                Defining the next generation of academic productivity. Built for the modern scholar.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold tracking-wider uppercase mb-6">Product</h4>
              <ul className="space-y-3 text-secondary text-sm">
                <li><Link href="/cover" className="hover:text-primary transition-colors">Cover Generator</Link></li>
                <li><Link href="/document" className="hover:text-primary transition-colors">AI Builder</Link></li>
                <li><Link href="/exam" className="hover:text-primary transition-colors">Exam Master</Link></li>
                <li><Link href="/submit" className="hover:text-primary transition-colors">Git Sync</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold tracking-wider uppercase mb-6">Company</h4>
              <ul className="space-y-3 text-secondary text-sm">
                <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold tracking-wider uppercase mb-6">Support</h4>
              <ul className="space-y-3 text-secondary text-sm">
                <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Twitter</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">LinkedIn</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Status</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-outline-variant/30">
            <p className="text-xs text-secondary mb-4 md:mb-0">© 2026 CommitCraft Technologies Inc. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-secondary hover:text-primary"><span className="material-symbols-outlined">language</span></Link>
              <Link href="#" className="text-secondary hover:text-primary"><span className="material-symbols-outlined">alternate_email</span></Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
