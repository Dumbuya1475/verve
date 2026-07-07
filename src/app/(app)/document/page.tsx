'use client';

import { useState, useRef, useEffect } from 'react';

type SectionType = 'mandatory' | 'main' | 'wrap-up' | 'custom';

interface Section {
  id: string;
  type: SectionType;
  title: string;
  subtitle: string;
  content: string;
  icon: string;
}

export default function DocumentBuilderPage() {
  const [sections, setSections] = useState<Section[]>([
    {
      id: 'section-intro',
      type: 'mandatory',
      title: 'Introduction',
      subtitle: '(MANDATORY)',
      icon: 'subject',
      content: 'Hook your audience here. Establish the primary thesis of your document and set the tone for what follows...',
    },
    {
      id: 'section-body',
      type: 'main',
      title: 'Body Section',
      subtitle: '(MAIN ARGUMENT)',
      icon: 'article',
      content: 'This is where the core analysis resides. Use clear evidence, professional reasoning, and structured data to support your claims...',
    },
    {
      id: 'section-conclusion',
      type: 'wrap-up',
      title: 'Conclusion',
      subtitle: '(WRAP-UP)',
      icon: 'check_circle',
      content: 'Summarize your findings. End with a strong closing statement or a call to action that leaves a lasting impression...',
    },
  ]);

  const [activeSectionId, setActiveSectionId] = useState<string>('section-intro');
  const [fontSize, setFontSize] = useState<'10pt' | '12pt'>('10pt');
  const [spacing, setSpacing] = useState<'1.5 Space' | 'Justified'>('1.5 Space');
  const [saveStatus, setSaveStatus] = useState('Saved 2m ago');
  const [docTitle, setDocTitle] = useState('Untitled Document');
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);

  // Refs for scrolling
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleScrollToSection = (id: string) => {
    setActiveSectionId(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleAddSection = () => {
    const newId = `section-custom-${Date.now()}`;
    setSections([...sections, {
      id: newId,
      type: 'custom',
      title: 'New Section',
      subtitle: '(CUSTOM)',
      icon: 'add_circle',
      content: '',
    }]);
    setTimeout(() => handleScrollToSection(newId), 100);
  };

  const handleContentChange = (id: string, newContent: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, content: newContent } : s));
  };

  const handleTitleChange = (id: string, newTitle: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, title: newTitle } : s));
  };

  const handleSaveDraft = () => {
    setSaveStatus('Saving...');
    setTimeout(() => {
      setSaveStatus('Saved just now');
    }, 600);
  };

  const handleFinalize = () => {
    alert("Document finalized! In a future update, this will export to Word or submit to your lecturer.");
  };

  // Dynamic canvas classes based on settings
  const canvasTextClass = fontSize === '10pt' ? 'text-sm' : 'text-base';
  const canvasLayoutClass = spacing === '1.5 Space' ? 'leading-relaxed text-left' : 'leading-normal text-justify';

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full max-h-[85vh]">
      
      {/* Left Sidebar: Settings & Structure */}
      <aside className="w-full md:w-80 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar shrink-0">
        
        {/* Document Info Card */}
        <div className="bg-surface-strong rounded-container p-6 shadow-soft flex flex-col gap-4">
          <h3 className="text-xl font-semibold text-foreground">Document Info</h3>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-secondary uppercase tracking-wider">Font Family</label>
            <div className="bg-surface p-2 rounded-control text-sm flex justify-between items-center border border-outline-variant/30">
              <span>Tahoma</span>
              <span className="material-symbols-outlined text-sm">unfold_more</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-secondary uppercase tracking-wider">Spacing & Alignment</label>
            <div className="flex gap-1">
              <button 
                onClick={() => setSpacing('1.5 Space')}
                className={`flex-1 p-1 rounded text-center text-xs font-medium transition-colors ${
                  spacing === '1.5 Space' ? 'bg-surface border border-primary/30 shadow-sm' : 'bg-surface border border-transparent text-secondary hover:text-foreground'
                }`}
              >
                1.5 Space
              </button>
              <button 
                onClick={() => setSpacing('Justified')}
                className={`flex-1 p-1 rounded text-center text-xs font-medium transition-colors ${
                  spacing === 'Justified' ? 'bg-surface border border-primary/30 shadow-sm' : 'bg-surface border border-transparent text-secondary hover:text-foreground'
                }`}
              >
                Justified
              </button>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-secondary uppercase tracking-wider">Font Size</label>
            <div className="flex items-center bg-surface p-1 rounded-control border border-outline-variant/30">
              <button 
                onClick={() => setFontSize('10pt')}
                className={`flex-1 py-1 text-sm font-medium rounded transition-colors ${
                  fontSize === '10pt' ? 'bg-surface-strong shadow-sm text-foreground' : 'text-secondary hover:text-foreground'
                }`}
              >
                10pt
              </button>
              <button 
                onClick={() => setFontSize('12pt')}
                className={`flex-1 py-1 text-sm font-medium rounded transition-colors ${
                  fontSize === '12pt' ? 'bg-surface-strong shadow-sm text-foreground' : 'text-secondary hover:text-foreground'
                }`}
              >
                12pt
              </button>
            </div>
          </div>
        </div>

        {/* Outline Card */}
        <div className="bg-surface-strong rounded-container p-6 shadow-soft flex flex-col gap-4 pb-8">
          <h3 className="text-xl font-semibold text-foreground">Structure</h3>
          <nav className="flex flex-col gap-2">
            {sections.map(section => (
              <div 
                key={section.id}
                onClick={() => handleScrollToSection(section.id)}
                className={`flex items-center gap-3 p-2 rounded-control cursor-pointer transition-colors ${
                  activeSectionId === section.id 
                    ? 'bg-primary/10 border-l-4 border-primary' 
                    : 'hover:bg-surface border-l-4 border-transparent'
                }`}
              >
                <span className={`material-symbols-outlined text-base ${
                  activeSectionId === section.id ? 'text-primary' : 'text-secondary'
                }`}>
                  {section.icon}
                </span>
                <span className={`text-sm font-medium ${
                  activeSectionId === section.id ? 'text-primary' : 'text-foreground'
                }`}>
                  {section.title}
                </span>
              </div>
            ))}
            
            <button 
              onClick={handleAddSection}
              className="mt-4 flex items-center justify-center gap-2 py-2 border-2 border-dashed border-outline-variant rounded-control text-sm font-medium text-secondary hover:bg-surface hover:text-foreground transition-all"
            >
              <span className="material-symbols-outlined text-base">add</span> Add Section
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content: Editor Area */}
      <section className="flex-1 flex flex-col gap-6 overflow-hidden">
        
        {/* Editor Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-surface-strong p-4 rounded-container shadow-soft gap-4 shrink-0">
          <div className="flex items-center gap-4">
            {editingTitleId === 'document' ? (
              <input 
                autoFocus
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                onBlur={() => setEditingTitleId(null)}
                onKeyDown={(e) => { if (e.key === 'Enter') setEditingTitleId(null); }}
                className="text-xl font-semibold text-foreground bg-transparent border-b-2 border-primary outline-none px-1 -ml-1 w-64"
              />
            ) : (
              <span 
                className="text-xl font-semibold text-foreground cursor-text hover:bg-outline-variant/20 rounded px-1 -ml-1 transition-colors"
                onDoubleClick={() => setEditingTitleId('document')}
                title="Double click to edit title"
              >
                {docTitle}
              </span>
            )}
            <span className="text-xs font-medium text-secondary bg-surface px-2 py-1 rounded-control border border-outline-variant/30">
              {saveStatus}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleSaveDraft}
              className="px-4 py-2 rounded-control text-sm font-medium text-secondary bg-surface hover:bg-surface-strong border border-outline-variant/30 transition-all focus-ring"
            >
              Save Draft
            </button>
            <button 
              onClick={handleFinalize}
              className="px-4 py-2 rounded-control text-sm font-bold text-primary-foreground bg-primary hover:bg-primary-container shadow-soft active:scale-95 transition-all focus-ring"
            >
              Finalize Document
            </button>
          </div>
        </div>

        {/* Editor Canvas */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-8 pb-12 pr-2">
          
          {sections.map(section => (
            <div 
              key={section.id}
              ref={el => { sectionRefs.current[section.id] = el }}
              className={`bg-surface-strong rounded-container shadow-soft overflow-hidden transition-all shrink-0 ${
                activeSectionId === section.id ? 'ring-2 ring-primary/20' : ''
              }`}
              onClick={() => setActiveSectionId(section.id)}
            >
              <div className="px-6 py-2 bg-surface flex items-center justify-between border-b border-outline-variant/30">
                {editingTitleId === section.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      autoFocus
                      type="text"
                      value={section.title}
                      onChange={(e) => handleTitleChange(section.id, e.target.value)}
                      onBlur={() => setEditingTitleId(null)}
                      onKeyDown={(e) => { if (e.key === 'Enter') setEditingTitleId(null); }}
                      className="text-xs font-semibold text-foreground uppercase tracking-widest bg-transparent border-b border-primary outline-none min-w-[150px]"
                    />
                    {section.subtitle && <span className="text-xs font-semibold text-secondary uppercase tracking-widest">{section.subtitle}</span>}
                  </div>
                ) : (
                  <span 
                    className="text-xs font-semibold text-secondary uppercase tracking-widest cursor-text hover:bg-outline-variant/20 rounded px-1 -ml-1 transition-colors"
                    onDoubleClick={() => setEditingTitleId(section.id)}
                    title="Double click to edit section name"
                  >
                    {section.title} {section.subtitle}
                  </span>
                )}
                <div className="flex gap-2">
                  <span className="material-symbols-outlined text-secondary text-sm cursor-pointer hover:text-primary transition-colors">drag_indicator</span>
                  <span className="material-symbols-outlined text-secondary text-sm cursor-pointer hover:text-primary transition-colors">more_vert</span>
                </div>
              </div>
              <div className="p-6">
                {/* Formatting Toolbar */}
                <div className="flex gap-1 mb-3 bg-surface-strong p-1 rounded-control border border-outline-variant/30 w-max shadow-sm">
                  <button onMouseDown={(e) => { e.preventDefault(); document.execCommand('bold', false); }} className="p-1.5 text-secondary hover:text-foreground hover:bg-surface rounded-md transition-colors" title="Bold">
                    <span className="material-symbols-outlined text-[18px] block">format_bold</span>
                  </button>
                  <button onMouseDown={(e) => { e.preventDefault(); document.execCommand('italic', false); }} className="p-1.5 text-secondary hover:text-foreground hover:bg-surface rounded-md transition-colors" title="Italic">
                    <span className="material-symbols-outlined text-[18px] block">format_italic</span>
                  </button>
                  <button onMouseDown={(e) => { e.preventDefault(); document.execCommand('underline', false); }} className="p-1.5 text-secondary hover:text-foreground hover:bg-surface rounded-md transition-colors" title="Underline">
                    <span className="material-symbols-outlined text-[18px] block">format_underlined</span>
                  </button>
                  <div className="w-[1px] bg-outline-variant/50 my-1 mx-1"></div>
                  <button onMouseDown={(e) => { e.preventDefault(); document.execCommand('justifyLeft', false); }} className="p-1.5 text-secondary hover:text-foreground hover:bg-surface rounded-md transition-colors" title="Align Left">
                    <span className="material-symbols-outlined text-[18px] block">format_align_left</span>
                  </button>
                  <button onMouseDown={(e) => { e.preventDefault(); document.execCommand('justifyCenter', false); }} className="p-1.5 text-secondary hover:text-foreground hover:bg-surface rounded-md transition-colors" title="Align Center">
                    <span className="material-symbols-outlined text-[18px] block">format_align_center</span>
                  </button>
                </div>
                
                {/* Editable Area */}
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentChange(section.id, e.currentTarget.innerHTML)}
                  className={`w-full outline-none bg-surface p-4 border-l-4 ${
                    activeSectionId === section.id ? 'border-primary' : 'border-primary/30'
                  } rounded-r-control focus:bg-white transition-all min-h-[150px] resize-y overflow-auto ${canvasTextClass} ${canvasLayoutClass} text-foreground`}
                  style={{ fontFamily: 'Tahoma, sans-serif' }}
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </div>
            </div>
          ))}

          {/* Decorative Asset */}
          <div className="relative w-full min-h-[192px] shrink-0 rounded-container overflow-hidden bg-surface border border-outline-variant/30 flex items-center justify-center pointer-events-none mt-4">
            <div className="text-center px-6 bg-surface-strong/50 py-4 rounded-xl backdrop-blur-sm border border-outline-variant/20">
              <span className="text-xl font-bold text-primary/60 block mb-1">Writing Assistant Active</span>
              <p className="text-sm text-secondary">Analyzing tone and structure for clarity.</p>
            </div>
          </div>
          
        </div>
      </section>
    </div>
  );
}
