import type { CoverFormData, CoverType, GroupMember } from './types';

const ATTESTATION_INDIVIDUAL =
  "I, hereby attest that the contents of this attachment are my own work. Referenced works, articles, art, programs, papers, or parts thereof are acknowledged at the end of this paper. This includes data excerpted from CD-ROMs, the Internet, other private networks, and other people's disks of the computer system.";

const ATTESTATION_GROUP =
  "I/we, hereby attest that contents of this attachment are my own work. Referenced works, articles, art, programs, papers or parts thereof are acknowledged at the end of this paper. This includes data excerpted from CD-ROMs, the Internet, other private networks, and other people's disk of the computer system.";

export const COVER_PAGE_CSS = `
.verve-cover, .verve-cover * { box-sizing: border-box; }
.verve-cover {
  width: 210mm;
  min-height: 297mm;
  height: 297mm;
  margin: 0;
  padding: 1in;
  display: flex;
  flex-direction: column;
  font-family: Tahoma, sans-serif;
  font-size: 10pt;
  color: #000000;
  background: #ffffff;
  line-height: 1.5;
  overflow: hidden;
}
.verve-cover .vc-body { flex: 0 1 auto; }
.verve-cover .vc-center { text-align: center; }
.verve-cover .vc-logo {
  height: 1.25in;
  width: auto;
  max-width: 3.6in;
  object-fit: contain;
  display: block;
  margin: 0 auto 0.16in;
}
.verve-cover .vc-faculty {
  font-family: Tahoma, sans-serif;
  font-size: 13.5pt;
  font-weight: 700;
  text-transform: uppercase;
  margin: 0 0 0.2in;
}
.verve-cover .vc-course {
  margin: 0 0 0.18in;
}
.verve-cover .vc-course-rule {
  height: 3pt;
  background: #000;
  width: 100%;
}
.verve-cover .vc-course h3 {
  font-family: Tahoma, sans-serif;
  font-size: 16pt;
  font-weight: 700;
  text-transform: uppercase;
  margin: 0;
  padding: 0.12in 0;
  line-height: 1.2;
  text-align: center;
}
.verve-cover table.vc-details,
.verve-cover table.vc-sig {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  border-spacing: 0;
  border: none;
  outline: none;
  background: transparent;
}
.verve-cover table.vc-details td,
.verve-cover table.vc-sig td {
  border: none;
  outline: none;
  background: transparent;
  vertical-align: top;
  font-family: Tahoma, sans-serif;
  font-size: 10pt;
  line-height: 1.5;
}
.verve-cover table.vc-details {
  margin: 0 0 0.16in;
}
.verve-cover table.vc-details td {
  padding: 0.015in 0;
}
.verve-cover table.vc-details .vc-label {
  font-weight: 700;
  width: 1.9in;
  white-space: nowrap;
}
.verve-cover table.vc-details .vc-colon {
  width: 0.18in;
  font-weight: 400;
  text-align: left;
}
.verve-cover table.vc-details .vc-value {
  font-weight: 400;
  padding-left: 0.06in;
  word-break: break-word;
}
.verve-cover .vc-attest {
  font-family: Tahoma, sans-serif;
  font-size: 10pt;
  font-weight: 400;
  text-align: justify;
  margin: 0 0 0.12in;
}
.verve-cover table.vc-sig {
  margin: 0 0 0.04in;
}
.verve-cover table.vc-sig td {
  padding: 0;
  font-weight: 400;
}
.verve-cover table.vc-sig .vc-sig-date {
  width: 38%;
  text-align: left;
}
.verve-cover .vc-policy {
  font-family: Tahoma, sans-serif;
  font-size: 10pt;
  font-weight: 700;
  text-decoration: underline;
  margin: 0 0 0.08in;
}
.verve-cover table.vc-gt {
  width: 100%;
  border-collapse: collapse;
  border: 1pt solid #000;
  font-size: 10pt;
  margin: 0.08in 0 0.04in;
}
.verve-cover table.vc-gt thead tr { background: #000; color: #fff; }
.verve-cover table.vc-gt th,
.verve-cover table.vc-gt td {
  border: 0.75pt solid #000;
  padding: 0.04in 0.06in;
}
.verve-cover table.vc-gt th {
  text-align: center;
  text-transform: uppercase;
  font-weight: 700;
}
.verve-cover .vc-center-cell { text-align: center; }
.verve-cover .vc-grading {
  display: flex;
  min-height: 1.55in;
  margin-top: 0.06in;
}
.verve-cover .vc-grading-left {
  width: 65%;
  border: 1pt solid #000;
  padding: 0.08in;
}
.verve-cover .vc-grading-left p {
  font-size: 10pt;
  text-transform: uppercase;
  margin: 0;
  font-weight: 400;
}
.verve-cover .vc-grading-right {
  width: 35%;
  padding: 0.06in 0.08in;
  display: flex;
  flex-direction: column;
  border-top: 0.75pt dashed #000;
  border-right: 0.75pt dashed #000;
  border-bottom: 0.75pt dashed #000;
  border-left: none;
}
.verve-cover .vc-office {
  font-size: 8pt;
  font-style: italic;
  color: #333;
  margin: 0 0 0.06in;
}
.verve-cover .vc-remark {
  font-size: 10pt;
  margin: 0 0 auto;
}
.verve-cover .vc-office-fields {
  margin-top: auto;
  font-size: 10pt;
  display: flex;
  flex-direction: column;
  gap: 0.1in;
}
.verve-cover .vc-office-fields p { margin: 0; }
`.trim();

export type CoverHtmlParams = {
  type: CoverType;
  formData: CoverFormData;
  groupMembers: GroupMember[];
  logoSrc: string;
};

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function formatCoverDate(value: string): string {
  return value.trim();
}

function splitName(fullName: string): { name: string; surname: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { name: '', surname: '' };
  if (parts.length === 1) return { name: parts[0], surname: '' };
  const surname = parts.pop() as string;
  return { name: parts.join(' '), surname };
}

function detailRow(label: string, value: string): string {
  return `<tr>
    <td class="vc-label">${escapeHtml(label)}</td>
    <td class="vc-colon">:</td>
    <td class="vc-value">${escapeHtml(value)}</td>
  </tr>`;
}

export function buildCoverInnerHtml({
  type,
  formData,
  groupMembers,
  logoSrc,
}: CoverHtmlParams): string {
  const courseLine = `${formData.courseCode}: ${formData.courseTitle}`;
  const lecturerLabel = type === 'Group' ? 'Lecturer' : 'Lecturer/Examiner';
  const faculty = formData.faculty.trim();

  const individualRows =
    type === 'Individual'
      ? `${detailRow('Name of Student', formData.studentName)}${detailRow('Student ID No.', formData.studentId)}`
      : '';

  const groupRows = groupMembers
    .map((member, index) => {
      const { name, surname } = splitName(member.name);
      return `<tr>
        <td class="vc-center-cell">${index + 1}</td>
        <td>${escapeHtml(name)}</td>
        <td>${escapeHtml(surname)}</td>
        <td>${escapeHtml(member.id)}</td>
        <td></td>
      </tr>`;
    })
    .join('');

  const signatureLabel = type === 'Individual' ? "Student's Signature :" : "Student's Signature:";

  const middle =
    type === 'Individual'
      ? `<p class="vc-attest">${escapeHtml(ATTESTATION_INDIVIDUAL)}</p>
         <table class="vc-sig">
           <tr>
             <td>${escapeHtml(signatureLabel)}</td>
             <td class="vc-sig-date">Date:</td>
           </tr>
         </table>`
      : `<p class="vc-policy">Academic Honesty Policy Statement</p>
         <p class="vc-attest">${escapeHtml(ATTESTATION_GROUP)}</p>
         <table class="vc-sig">
           <tr>
             <td>${escapeHtml(signatureLabel)}</td>
             <td class="vc-sig-date">Date:</td>
           </tr>
         </table>
         <table class="vc-gt">
           <thead>
             <tr>
               <th style="width:28px;"></th>
               <th>Name</th>
               <th>Surname</th>
               <th>ID</th>
               <th>Sign</th>
             </tr>
           </thead>
           <tbody>${groupRows}</tbody>
         </table>`;

  return `<div class="verve-cover">
    <div class="vc-body">
      <img class="vc-logo" src="${escapeHtml(logoSrc)}" alt="Limkokwing University of Creative Technology Sierra Leone logo" />
      ${faculty ? `<p class="vc-faculty vc-center">${escapeHtml(faculty)}</p>` : ''}
      <div class="vc-course">
        <div class="vc-course-rule"></div>
        <h3>${escapeHtml(courseLine)}</h3>
        <div class="vc-course-rule"></div>
      </div>
      <table class="vc-details">
        ${detailRow('Title', formData.assignmentTitle)}
        ${detailRow('Issue Date', formatCoverDate(formData.issueDate))}
        ${detailRow('Due Date', formatCoverDate(formData.dueDate))}
        ${detailRow(lecturerLabel, formData.lecturer)}
        ${individualRows}
        ${detailRow('Class', formData.className)}
        ${detailRow('Semester/Year', formData.semester)}
      </table>
      ${middle}
    </div>
    <div class="vc-grading">
      <div class="vc-grading-left"><p>Lecturer's Comments/Grade:</p></div>
      <div class="vc-grading-right">
        <p class="vc-office">for office use only upon receive</p>
        <p class="vc-remark">Remark</p>
        <div class="vc-office-fields">
          <p>DATE :</p>
          <p>TIME :</p>
          <p>RECEIVER'S NAME :</p>
        </div>
      </div>
    </div>
  </div>`;
}

export function buildCoverDocumentHtml(params: CoverHtmlParams): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    html, body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      width: 210mm;
      height: 297mm;
    }
    ${COVER_PAGE_CSS}
  </style>
</head>
<body>
  ${buildCoverInnerHtml(params)}
</body>
</html>`;
}

export { ATTESTATION_INDIVIDUAL, ATTESTATION_GROUP, splitName };
