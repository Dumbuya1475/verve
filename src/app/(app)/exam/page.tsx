'use client';

import { useState } from 'react';

const MOCK_QUESTIONS = [
  {
    id: 1,
    question: "Explain the significance of Consistency in a partitioned distributed network.",
    preview: `"Consistency ensures that every read receives the most recent write or an error. In a partitioned network (P), one must choose between consistency (C) and availability (A)..."`
  },
  {
    id: 2,
    question: "How does Paxos handle consensus in the presence of faulty nodes?",
    isLoading: true
  }
];

const MOCK_SLIDES = [
  {
    id: 1,
    title: 'Slide 1',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmrYHV1KVXdH-aLZscxfah7IX-nL9Zdk_TF-bpmK5bTkNbkKiEIhRkzlOc6HmOXyOC5SXmQbqpbHiCmOqVEM9WmV4gIklbAJbKHW0kCTf7Lb7PXC86LWr9lrEh8ZZV8Fi0xXU-LNUt5zXhKUU8666klUGa5PhnzDZYWu26ljR2mQKqsqXjHVScu2NdnJzsOcS0A0flxHI33CRbj16tbwXZotig5rFjmpn6NnS6yBjzkHGR8QGDqAYb3zyi2XJ0hR_7SZP-m3lch6j3',
    keyPoints: [
      'Introduce Cloud Architecture evolution',
      'Explain "Monolith to Microservices" shift',
      'Bridge to the 3-tier structure diagram'
    ],
    script: `"Welcome everyone. Today we're diving deep into the foundations of modern cloud architecture. If you look at the first diagram, you'll see how we've moved away from the restrictive monoliths of the early 2000s toward the flexible, scalable microservices of today. This transition isn't just about code—it's about how organizations deliver value at speed..."`
  },
  {
    id: 2,
    title: 'Slide 2',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmrYHV1KVXdH-aLZscxfah7IX-nL9Zdk_TF-bpmK5bTkNbkKiEIhRkzlOc6HmOXyOC5SXmQbqpbHiCmOqVEM9WmV4gIklbAJbKHW0kCTf7Lb7PXC86LWr9lrEh8ZZV8Fi0xXU-LNUt5zXhKUU8666klUGa5PhnzDZYWu26ljR2mQKqsqXjHVScu2NdnJzsOcS0A0flxHI33CRbj16tbwXZotig5rFjmpn6NnS6yBjzkHGR8QGDqAYb3zyi2XJ0hR_7SZP-m3lch6j3',
    keyPoints: [
      'Define CAP Theorem',
      'Discuss Trade-offs in real-world scenarios'
    ],
    script: `"Here we see the classic CAP Theorem triangle. As we established, you can only pick two. Notice how modern databases position themselves. Cassandra favors AP, while HBase goes for CP..."`
  },
  {
    id: 3,
    title: 'Slide 3',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmrYHV1KVXdH-aLZscxfah7IX-nL9Zdk_TF-bpmK5bTkNbkKiEIhRkzlOc6HmOXyOC5SXmQbqpbHiCmOqVEM9WmV4gIklbAJbKHW0kCTf7Lb7PXC86LWr9lrEh8ZZV8Fi0xXU-LNUt5zXhKUU8666klUGa5PhnzDZYWu26ljR2mQKqsqXjHVScu2NdnJzsOcS0A0flxHI33CRbj16tbwXZotig5rFjmpn6NnS6yBjzkHGR8QGDqAYb3zyi2XJ0hR_7SZP-m3lch6j3',
    keyPoints: [
      'Summarize key takeaways',
      'Open the floor for Q&A'
    ],
    script: `"To wrap up, distributed systems aren't about eliminating failure, they are about building systems that expect and handle failure gracefully. Thank you for your time, I'll now take any questions."`
  }
];

export default function ExamMasterPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [activeSlideId, setActiveSlideId] = useState(1);

  const activeSlide = MOCK_SLIDES.find(s => s.id === activeSlideId) || MOCK_SLIDES[0];

  return (
    <div className="w-full flex flex-col gap-8 pb-12">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Exam & Slide Master</h1>
        <p className="text-lg text-secondary max-w-2xl">Upload your assets to generate predictive guides and presentation scripts.</p>
      </div>

      {/* Upper Content: Upload and History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Asset Upload Dropzone */}
        <div className="lg:col-span-8">
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
            className={`bg-surface-strong border-2 border-dashed rounded-container p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer min-h-[240px] ${
              isDragging ? 'border-primary bg-primary/5' : 'border-outline-variant/50 hover:border-primary'
            }`}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
              isDragging ? 'bg-primary/20' : 'bg-primary/10'
            }`}>
              <span className="material-symbols-outlined text-primary text-3xl">upload_file</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Drop study materials here</h3>
            <p className="text-base text-secondary mb-6">Supports PDF, MP3 recordings, and PPTX slides.</p>
            <button className="bg-surface text-foreground px-6 py-3 rounded-control font-medium hover:bg-surface-strong border border-outline-variant/30 shadow-sm transition-colors">
              Select Files
            </button>
          </div>
        </div>

        {/* Recent Uploads */}
        <div className="lg:col-span-4 bg-surface-strong rounded-container shadow-soft p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-tertiary uppercase tracking-wider">Recent Uploads</h3>
            <span className="material-symbols-outlined text-secondary cursor-pointer">history</span>
          </div>
          
          <div className="space-y-4 overflow-y-auto max-h-[160px] custom-scrollbar pr-2">
            {/* Upload Item: Processing */}
            <div className="flex items-center justify-between p-4 bg-surface rounded-control border border-outline-variant/30">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary">picture_as_pdf</span>
                <div>
                  <p className="text-sm font-medium text-foreground truncate max-w-[150px]">Lecture_12_Cloud_Arch.pdf</p>
                  <p className="text-[10px] text-secondary font-bold uppercase mt-0.5">Processing...</p>
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            </div>
            
            {/* Upload Item: Ready */}
            <div className="flex items-center justify-between p-4 bg-surface rounded-control border border-outline-variant/30">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-secondary">description</span>
                <div>
                  <p className="text-sm font-medium text-foreground truncate max-w-[150px]">System_Design_Final.pptx</p>
                  <p className="text-[10px] text-secondary font-bold uppercase mt-0.5">Ready</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-secondary text-sm">check_circle</span>
            </div>
          </div>
        </div>
      </div>

      {/* Workspace Area: Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Predicted Exam Study Guide */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-surface-strong rounded-container shadow-soft p-6 border-l-4 border-primary">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
              <h2 className="text-xl font-semibold text-foreground">Predicted Exam Study Guide</h2>
            </div>
            
            {/* AI Insights Box */}
            <div className="bg-primary/5 p-6 rounded-control mb-6 border border-primary/20">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-0.5">auto_awesome</span>
                <div>
                  <h4 className="text-sm font-bold text-primary mb-1">AI Insight: Core Focus Area</h4>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    The analyzed materials indicate a 75% probability of a heavy focus on <span className="font-bold text-primary">Distributed Systems</span> and CAP Theorem trade-offs in your upcoming exam.
                  </p>
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="flex flex-col gap-6">
              {MOCK_QUESTIONS.map(q => (
                <div key={q.id} className="p-6 bg-surface rounded-container border border-outline-variant/30 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold px-3 py-1 bg-secondary/10 text-secondary rounded-full">
                      Question {q.id}
                    </span>
                    <span className="material-symbols-outlined text-secondary hover:text-primary cursor-pointer transition-colors">bookmark</span>
                  </div>
                  
                  <p className="text-lg font-medium text-foreground mb-4">{q.question}</p>
                  
                  {q.isLoading ? (
                    <div className="animate-pulse flex flex-col gap-2">
                      <div className="h-4 w-3/4 bg-surface-strong rounded"></div>
                      <div className="h-4 w-1/2 bg-surface-strong rounded"></div>
                    </div>
                  ) : (
                    <div className="p-4 bg-surface-strong rounded-control border-l-2 border-primary/30">
                      <p className="text-xs font-bold text-tertiary mb-1 uppercase tracking-wider">Suggested Answer Preview</p>
                      <p className="text-sm text-foreground/80 italic leading-relaxed">{q.preview}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-4 border-2 border-primary text-primary font-bold rounded-control hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 focus-ring">
              <span className="material-symbols-outlined">add_circle</span>
              Generate 10 More Questions
            </button>
          </div>
        </section>

        {/* Right Column: Presentation Speaker Script */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-surface-strong rounded-container shadow-soft overflow-hidden flex flex-col h-full min-h-[600px]">
            
            <div className="p-6 border-b border-outline-variant/20">
              <div className="flex items-center gap-3 mb-0">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>present_to_all</span>
                <h2 className="text-xl font-semibold text-foreground">Presentation Speaker Script</h2>
              </div>
            </div>

            {/* Image Preview */}
            <div className="relative h-48 w-full group bg-surface">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10 flex items-center justify-center">
                <button className="bg-white/90 p-3 rounded-full text-primary shadow-lg scale-90 group-hover:scale-100 transition-transform">
                  <span className="material-symbols-outlined text-3xl">play_circle</span>
                </button>
              </div>
              <img 
                className="w-full h-full object-cover" 
                alt="Presentation Slide Preview" 
                src={activeSlide.image} 
              />
            </div>

            {/* Script Content Area */}
            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6">
              
              {/* Tab Navigation */}
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  {MOCK_SLIDES.map(slide => (
                    <button 
                      key={slide.id}
                      onClick={() => setActiveSlideId(slide.id)}
                      className={`font-medium pb-1 transition-colors ${
                        activeSlideId === slide.id 
                          ? 'text-primary border-b-2 border-primary font-bold' 
                          : 'text-secondary hover:text-primary'
                      }`}
                    >
                      {slide.title}
                    </button>
                  ))}
                </div>
                <span className="material-symbols-outlined text-secondary cursor-pointer hover:text-primary transition-colors">settings</span>
              </div>

              {/* Key Points */}
              <div className="bg-surface p-4 rounded-control border border-outline-variant/30">
                <h5 className="text-xs font-bold text-tertiary uppercase tracking-wider mb-3">Key Points</h5>
                <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
                  {activeSlide.keyPoints.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>

              {/* Full Script */}
              <div className="relative">
                <h5 className="text-xs font-bold text-tertiary uppercase tracking-wider mb-3">Full Script</h5>
                <div className="bg-surface p-6 rounded-control border border-outline-variant/30 text-base leading-relaxed text-foreground mb-4">
                  {activeSlide.script}
                </div>
                <div className="absolute -bottom-4 right-4">
                  <button className="bg-surface-strong text-foreground text-sm shadow-md rounded-full px-4 py-2 border border-outline-variant/30 flex items-center gap-1 hover:bg-surface transition-colors">
                    <span className="material-symbols-outlined text-sm">unfold_more</span>
                    Expand Script
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-6 bg-surface border-t border-outline-variant/20 flex justify-between items-center mt-auto">
              <p className="text-xs font-medium text-secondary">Last generated 2 mins ago</p>
              <button className="bg-secondary text-white px-4 py-2 rounded-control font-medium hover:bg-foreground transition-colors flex items-center gap-2 focus-ring">
                <span className="material-symbols-outlined text-sm">file_download</span>
                Export Script
              </button>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
