'use client';

import { useState, useRef } from 'react';

type SectionType = 'mandatory' | 'main' | 'wrap-up' | 'custom';

interface Section {
  id: string;
  type: SectionType;
  title: string;
  subtitle: string;
  content: string;
  icon: string;
}

const PreviewA4 = ({ sections, fontSize, spacing, docTitle }: { sections: Section[], fontSize: string, spacing: string, docTitle: string }) => {
  const pixelSize = fontSize === '10pt' ? '13px' : '16px';
  const textAlign = spacing === 'Justified' ? 'justify' : 'left';
  const lineHeight = spacing === '1.5 Space' ? '1.5' : '1.2';

  // Extract headings from all sections for the TOC
  const extractHeadings = () => {
    const headings: { level: number, text: string }[] = [];
    sections.forEach(section => {
      // Basic regex to find h1, h2, h3 tags and their content
      const regex = /<h([1-3])[^>]*>(.*?)<\/h\1>/gi;
      let match;
      while ((match = regex.exec(section.content)) !== null) {
        // Remove nested HTML tags from the heading text if any
        const cleanText = match[2].replace(/<[^>]+>/g, '').trim();
        if (cleanText) {
          headings.push({ level: parseInt(match[1]), text: cleanText });
        }
      }
    });
    return headings;
  };

  const tocHeadings = extractHeadings();

  return (
    <div
      className="w-full max-w-3xl shrink-0 flex flex-col text-foreground bg-white shadow-soft p-8 md:p-12 relative transition-all min-h-[800px]"
    >
      <div className="flex flex-col gap-6" style={{ fontSize: pixelSize, lineHeight, textAlign }}>
        {/* Table of Contents */}
        {tocHeadings.length > 0 && (
          <div className="mb-8 w-full max-w-2xl mx-auto">
            <h2 className="font-bold mb-6 text-[1.2em] text-center">Table of Contents</h2>
            <div className="flex flex-col space-y-3">
              {tocHeadings.map((h, i) => (
                <div key={i} className={`flex items-baseline font-medium ${h.level === 1 ? 'ml-0 font-bold' : h.level === 2 ? 'ml-6' : 'ml-12'}`}>
                  <span className="bg-white pr-2">{h.text}</span>
                  <span className="flex-1 border-b-[2px] border-dotted border-black mx-2 relative top-[-6px]"></span>
                  <span className="bg-white pl-2">_</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {sections.map(section => (
          <div key={section.id}>
            {section.type !== 'mandatory' && section.title && (
              <h2 className="font-bold mb-2 text-[1.1em]">{section.title}</h2>
            )}
            <div dangerouslySetInnerHTML={{ __html: section.content || '<p class="text-gray-300 italic">Empty section...</p>' }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default function DocumentBuilderPage() {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  const [sections, setSections] = useState<Section[]>([
    {
      id: 'section-intro',
      type: 'mandatory',
      title: 'Introduction',
      subtitle: '(MANDATORY)',
      icon: 'first_page',
      content: 'This is the beginning of the document...',
    },
    {
      id: 'section-body',
      type: 'main',
      title: 'Body Section',
      subtitle: '(MAIN ARGUMENT)',
      icon: 'segment',
      content: 'Here lies the core analysis and evidence...',
    },
    {
      id: 'section-conclusion',
      type: 'wrap-up',
      title: 'Conclusion',
      subtitle: '(WRAP-UP)',
      icon: 'last_page',
      content: 'In conclusion, the findings indicate...',
    },
  ]);

  const [activeSectionId, setActiveSectionId] = useState<string>('section-intro');
  const [fontSize, setFontSize] = useState<'10pt' | '12pt'>('10pt');
  const [spacing, setSpacing] = useState<'1.5 Space' | 'Justified'>('1.5 Space');
  const [docTitle, setDocTitle] = useState('Untitled Document');
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);

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
      icon: 'article',
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

  const exportDocumentPDF = async () => {
    // We isolate the export in a hidden iframe to prevent html2canvas from 
    // crashing on Next.js Turbopack's modern CSS (lab/oklch) stylesheets.
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '210mm';
    iframe.style.height = '297mm';
    iframe.style.top = '-9999px';
    document.body.appendChild(iframe);

    const pixelSize = fontSize === '10pt' ? '13px' : '16px';
    const textAlign = spacing === 'Justified' ? 'justify' : 'left';
    const lineHeight = spacing === '1.5 Space' ? '1.5' : '1.2';

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { 
              margin: 0; 
              font-family: Tahoma, sans-serif; 
              background: white; 
              color: black; 
              width: 170mm; /* 210mm - 40mm margins */
              box-sizing: border-box;
            }
            .university-page-section {
              page-break-before: always;
              page-break-inside: auto;
              width: 100%;
            }
            .university-page-section:first-child {
              page-break-before: avoid;
            }
            .toc { margin-bottom: 32px; width: 100%; max-width: 600px; margin-left: auto; margin-right: auto; }
            .toc h2 { text-align: center; margin-bottom: 24px; font-size: 1.2em; font-weight: bold; text-transform: uppercase; border-bottom: 2px solid black; padding-bottom: 8px; }
            .toc-row { display: flex; align-items: baseline; margin-bottom: 12px; font-weight: bold; }
            .toc-text { background: white; padding-right: 8px; }
            .toc-dots { flex-grow: 1; border-bottom: 2px dotted black; position: relative; top: -6px; margin: 0 4px; }
            .toc-page { background: white; padding-left: 8px; }
            h1 { text-align: center; margin-bottom: 48px; text-transform: uppercase; font-size: 24px; }
            .content-wrapper { font-size: ${pixelSize}; line-height: ${lineHeight}; text-align: ${textAlign}; }
            
            /* Rich text heading overrides */
            .content-wrapper h1 { font-size: 2em; font-weight: bold; margin-top: 1.5em; margin-bottom: 0.5em; text-align: left; text-transform: none; }
            .content-wrapper h2 { font-size: 1.5em; font-weight: bold; margin-top: 1.2em; margin-bottom: 0.5em; }
            .content-wrapper h3 { font-size: 1.17em; font-weight: bold; margin-top: 1em; margin-bottom: 0.5em; }
            
            .section-heading { font-size: 1.1em; margin-bottom: 8px; font-weight: bold; text-transform: uppercase; }
          </style>
        </head>
        <body>
          <div id="export-target">
            <div class="university-page-section">
              <h1>${docTitle}</h1>
            </div>
            
            <div class="content-wrapper">
              ${tocHeadings.length > 0 ? `
                <div class="university-page-section toc">
                  <h2>Table of Contents</h2>
                  ${tocHeadings.map(h => `
                    <div class="toc-row" style="margin-left: ${h.level === 1 ? '0' : h.level === 2 ? '24px' : '48px'}; font-weight: ${h.level === 1 ? 'bold' : 'normal'};">
                      <span class="toc-text">${h.text}</span>
                      <span class="toc-dots"></span>
                      <span class="toc-page">_</span>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
              ${sections.map(s => `
                <div class="university-page-section">
                  ${s.type !== 'mandatory' && s.title ? `<h2 class="section-heading">${s.title}</h2>` : ''}
                  <div>${s.content || '<p><i>Empty section...</i></p>'}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </body>
        </html>
      `);
      iframeDoc.close();
    }

    try {
      const html2pdf = (await import('html2pdf.js')).default;

      const target = iframeDoc?.getElementById('export-target');

      if (!target) {
        throw new Error('Export target element not found');
      }

      const options = {
        margin: 20,
        filename: `${docTitle.replace(/\s+/g, '_')}.pdf`,

        image: {
          type: 'jpeg' as const,
          quality: 0.98,
        },

        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
        },

        jsPDF: {
          unit: 'mm' as const,
          format: 'a4' as const,
          orientation: 'portrait' as const,
        },
      };

      await html2pdf()
        .set(options)
        .from(target)
        .save();

    } catch (e) {
      console.error(e);

    } finally {
      document.body.removeChild(iframe);
    }
  };

  const exportDocumentWord = async () => {
    const docx = await import('docx');
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, PageBreak } = docx;

    // Helper to parse HTML rich text into Docx Paragraphs and TextRuns
    const parseHtmlToDocxParagraphs = (htmlString: string) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');
      const docxParagraphs: any[] = [];

      const processNode = (node: Node) => {
        const runs: any[] = [];
        let blockHeading: string | null = null;

        if (node.nodeName === 'H1') blockHeading = 'Heading1';
        else if (node.nodeName === 'H2') blockHeading = 'Heading2';
        else if (node.nodeName === 'H3') blockHeading = 'Heading3';

        const traverse = (n: Node, format: any) => {
          if (n.nodeType === 3) { // Text node
            if (n.textContent && (n.textContent.trim() || n.textContent.includes(' '))) {
              runs.push(new TextRun({
                text: n.textContent,
                bold: format.bold,
                italics: format.italics,
                underline: format.underline ? {} : undefined
              }));
            }
          } else if (n.nodeType === 1) { // Element node
            const newFormat = { ...format };
            if (n.nodeName === 'B' || n.nodeName === 'STRONG') newFormat.bold = true;
            if (n.nodeName === 'I' || n.nodeName === 'EM') newFormat.italics = true;
            if (n.nodeName === 'U') newFormat.underline = true;
            if (n.nodeName === 'BR') {
              runs.push(new TextRun({ break: 1 }));
            }
            n.childNodes.forEach(child => traverse(child, newFormat));
          }
        };

        traverse(node, { bold: false, italics: false, underline: false });

        if (runs.length > 0) {
          const pOpts: any = { children: runs };
          if (blockHeading === 'Heading1') pOpts.heading = HeadingLevel.HEADING_1;
          if (blockHeading === 'Heading2') pOpts.heading = HeadingLevel.HEADING_2;
          if (blockHeading === 'Heading3') pOpts.heading = HeadingLevel.HEADING_3;
          docxParagraphs.push(new Paragraph(pOpts));
        }
      };

      doc.body.childNodes.forEach(processNode);
      if (docxParagraphs.length === 0) docxParagraphs.push(new Paragraph({ text: "" }));
      return docxParagraphs;
    };

    const docSections: any[] = [];

    // Title Page
    docSections.push(new Paragraph({ text: docTitle, heading: HeadingLevel.TITLE, alignment: docx.AlignmentType.CENTER }));

    // Auto-Generated TOC
    if (tocHeadings.length > 0) {
      docSections.push(new PageBreak());
      docSections.push(new Paragraph({ text: 'Table of Contents', heading: HeadingLevel.HEADING_1, alignment: docx.AlignmentType.CENTER }));
      tocHeadings.forEach(h => {
        docSections.push(new Paragraph({
          children: [
            new TextRun({ text: h.text, bold: h.level === 1 }),
          ],
          indent: { left: h.level === 1 ? 0 : h.level === 2 ? 720 : 1440 }
        }));
      });
    }

    // Sections
    sections.forEach(section => {
      // Force split to next page
      docSections.push(new PageBreak());

      if (section.type !== 'mandatory' && section.title) {
        docSections.push(new Paragraph({
          text: section.title,
          heading: HeadingLevel.HEADING_2,
        }));
      }

      // Parse rich HTML content into native Word formatting
      const contentParagraphs = parseHtmlToDocxParagraphs(section.content || 'Empty section...');
      docSections.push(...contentParagraphs);
    });

    const doc = new Document({
      sections: [{
        properties: {},
        children: docSections,
      }],
    });

    const blob = await Packer.toBlob(doc);
    const saveAs = (await import('file-saver')).default;
    saveAs(blob, `${docTitle.replace(/\\s+/g, '_')}.docx`);
  };

  const canvasTextClass = fontSize === '10pt' ? 'text-[13px]' : 'text-[16px]';
  const canvasLayoutClass = spacing === '1.5 Space' ? 'leading-[1.5] text-left' : 'leading-[1.2] text-justify';

  const extractHeadings = () => {
    const headings: { level: number, text: string }[] = [];
    sections.forEach(section => {
      const regex = /<h([1-3])[^>]*>(.*?)<\/h\1>/gi;
      let match;
      while ((match = regex.exec(section.content)) !== null) {
        const cleanText = match[2].replace(/<[^>]+>/g, '').trim();
        if (cleanText) {
          headings.push({ level: parseInt(match[1]), text: cleanText });
        }
      }
    });
    return headings;
  };

  const tocHeadings = extractHeadings();

  return (
    <div className="flex flex-col h-full print:max-h-none print:block">
      <style dangerouslySetInnerHTML={{
        __html: `
        .editor-content h1 { font-size: 2em; font-weight: bold; margin-top: 1em; margin-bottom: 0.5em; }
        .editor-content h2 { font-size: 1.5em; font-weight: bold; margin-top: 0.8em; margin-bottom: 0.4em; }
        .editor-content h3 { font-size: 1.17em; font-weight: bold; margin-top: 0.6em; margin-bottom: 0.3em; }
      `}} />

      {/* Header & Tab Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 shrink-0 print:hidden">
        <div>
          <h2 className="text-3xl font-semibold text-foreground">Document Builder</h2>
          <p className="text-base text-secondary mt-1">Structure your thoughts with warm, focused clarity.</p>
        </div>

        {/* Global Tabs */}
        <div className="flex bg-surface p-1 rounded-xl shadow-sm border border-outline-variant/30 w-full md:w-64">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'editor' ? 'bg-surface-strong text-foreground shadow-sm' : 'text-secondary hover:text-foreground'
              }`}
          >
            Editor
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'preview' ? 'bg-surface-strong text-foreground shadow-sm' : 'text-secondary hover:text-foreground'
              }`}
          >
            Preview
          </button>
        </div>
      </div>

      {activeTab === 'editor' ? (
        /* EDITOR VIEW */
        <div className="flex flex-col md:flex-row gap-8 flex-1 md:max-h-[85vh] md:overflow-hidden print:hidden">
          {/* Left Pane: Structure & Formatting */}
          <aside className="w-full md:w-80 flex flex-col gap-6 md:overflow-y-auto pr-2 custom-scrollbar shrink-0">
            {/* Formatting Card */}
            <div className="bg-surface-strong rounded-container p-6 shadow-soft flex flex-col gap-4">
              <h3 className="text-xl font-semibold text-foreground">Formatting</h3>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-secondary uppercase tracking-wider">Spacing & Alignment</label>
                <div className="flex gap-1">
                  <button
                    onClick={() => setSpacing('1.5 Space')}
                    className={`flex-1 p-2 rounded-lg text-center text-xs font-medium transition-colors ${spacing === '1.5 Space' ? 'bg-surface border border-primary/30 shadow-sm text-foreground' : 'bg-surface border border-transparent text-secondary hover:text-foreground'
                      }`}
                  >
                    1.5 Space
                  </button>
                  <button
                    onClick={() => setSpacing('Justified')}
                    className={`flex-1 p-2 rounded-lg text-center text-xs font-medium transition-colors ${spacing === 'Justified' ? 'bg-surface border border-primary/30 shadow-sm text-foreground' : 'bg-surface border border-transparent text-secondary hover:text-foreground'
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
                    className={`flex-1 py-1.5 text-sm font-medium rounded transition-colors ${fontSize === '10pt' ? 'bg-surface-strong shadow-sm text-foreground' : 'text-secondary hover:text-foreground'
                      }`}
                  >
                    10pt
                  </button>
                  <button
                    onClick={() => setFontSize('12pt')}
                    className={`flex-1 py-1.5 text-sm font-medium rounded transition-colors ${fontSize === '12pt' ? 'bg-surface-strong shadow-sm text-foreground' : 'text-secondary hover:text-foreground'
                      }`}
                  >
                    12pt
                  </button>
                </div>
              </div>
            </div>

            {/* Structure Card */}
            <div className="bg-surface-strong rounded-container p-6 shadow-soft flex flex-col gap-4 pb-8">
              <h3 className="text-xl font-semibold text-foreground">Structure</h3>
              <nav className="flex flex-col gap-2">
                {sections.map(section => (
                  <div
                    key={section.id}
                    onClick={() => handleScrollToSection(section.id)}
                    className={`flex items-center justify-between p-2 rounded-control cursor-pointer transition-colors ${activeSectionId === section.id
                      ? 'bg-primary/10 border-l-4 border-primary'
                      : 'hover:bg-surface border-l-4 border-transparent'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined text-base ${activeSectionId === section.id ? 'text-primary' : 'text-secondary'}`}>
                        {section.icon}
                      </span>
                      <span className={`text-sm font-medium ${activeSectionId === section.id ? 'text-primary' : 'text-foreground'}`}>
                        {section.title}
                      </span>
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleAddSection}
                  className="mt-4 flex items-center justify-center gap-2 py-3 border-2 border-dashed border-outline-variant rounded-control text-sm font-medium text-secondary hover:bg-surface hover:text-foreground transition-all"
                >
                  <span className="material-symbols-outlined text-base">add</span> Add Section
                </button>
              </nav>
            </div>
          </aside>

          {/* Right Pane: Editor Canvas */}
          <section className="flex-1 md:overflow-y-auto custom-scrollbar flex flex-col gap-8 pb-12 pr-2">

            <div className="flex items-center justify-between bg-surface-strong p-4 rounded-container shadow-soft shrink-0">
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="text-xl font-semibold text-foreground bg-transparent border-b-2 border-primary/50 focus:border-primary outline-none px-1 py-1 w-full max-w-sm transition-colors"
                placeholder="Document Title"
              />
              <button className="bg-surface text-secondary px-4 py-2 rounded-control text-sm font-medium border border-outline-variant/30 hover:bg-outline-variant/20 transition-colors">
                Save Draft
              </button>
            </div>

            {/* Auto-generated Table of Contents Block in Editor */}
            {tocHeadings.length > 0 && (
              <div className="bg-surface-strong rounded-container shadow-soft p-6 border-l-4 border-secondary shrink-0">
                <div className="flex items-center gap-3 mb-6 border-b border-outline-variant/30 pb-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">format_list_bulleted</span>
                  <h3 className="text-lg font-semibold text-foreground">Table of Contents</h3>
                  <span className="ml-auto text-xs font-semibold text-secondary uppercase tracking-widest">Auto-Generated from Headings</span>
                </div>
                <div className="flex flex-col space-y-3 font-medium text-foreground">
                  {tocHeadings.map((h, i) => (
                    <div key={`editor-toc-${i}`} className={`flex items-baseline ${h.level === 1 ? 'ml-0 font-bold' : h.level === 2 ? 'ml-6' : 'ml-12'}`}>
                      <span className="bg-surface-strong pr-2">{h.text}</span>
                      <span className="flex-1 border-b-[2px] border-dotted border-outline-variant/60 mx-2 relative top-[-6px]"></span>
                      <span className="bg-surface-strong pl-2 text-secondary">_</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sections.map(section => (
              <div
                key={section.id}
                ref={el => { sectionRefs.current[section.id] = el }}
                className="bg-surface-strong rounded-container shadow-soft overflow-hidden transition-all shrink-0 focus-within:ring-2 focus-within:ring-primary/40"
                onClick={() => setActiveSectionId(section.id)}
              >
                <div className="px-6 py-3 bg-surface flex items-center justify-between border-b border-outline-variant/30">
                  {editingTitleId === section.id ? (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">{section.icon}</span>
                      <input
                        autoFocus
                        type="text"
                        value={section.title}
                        onChange={(e) => handleTitleChange(section.id, e.target.value)}
                        onBlur={() => setEditingTitleId(null)}
                        onKeyDown={(e) => { if (e.key === 'Enter') setEditingTitleId(null); }}
                        className="text-lg font-semibold text-foreground bg-transparent border-b border-primary outline-none"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-[20px]">{section.icon}</span>
                      <h3
                        className="text-lg font-semibold text-foreground cursor-text hover:bg-outline-variant/20 rounded px-1 -ml-1 transition-colors"
                        onDoubleClick={() => setEditingTitleId(section.id)}
                        title="Double click to edit section name"
                      >
                        {section.title}
                      </h3>
                    </div>
                  )}
                  {section.subtitle && <span className="text-xs font-semibold text-secondary uppercase tracking-widest">{section.subtitle}</span>}
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
                    <button onMouseDown={(e) => { e.preventDefault(); document.execCommand('formatBlock', false, '<H1>'); }} className="px-2 py-1 text-xs font-bold text-secondary hover:text-foreground hover:bg-surface rounded-md transition-colors" title="Heading 1">
                      H1
                    </button>
                    <button onMouseDown={(e) => { e.preventDefault(); document.execCommand('formatBlock', false, '<H2>'); }} className="px-2 py-1 text-xs font-bold text-secondary hover:text-foreground hover:bg-surface rounded-md transition-colors" title="Heading 2">
                      H2
                    </button>
                    <button onMouseDown={(e) => { e.preventDefault(); document.execCommand('formatBlock', false, '<H3>'); }} className="px-2 py-1 text-xs font-bold text-secondary hover:text-foreground hover:bg-surface rounded-md transition-colors" title="Heading 3">
                      H3
                    </button>
                  </div>

                  {/* Editable Area */}
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleContentChange(section.id, e.currentTarget.innerHTML)}
                    className={`editor-content w-full outline-none bg-surface p-4 rounded-xl border border-outline-variant/30 focus:border-primary/50 transition-all min-h-[150px] resize-y overflow-auto ${canvasTextClass} ${canvasLayoutClass} text-foreground`}
                    style={{ fontFamily: 'Tahoma, sans-serif' }}
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </div>
              </div>
            ))}
          </section>
        </div>
      ) : (
        /* PREVIEW VIEW */
        <div className="flex flex-col items-center flex-1 overflow-y-auto custom-scrollbar pt-4 pb-12 px-4 print:p-0">
          <div className="flex justify-end gap-2 w-full max-w-3xl mb-4 print:hidden">
            <button
              onClick={exportDocumentPDF}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-control text-sm font-bold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-soft"
            >
              <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
              PDF
            </button>
            <button
              onClick={exportDocumentWord}
              className="bg-surface-strong text-foreground border border-outline-variant/30 px-4 py-2 rounded-control text-sm font-bold flex items-center gap-2 hover:bg-surface active:scale-95 transition-all shadow-soft"
            >
              <span className="material-symbols-outlined text-[18px]">description</span>
              Word
            </button>
          </div>
          <PreviewA4 sections={sections} fontSize={fontSize} spacing={spacing} docTitle={docTitle} />
        </div>
      )}
    </div>
  );
}