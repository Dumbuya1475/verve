import {
  AlignmentType,
  BorderStyle,
  Document,
  HeightRule,
  ImageRun,
  LineRuleType,
  Packer,
  Paragraph,
  Table,
  TableBorders,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
  type FileChild,
  type IBorderOptions,
  type ITableCellBorders,
} from 'docx';
import {
  ATTESTATION_GROUP,
  ATTESTATION_INDIVIDUAL,
  buildCoverDocumentHtml,
  formatCoverDate,
  splitName,
} from './html';
import { A4_HEIGHT_PX, A4_WIDTH_PX, COVER_LOGO_PATH } from './types';
import type { CoverFormData, CoverType, GroupMember } from './types';

function coverFilename(formData: CoverFormData, ext: 'pdf' | 'docx'): string {
  const raw = formData.assignmentTitle || 'Cover_Page';
  const safe = raw.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '_') || 'Cover_Page';
  return `Verve_${safe}.${ext}`;
}

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

  const saveAs =
    typeof fileSaver === 'function'
      ? fileSaver
      : fileSaver?.saveAs;

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

async function waitForImages(doc: globalThis.Document): Promise<void> {
  const images = Array.from(doc.images);
  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          const done = () => resolve();
          img.addEventListener('load', done, { once: true });
          img.addEventListener('error', done, { once: true });
          window.setTimeout(done, 2500);
        }),
    ),
  );
}

async function mountCoverIframe(html: string): Promise<HTMLIFrameElement> {
  const iframe = document.createElement('iframe');
  iframe.setAttribute(
    'style',
    'position:fixed;left:-12000px;top:0;width:210mm;height:297mm;border:0;background:#fff;',
  );
  iframe.setAttribute('aria-hidden', 'true');
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  if (!doc) {
    iframe.remove();
    throw new Error('Could not create the export document.');
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

  await waitForImages(doc);
  return iframe;
}

export async function captureCoverJpeg(params: {
  type: CoverType;
  formData: CoverFormData;
  groupMembers: GroupMember[];
}): Promise<string> {
  const logoSrc = `${window.location.origin}${COVER_LOGO_PATH}`;
  const html = buildCoverDocumentHtml({ ...params, logoSrc });
  const iframe = await mountCoverIframe(html);

  try {
    const html2canvasMod = await import('html2canvas');
    const html2canvas = unwrapDefault(html2canvasMod);

    const target = iframe.contentDocument?.querySelector('.verve-cover') ?? iframe.contentDocument?.body;
    if (!target) {
      throw new Error('Could not find the cover page to export.');
    }

    const canvas = await html2canvas(target as HTMLElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      width: A4_WIDTH_PX,
      height: A4_HEIGHT_PX,
      windowWidth: A4_WIDTH_PX,
      windowHeight: A4_HEIGHT_PX,
      logging: false,
      scrollX: 0,
      scrollY: 0,
    });

    return canvas.toDataURL('image/jpeg', 0.98);
  } finally {
    iframe.remove();
  }
}

export async function exportCoverPdf(params: {
  type: CoverType;
  formData: CoverFormData;
  groupMembers: GroupMember[];
}): Promise<void> {
  const image = await captureCoverJpeg(params);
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  pdf.addImage(image, 'JPEG', 0, 0, 210, 297);
  pdf.save(coverFilename(params.formData, 'pdf'));
}

const noneBorder: IBorderOptions = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const ghostBorder: IBorderOptions = { style: BorderStyle.SINGLE, size: 1, color: 'FFFFFF' };
const dashedBorder: IBorderOptions = { style: BorderStyle.DASHED, size: 4, color: '000000' };
const solidBorder: IBorderOptions = { style: BorderStyle.SINGLE, size: 8, color: '000000' };
const courseRule: IBorderOptions = { style: BorderStyle.SINGLE, size: 24, color: '000000' };
const hairline: IBorderOptions = { style: BorderStyle.SINGLE, size: 4, color: '000000' };

const ghostTableBorders = {
  top: ghostBorder,
  bottom: ghostBorder,
  left: ghostBorder,
  right: ghostBorder,
  insideHorizontal: ghostBorder,
  insideVertical: ghostBorder,
};

const ghostCellBorders: ITableCellBorders = {
  top: ghostBorder,
  bottom: ghostBorder,
  left: ghostBorder,
  right: ghostBorder,
};

const PAGE_CONTENT_DXA = 9026;
const LABEL_DXA = 2740;
const COLON_DXA = 260;
const VALUE_DXA = PAGE_CONTENT_DXA - LABEL_DXA - COLON_DXA;

const FONT = 'Tahoma';
const SIZE_BODY = 20;
const SIZE_FACULTY = 27;
const SIZE_COURSE = 32;
const LINE_1_5 = { line: 360, lineRule: LineRuleType.AUTO } as const;

async function loadLogo(): Promise<{ data: ArrayBuffer; width: number; height: number } | null> {
  try {
    const response = await fetch(COVER_LOGO_PATH);
    if (!response.ok) return null;
    const data = await response.arrayBuffer();
    const url = URL.createObjectURL(new Blob([data]));
    const size = await new Promise<{ width: number; height: number }>((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth || 280, height: img.naturalHeight || 90 });
        URL.revokeObjectURL(url);
      };
      img.onerror = () => {
        resolve({ width: 280, height: 90 });
        URL.revokeObjectURL(url);
      };
      img.src = url;
    });
    const height = 120;
    const width = Math.round((size.width / size.height) * height) || 320;
    return { data, width, height };
  } catch {
    return null;
  }
}

function bodyParagraph(text: string, extra?: { bold?: boolean; after?: number; before?: number; align?: (typeof AlignmentType)[keyof typeof AlignmentType] }) {
  return new Paragraph({
    spacing: { ...LINE_1_5, before: extra?.before, after: extra?.after },
    alignment: extra?.align,
    children: [new TextRun({ text, font: FONT, size: SIZE_BODY, bold: extra?.bold })],
  });
}

function hiddenCell(width: number, paragraph: Paragraph, extra?: { margins?: { top: number; bottom: number; left: number; right: number } }) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: ghostCellBorders,
    margins: extra?.margins ?? { top: 0, bottom: 0, left: 0, right: 0 },
    children: [paragraph],
  });
}

function detailsTable(rows: { label: string; value: string }[]) {
  return new Table({
    width: { size: PAGE_CONTENT_DXA, type: WidthType.DXA },
    columnWidths: [LABEL_DXA, COLON_DXA, VALUE_DXA],
    layout: TableLayoutType.FIXED,
    borders: ghostTableBorders,
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
    rows: rows.map(
      (row) =>
        new TableRow({
          children: [
            hiddenCell(LABEL_DXA, bodyParagraph(row.label, { bold: true })),
            hiddenCell(COLON_DXA, bodyParagraph(':')),
            hiddenCell(VALUE_DXA, bodyParagraph(row.value), {
              margins: { top: 0, bottom: 0, left: 80, right: 0 },
            }),
          ],
        }),
    ),
  });
}

function courseTable(text: string) {
  return new Table({
    width: { size: PAGE_CONTENT_DXA, type: WidthType.DXA },
    columnWidths: [PAGE_CONTENT_DXA],
    layout: TableLayoutType.FIXED,
    borders: {
      top: courseRule,
      bottom: courseRule,
      left: ghostBorder,
      right: ghostBorder,
      insideHorizontal: ghostBorder,
      insideVertical: ghostBorder,
    },
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: PAGE_CONTENT_DXA, type: WidthType.DXA },
            verticalAlign: VerticalAlign.CENTER,
            borders: {
              top: courseRule,
              bottom: courseRule,
              left: ghostBorder,
              right: ghostBorder,
            },
            margins: { top: 60, bottom: 60, left: 0, right: 0 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: {
                  before: 0,
                  after: 0,
                  line: 340,
                  lineRule: LineRuleType.EXACT,
                },
                children: [new TextRun({ text, font: FONT, size: SIZE_COURSE, bold: true })],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function signatureTable(label: string) {
  const leftWidth = 5600;
  const rightWidth = PAGE_CONTENT_DXA - leftWidth;
  return new Table({
    width: { size: PAGE_CONTENT_DXA, type: WidthType.DXA },
    columnWidths: [leftWidth, rightWidth],
    layout: TableLayoutType.FIXED,
    borders: ghostTableBorders,
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
    rows: [
      new TableRow({
        children: [
          hiddenCell(leftWidth, bodyParagraph(label, { before: 20, after: 20 })),
          hiddenCell(rightWidth, bodyParagraph('Date:', { before: 20, after: 20 })),
        ],
      }),
    ],
  });
}

function headerCell(text: string) {
  return new TableCell({
    shading: { fill: '000000' },
    verticalAlign: VerticalAlign.CENTER,
    borders: { top: hairline, bottom: hairline, left: hairline, right: hairline },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: LINE_1_5,
        children: [new TextRun({ text, font: FONT, size: SIZE_BODY, bold: true, color: 'FFFFFF' })],
      }),
    ],
  });
}

function memberCell(text: string, center = false) {
  return new TableCell({
    borders: { top: hairline, bottom: hairline, left: hairline, right: hairline },
    children: [
      new Paragraph({
        alignment: center ? AlignmentType.CENTER : AlignmentType.LEFT,
        spacing: LINE_1_5,
        children: [new TextRun({ text, font: FONT, size: SIZE_BODY })],
      }),
    ],
  });
}

export async function buildCoverWordChildren(params: {
  type: CoverType;
  formData: CoverFormData;
  groupMembers: GroupMember[];
}): Promise<FileChild[]> {
  const { type, formData, groupMembers } = params;
  const logo = await loadLogo();
  const children: FileChild[] = [];

  if (logo) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 160 },
        children: [
          new ImageRun({
            type: 'jpg',
            data: logo.data,
            transformation: { width: logo.width, height: logo.height },
            altText: {
              title: 'University logo',
              description: 'Limkokwing University of Creative Technology Sierra Leone',
              name: 'LUCT logo',
            },
          }),
        ],
      }),
    );
  }

  if (formData.faculty.trim()) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { ...LINE_1_5, after: 160 },
        children: [new TextRun({ text: formData.faculty.toUpperCase(), font: FONT, size: SIZE_FACULTY, bold: true })],
      }),
    );
  }

  const courseLine = `${formData.courseCode}: ${formData.courseTitle}`.toUpperCase();
  children.push(courseTable(courseLine));
  children.push(new Paragraph({ spacing: { after: 160 }, children: [] }));

  const lecturerLabel = type === 'Group' ? 'Lecturer' : 'Lecturer/Examiner';
  const detailRows = [
    { label: 'Title', value: formData.assignmentTitle },
    { label: 'Issue Date', value: formatCoverDate(formData.issueDate) },
    { label: 'Due Date', value: formatCoverDate(formData.dueDate) },
    { label: lecturerLabel, value: formData.lecturer },
    ...(type === 'Individual'
      ? [
          { label: 'Name of Student', value: formData.studentName },
          { label: 'Student ID No.', value: formData.studentId },
        ]
      : []),
    { label: 'Class', value: formData.className },
    { label: 'Semester/Year', value: formData.semester },
  ];
  children.push(detailsTable(detailRows));

  if (type === 'Individual') {
    children.push(
      new Paragraph({
        spacing: { ...LINE_1_5, before: 80, after: 80 },
        alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: ATTESTATION_INDIVIDUAL, font: FONT, size: SIZE_BODY })],
      }),
    );
    children.push(signatureTable("Student's Signature :"));
  } else {
    children.push(
      new Paragraph({
        spacing: { ...LINE_1_5, before: 160, after: 60 },
        children: [
          new TextRun({
            text: 'Academic Honesty Policy Statement',
            font: FONT,
            size: SIZE_BODY,
            bold: true,
            underline: {},
          }),
        ],
      }),
    );
    children.push(
      new Paragraph({
        spacing: { ...LINE_1_5, after: 80 },
        alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: ATTESTATION_GROUP, font: FONT, size: SIZE_BODY })],
      }),
    );
    children.push(signatureTable("Student's Signature:"));

    const colNum = 500;
    const colName = 2500;
    const colSurname = 2200;
    const colId = 1800;
    const colSign = PAGE_CONTENT_DXA - colNum - colName - colSurname - colId;

    children.push(
      new Table({
        width: { size: PAGE_CONTENT_DXA, type: WidthType.DXA },
        columnWidths: [colNum, colName, colSurname, colId, colSign],
        layout: TableLayoutType.FIXED,
        borders: {
          top: hairline,
          bottom: hairline,
          left: hairline,
          right: hairline,
          insideHorizontal: hairline,
          insideVertical: hairline,
        },
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              headerCell(''),
              headerCell('NAME'),
              headerCell('SURNAME'),
              headerCell('ID'),
              headerCell('SIGN'),
            ],
          }),
          ...groupMembers.map((member, index) => {
            const { name, surname } = splitName(member.name);
            return new TableRow({
              children: [
                memberCell(String(index + 1), true),
                memberCell(name),
                memberCell(surname),
                memberCell(member.id),
                memberCell(''),
              ],
            });
          }),
        ],
      }),
    );
  }

  const blankLines = Array.from({ length: 6 }, () =>
    new Paragraph({ spacing: LINE_1_5, children: [new TextRun({ text: ' ' })] }),
  );
  const leftWidth = 5867;
  const rightWidth = PAGE_CONTENT_DXA - leftWidth;

  children.push(
    new Paragraph({ spacing: { before: 40, after: 0 }, children: [] }),
    new Table({
      width: { size: PAGE_CONTENT_DXA, type: WidthType.DXA },
      columnWidths: [leftWidth, rightWidth],
      layout: TableLayoutType.FIXED,
      borders: TableBorders.NONE,
      rows: [
        new TableRow({
          cantSplit: true,
          height: { value: 2450, rule: HeightRule.ATLEAST },
          children: [
            new TableCell({
              width: { size: leftWidth, type: WidthType.DXA },
              verticalAlign: VerticalAlign.TOP,
              borders: { top: solidBorder, bottom: solidBorder, left: solidBorder, right: solidBorder },
              margins: { top: 80, bottom: 80, left: 80, right: 80 },
              children: [
                new Paragraph({
                  spacing: LINE_1_5,
                  children: [new TextRun({ text: "LECTURER'S COMMENTS/GRADE:", font: FONT, size: SIZE_BODY })],
                }),
                ...blankLines,
              ],
            }),
            new TableCell({
              width: { size: rightWidth, type: WidthType.DXA },
              verticalAlign: VerticalAlign.TOP,
              borders: {
                top: dashedBorder,
                bottom: dashedBorder,
                left: noneBorder,
                right: dashedBorder,
              },
              margins: { top: 60, bottom: 60, left: 80, right: 80 },
              children: [
                new Paragraph({
                  spacing: LINE_1_5,
                  children: [
                    new TextRun({
                      text: 'for office use only upon receive',
                      font: FONT,
                      size: 16,
                      italics: true,
                    }),
                  ],
                }),
                new Paragraph({
                  spacing: { ...LINE_1_5, before: 80, after: 120 },
                  children: [new TextRun({ text: 'Remark', font: FONT, size: SIZE_BODY })],
                }),
                new Paragraph({ spacing: LINE_1_5, children: [new TextRun({ text: 'DATE :', font: FONT, size: SIZE_BODY })] }),
                new Paragraph({ spacing: LINE_1_5, children: [new TextRun({ text: 'TIME :', font: FONT, size: SIZE_BODY })] }),
                new Paragraph({ spacing: LINE_1_5, children: [new TextRun({ text: "RECEIVER'S NAME :", font: FONT, size: SIZE_BODY })] }),
              ],
            }),
          ],
        }),
      ],
    }),
  );

  return children;
}

export async function exportCoverWord(params: {
  type: CoverType;
  formData: CoverFormData;
  groupMembers: GroupMember[];
}): Promise<void> {
  const children = await buildCoverWordChildren(params);
  const { formData } = params;

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: FONT, size: SIZE_BODY },
          paragraph: { spacing: LINE_1_5 },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: '210mm', height: '297mm' },
            margin: { top: '1in', bottom: '1in', left: '1in', right: '1in' },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  await downloadBlob(blob, coverFilename(formData, 'docx'));
}
