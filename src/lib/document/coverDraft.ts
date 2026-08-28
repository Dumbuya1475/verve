import type { CoverFormData, CoverType, GroupMember } from '@/lib/cover/types';

const EMPTY_FORM: CoverFormData = {
  university: '',
  faculty: '',
  courseCode: '',
  courseTitle: '',
  assignmentTitle: '',
  issueDate: '',
  dueDate: '',
  lecturer: '',
  className: '',
  semester: '',
  studentName: '',
  studentId: '',
};

export type CoverDraft = {
  type: CoverType;
  formData: CoverFormData;
  groupMembers: GroupMember[];
};

export function readCoverDraft(): CoverDraft | null {
  if (typeof window === 'undefined') return null;
  try {
    const savedForm = window.localStorage.getItem('coverFormData');
    if (!savedForm) return null;
    const formData = { ...EMPTY_FORM, ...JSON.parse(savedForm) } as CoverFormData;
    const savedType = window.localStorage.getItem('coverType');
    const type: CoverType = savedType === 'Group' ? 'Group' : 'Individual';
    let groupMembers: GroupMember[] = [{ name: '', id: '' }];
    const savedMembers = window.localStorage.getItem('coverGroupMembers');
    if (savedMembers) {
      const parsed = JSON.parse(savedMembers);
      if (Array.isArray(parsed) && parsed.length > 0) groupMembers = parsed;
    }
    return { type, formData, groupMembers };
  } catch {
    return null;
  }
}
