export const ASSIGNMENT_SECTIONS = [
  { key: 'introduction', label: 'Introduction' },
  { key: 'body', label: 'Body' },
  { key: 'conclusion', label: 'Conclusion' },
  { key: 'references', label: 'References' },
] as const;

export type AssignmentSectionKey = (typeof ASSIGNMENT_SECTIONS)[number]['key'];

export type AssignmentDraft = {
  title: string;
  introduction: string;
  body: string;
  conclusion: string;
  references: string;
  includeCover: boolean;
  updatedAt: number;
};

const SECTION_MAX = 80_000;
const TITLE_MAX = 200;

export function emptyAssignment(): AssignmentDraft {
  return {
    title: '',
    introduction: '',
    body: '',
    conclusion: '',
    references: '',
    includeCover: false,
    updatedAt: Date.now(),
  };
}

function clip(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value.slice(0, max);
}

export function parseAssignment(raw: unknown): AssignmentDraft {
  const empty = emptyAssignment();
  if (!raw || typeof raw !== 'object') return empty;
  const data = raw as Record<string, unknown>;
  const updatedAt = Number(data.updatedAt);
  return {
    title: clip(data.title, TITLE_MAX),
    introduction: clip(data.introduction, SECTION_MAX),
    body: clip(data.body, SECTION_MAX),
    conclusion: clip(data.conclusion, SECTION_MAX),
    references: clip(data.references, SECTION_MAX),
    includeCover: data.includeCover === true,
    updatedAt: Number.isFinite(updatedAt) && updatedAt > 0 ? updatedAt : Date.now(),
  };
}

export function assignmentHasText(draft: AssignmentDraft): boolean {
  return Boolean(
    draft.title.trim() ||
      draft.introduction.trim() ||
      draft.body.trim() ||
      draft.conclusion.trim() ||
      draft.references.trim(),
  );
}

export function assignmentFilename(draft: AssignmentDraft, ext: 'pdf' | 'docx'): string {
  const raw = draft.title.trim() || 'Assignment';
  const safe = raw.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '_') || 'Assignment';
  return `Verve_${safe}.${ext}`;
}
