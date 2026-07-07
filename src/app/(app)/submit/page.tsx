'use client';

import { useState } from 'react';

export default function SubmitPage() {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="max-w-[1280px] mx-auto py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-foreground mb-2">Submission & Export</h1>
        <p className="text-lg text-secondary">Finalize your project and sync with your repositories.</p>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column */}
        <div className="md:col-span-7 space-y-8">
          
          {/* Export as Word Document */}
          <div className="bg-surface p-6 rounded-xl shadow-soft flex flex-col md:flex-row items-start gap-6 group hover:-translate-y-0.5 transition-transform duration-300">
            <div className="w-14 h-14 shrink-0 rounded-xl bg-surface-strong flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[32px]">download</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">Export as Word Document</h3>
              <p className="text-base text-secondary mb-6 leading-relaxed">
                Generate a clean, professionally formatted .docx file containing all your project chapters, citations, and metadata ready for direct submission or further editing.
              </p>
              <button className="bg-coral text-white px-6 py-3 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity active:scale-95 shadow-sm">
                <span className="material-symbols-outlined text-[20px]">description</span>
                Download .docx
              </button>
            </div>
          </div>

          {/* Push to GitHub */}
          <div className="bg-surface p-6 rounded-xl shadow-soft">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-14 h-14 shrink-0 rounded-xl bg-surface-strong flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[32px]">lock</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">Push to GitHub</h3>
                <p className="text-base text-secondary mb-4">
                  Sync your latest changes to your private repository. Version control is managed automatically with academic metadata.
                </p>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-surface bg-gray-200"></div>
                  <div className="w-8 h-8 rounded-full border-2 border-surface bg-gray-300"></div>
                  <div className="w-8 h-8 rounded-full bg-secondary-container text-secondary flex items-center justify-center text-[10px] font-bold border-2 border-surface">
                    +3
                  </div>
                </div>
              </div>
            </div>

            {/* Dropzone */}
            <div
              className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-colors cursor-pointer mb-6 ${
                isDragging ? 'border-primary bg-primary/5 opacity-50' : 'border-outline-variant/50 bg-surface-strong hover:bg-surface-strong/80'
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
            >
              <span className={`material-symbols-outlined text-[48px] mb-4 transition-colors ${isDragging ? 'text-primary' : 'text-outline-variant/80'}`}>
                cloud_upload
              </span>
              <p className="text-base text-foreground font-medium">Drag files here or click to browse</p>
              <p className="text-xs text-secondary mt-1 font-semibold tracking-wider">MAXIMUM FILE SIZE: 50MB</p>
            </div>

            <div className="flex justify-end">
              <button className="bg-foreground text-background px-8 py-3 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity active:scale-95">
                <span className="material-symbols-outlined text-[20px]">publish</span>
                Deploy to GitHub
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="md:col-span-5">
          <div className="bg-surface p-6 rounded-xl shadow-soft sticky top-32">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 shrink-0 rounded-lg bg-secondary-container flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined">archive</span>
              </div>
              <h3 className="text-xl font-semibold">Compress & Send</h3>
            </div>
            
            <p className="text-base text-secondary mb-8 leading-relaxed">
              Bundle all project assets, including references and supplementary media, into a secure ZIP package sent directly to your supervisor.
            </p>

            {/* Attached File Mock */}
            <div className="bg-surface-strong border border-outline-variant/30 rounded-lg p-4 flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">gif_box</span>
                <div>
                  <p className="text-sm font-medium text-foreground">final_submission.zip</p>
                  <p className="text-xs font-semibold tracking-wider text-secondary">12.4 MB</p>
                </div>
              </div>
              <button className="text-secondary hover:text-error transition-colors p-1">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Form */}
            <div className="space-y-6 mb-10">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">Your Email</label>
                <input
                  type="email"
                  defaultValue="student@university.edu"
                  className="bg-surface-strong border-none rounded-lg p-4 text-base focus-ring focus:bg-surface transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">Lecturer Email</label>
                <input
                  type="email"
                  defaultValue="professor@university.edu"
                  className="bg-surface-strong border-none rounded-lg p-4 text-base focus-ring focus:bg-surface transition-all"
                />
              </div>
            </div>

            <button className="w-full bg-coral text-white py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-3 hover:opacity-95 transition-opacity active:scale-[0.98] shadow-sm">
              <span className="material-symbols-outlined text-[24px]">send</span>
              Compress & Email
            </button>
            
            <p className="text-center mt-6 text-xs font-semibold tracking-wider text-secondary px-4">
              By clicking, you agree to Verve's academic integrity policy and data handling terms.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
