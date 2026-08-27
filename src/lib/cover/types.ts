export type CoverType = 'Individual' | 'Group';

export type CoverFormData = {
  university: string;
  faculty: string;
  courseCode: string;
  courseTitle: string;
  assignmentTitle: string;
  issueDate: string;
  dueDate: string;
  lecturer: string;
  className: string;
  semester: string;
  studentName: string;
  studentId: string;
};

export type GroupMember = {
  name: string;
  id: string;
};

export const A4_WIDTH_PX = 794;
export const A4_HEIGHT_PX = 1123;

export const COVER_LOGO_PATH = '/cover_logo/LUCT.jpeg';
export const COVER_LOGO_ALT = 'Limkokwing University of Creative Technology Sierra Leone logo';
