import { emptyAssignment, parseAssignment, type AssignmentDraft } from './types';

export const ASSIGNMENT_STORAGE_KEY = 'verve-assignment-draft';

export function readLocalAssignment(): AssignmentDraft {
  if (typeof window === 'undefined') return emptyAssignment();
  try {
    const raw = window.localStorage.getItem(ASSIGNMENT_STORAGE_KEY);
    if (!raw) return emptyAssignment();
    return parseAssignment(JSON.parse(raw));
  } catch {
    return emptyAssignment();
  }
}

export function writeLocalAssignment(draft: AssignmentDraft): void {
  window.localStorage.setItem(ASSIGNMENT_STORAGE_KEY, JSON.stringify(draft));
}
