import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getFirebaseFirestore } from '@/lib/firebase/client';
import { parseAssignment, type AssignmentDraft } from './types';

export async function pullRemoteAssignment(userId: string): Promise<AssignmentDraft | null> {
  const db = getFirebaseFirestore();
  if (!db) return null;
  const snap = await getDoc(doc(db, 'assignments', userId));
  if (!snap.exists()) return null;
  return parseAssignment(snap.data());
}

export async function pushRemoteAssignment(userId: string, draft: AssignmentDraft): Promise<void> {
  const db = getFirebaseFirestore();
  if (!db) {
    throw new Error('Cloud save is not available.');
  }
  await setDoc(doc(db, 'assignments', userId), {
    title: draft.title,
    introduction: draft.introduction,
    body: draft.body,
    conclusion: draft.conclusion,
    references: draft.references,
    includeCover: draft.includeCover,
    updatedAt: draft.updatedAt,
  });
}
