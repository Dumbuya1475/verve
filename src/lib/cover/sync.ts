import { doc, getDoc, setDoc } from 'firebase/firestore';
import { z } from 'zod';
import { getFirebaseFirestore } from '@/lib/firebase/client';
import type { CoverType, CoverFormData, GroupMember } from './types';

const coverFormSchema = z.object({
  university: z.string().max(300),
  faculty: z.string().max(300),
  courseCode: z.string().max(100),
  courseTitle: z.string().max(300),
  assignmentTitle: z.string().max(300),
  issueDate: z.string().max(100),
  dueDate: z.string().max(100),
  lecturer: z.string().max(300),
  className: z.string().max(100),
  semester: z.string().max(100),
  studentName: z.string().max(300),
  studentId: z.string().max(100),
});

const coverDraftSchema = z.object({
  type: z.enum(['Individual', 'Group']),
  formData: coverFormSchema,
  groupMembers: z.array(
    z.object({
      name: z.string().max(300),
      id: z.string().max(100),
    }),
  ).max(100),
  updatedAt: z.number().finite().nonnegative(),
});

export type CoverDraft = {
  type: CoverType;
  formData: CoverFormData;
  groupMembers: GroupMember[];
  updatedAt: number;
};

export async function pullRemoteCoverDraft(userId: string): Promise<CoverDraft | null> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Cloud save is not available.');

  const snapshot = await getDoc(doc(db, 'coverDrafts', userId));
  if (!snapshot.exists()) return null;

  return coverDraftSchema.parse(snapshot.data());
}

export async function pushRemoteCoverDraft(
  userId: string,
  draft: CoverDraft,
): Promise<void> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Cloud save is not available.');

  const validatedDraft = coverDraftSchema.parse(draft);
  await setDoc(doc(db, 'coverDrafts', userId), validatedDraft);
}
