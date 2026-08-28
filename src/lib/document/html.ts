import { ASSIGNMENT_SECTIONS, type AssignmentDraft } from './types';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function paragraphsHtml(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return '';
  return trimmed
    .split(/\n{2,}/)
    .map((block) => `<p>${escapeHtml(block).replace(/\n/g, '<br />')}</p>`)
    .join('');
}

export const ASSIGNMENT_PAGE_CSS = `
.verve-assignment, .verve-assignment * { box-sizing: border-box; }
.verve-assignment {
  width: 210mm;
  min-height: 297mm;
  margin: 0;
  padding: 1in;
  font-family: Tahoma, sans-serif;
  font-size: 12pt;
  line-height: 1.5;
  color: #000000;
  background: #ffffff;
}
.verve-assignment h1 {
  font-family: Tahoma, sans-serif;
  font-size: 16pt;
  font-weight: 700;
  text-align: center;
  margin: 0 0 0.28in;
  line-height: 1.3;
}
.verve-assignment h2 {
  font-family: Tahoma, sans-serif;
  font-size: 13.5pt;
  font-weight: 700;
  margin: 0.22in 0 0.1in;
}
.verve-assignment p {
  margin: 0 0 0.12in;
  text-align: left;
}
`;

export function buildAssignmentInnerHtml(draft: AssignmentDraft): string {
  const title = draft.title.trim() || 'Untitled assignment';
  const sections = ASSIGNMENT_SECTIONS.map((section) => {
    const html = paragraphsHtml(draft[section.key]);
    if (!html) return '';
    return `<h2>${escapeHtml(section.label)}</h2>${html}`;
  }).join('');

  return `<article class="verve-assignment">
    <h1>${escapeHtml(title)}</h1>
    ${sections || '<p>Start writing in the editor. This preview updates as you type.</p>'}
  </article>`;
}

export function buildAssignmentDocumentHtml(draft: AssignmentDraft): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    html, body { margin: 0; padding: 0; background: #ffffff; }
    ${ASSIGNMENT_PAGE_CSS}
  </style>
</head>
<body>
  ${buildAssignmentInnerHtml(draft)}
</body>
</html>`;
}
