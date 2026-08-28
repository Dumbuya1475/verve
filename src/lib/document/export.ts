import {
  AlignmentType,
  Document,
  LineRuleType,
  Packer,
  Paragraph,
  TextRun,
  type FileChild,
  type ISectionOptions,
} from 'docx';
import { captureCoverJpeg, buildCoverWordChildren } from '@/lib/cover/export';
import { A4_HEIGHT_PX, A4_WIDTH_PX } from '@/lib/cover/types';
import { readCoverDraft } from './coverDraft';
import { buildAssignmentDocumentHtml } from './html';
import {
  ASSIGNMENT_SECTIONS,
  assignmentFilename,
  type AssignmentDraft,
} from './types';

const FONT = 'Tahoma';
const SIZE_BODY = 24;
const SIZE_TITLE = 32;
const SIZE_HEADING = 27;
const LINE_1_5 = { line: 360, lineRule: LineRuleType.AUTO } as const;
const PAGE = {
  size: { width: '210mm', height: '297mm' },
  margin: { top: '1in', bottom: '1in', left: '1in', right: '1in' },
} as const;

function unwrapDefault<T>(mod: { default?: T } | T): T {
  if (mod && typeof mod === 'object' && 'default' in mod && mod.default) {
    return mod.default;
  }
  return mod as T;
}

async function downloadBlob(blob: Blob, filename: string) {
  const fileSaver = unwrapDefault(await import('file-saver')) as
    | ((data: Blob, name: string) => void)
    | { saveAs?: (data: Blob, name: string) => void };

  const saveAs = typeof fileSaver === 'function' ? fileSaver : fileSaver?.saveAs;

  if (typeof saveAs === 'function') {
    saveAs(blob, filename);
    return;
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

async function mountAssignmentIframe(html: string): Promise<HTMLIFrameElement> {
  const iframe = document.createElement('iframe');
  iframe.setAttribute(
    'style',
    'position:fixed;left:-12000px;top:0;width:210mm;border:0;background:#fff;',
  );
  iframe.setAttribute('aria-hidden', 'true');
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  if (!doc) {
    iframe.remove();
    throw new Error('Could not create the assignment document.');
  }

  await new Promise<void>((resolve, reject) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    iframe.onload = () => finish();
    try {
      doc.open();
      doc.write(html);
      doc.close();
    } catch (error) {
      reject(error);
      return;
    }
    if (doc.readyState === 'complete') finish();
    window.setTimeout(finish, 1500);
  });

  return iframe;
}

function paragraphsFromText(text: string): Paragraph[] {
  const trimmed = text.replace(/\r\n/g, '\n').trim();
  if (!trimmed) return [];
  return trimmed.split(/\n{2,}/).map(
    (block) =>
      new Paragraph({
        spacing: { ...LINE_1_5, after: 160 },
        alignment: AlignmentType.LEFT,
        children: block.split('\n').map(
          (line, index) =>
            new TextRun({
              text: line,
              font: FONT,
              size: SIZE_BODY,
              break: index === 0 ? undefined : 1,
            }),
        ),
      }),
  );
}

function assignmentWordChildren(draft: AssignmentDraft): FileChild[] {
  const children: FileChild[] = [
    new Paragraph({
      spacing: { ...LINE_1_5, after: 280 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: draft.title.trim() || 'Untitled assignment',
          font: FONT,
          size: SIZE_TITLE,
          bold: true,
        }),
      ],
    }),
  ];

  for (const section of ASSIGNMENT_SECTIONS) {
    const text = draft[section.key].trim();
    if (!text) continue;
    children.push(
      new Paragraph({
        spacing: { ...LINE_1_5, before: 200, after: 80 },
        children: [new TextRun({ text: section.label, font: FONT, size: SIZE_HEADING, bold: true })],
      }),
      ...paragraphsFromText(text),
    );
  }

  return children;
}

type PdfDoc = {
  addPage: () => void;
  addImage: (image: string, format: string, x: number, y: number, w: number, h: number) => void;
};

async function addCanvasPages(pdf: PdfDoc, canvas: HTMLCanvasElement, startOnNewPage: boolean) {
  const scale = 2;
  const pageHeightPx = A4_HEIGHT_PX * scale;
  let y = 0;
  let pageIndex = 0;

  while (y < canvas.height) {
    const sliceHeight = Math.min(pageHeightPx, canvas.height - y);
    const slice = document.createElement('canvas');
    slice.width = canvas.width;
    slice.height = sliceHeight;
    const ctx = slice.getContext('2d');
    if (!ctx) break;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, slice.width, slice.height);
    ctx.drawImage(canvas, 0, y, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);
    const image = slice.toDataURL('image/jpeg', 0.95);
    if (startOnNewPage || pageIndex > 0) {
      pdf.addPage();
    }
    const heightMm = (sliceHeight / (A4_WIDTH_PX * scale)) * 210;
    pdf.addImage(image, 'JPEG', 0, 0, 210, Math.min(297, heightMm));
    y += sliceHeight;
    pageIndex += 1;
    startOnNewPage = true;
  }
}

export async function exportAssignmentPdf(draft: AssignmentDraft): Promise<void> {
  const cover = draft.includeCover ? readCoverDraft() : null;
  if (draft.includeCover && !cover) {
    throw new Error('Turn off “Add cover as page 1”, or fill in a cover first.');
  }

  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  let usedFirstPage = false;

  if (cover) {
    const image = await captureCoverJpeg(cover);
    pdf.addImage(image, 'JPEG', 0, 0, 210, 297);
    usedFirstPage = true;
  }

  const iframe = await mountAssignmentIframe(buildAssignmentDocumentHtml(draft));
  try {
    const html2canvasMod = await import('html2canvas');
    const html2canvas = unwrapDefault(html2canvasMod);
    const target =
      iframe.contentDocument?.querySelector('.verve-assignment') ?? iframe.contentDocument?.body;
    if (!target) {
      throw new Error('Could not find the assignment to export.');
    }

    const height = Math.max((target as HTMLElement).scrollHeight, A4_HEIGHT_PX);
    const canvas = await html2canvas(target as HTMLElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      width: A4_WIDTH_PX,
      height,
      windowWidth: A4_WIDTH_PX,
      windowHeight: height,
      logging: false,
      scrollX: 0,
      scrollY: 0,
    });

    await addCanvasPages(pdf, canvas, usedFirstPage);
  } finally {
    iframe.remove();
  }

  pdf.save(assignmentFilename(draft, 'pdf'));
}

export async function exportAssignmentWord(draft: AssignmentDraft): Promise<void> {
  const cover = draft.includeCover ? readCoverDraft() : null;
  if (draft.includeCover && !cover) {
    throw new Error('Turn off “Add cover as page 1”, or fill in a cover first.');
  }

  const sections: ISectionOptions[] = [];

  if (cover) {
    sections.push({
      properties: { page: PAGE },
      children: await buildCoverWordChildren(cover),
    });
  }

  sections.push({
    properties: { page: PAGE },
    children: assignmentWordChildren(draft),
  });

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: FONT, size: SIZE_BODY },
          paragraph: { spacing: LINE_1_5 },
        },
      },
    },
    sections,
  });

  const blob = await Packer.toBlob(doc);
  await downloadBlob(blob, assignmentFilename(draft, 'docx'));
}
