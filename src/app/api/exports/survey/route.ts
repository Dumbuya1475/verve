import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { SESSION_COOKIE } from '@/lib/firebase/session';
import {
  getFirebaseAdminFirestore,
  verifyFirebaseSession,
} from '@/lib/firebase/admin';

export const runtime = 'nodejs';

const surveySchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(1200, 'Keep your note under 1,200 characters.'),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: 'Send your survey response.' }, { status: 400 });
  }

  const parsed = surveySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Check your survey response.' },
      { status: 400 },
    );
  }

  const sessionToken = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: 'Sign in to send the survey.' }, { status: 401 });
  }

  let sessionUser;
  try {
    sessionUser = await verifyFirebaseSession(sessionToken);
  } catch (error) {
    console.error('Firebase session verification failed for export survey', error);
    return NextResponse.json(
      { error: 'Could not verify your session right now.' },
      { status: 503 },
    );
  }

  if (!sessionUser) {
    return NextResponse.json({ error: 'Sign in to send the survey.' }, { status: 401 });
  }

  try {
    const firestore = getFirebaseAdminFirestore();
    const responseRef = firestore.collection('exportSurveyResponses').doc(sessionUser.uid);
    const statsRef = firestore.collection('userExportStats').doc(sessionUser.uid);
    const result = await firestore.runTransaction(async (transaction) => {
      const statsSnapshot = await transaction.get(statsRef);
      const existing = await transaction.get(responseRef);
      if ((statsSnapshot.data()?.exportCount ?? 0) < 4) return 'under-threshold';
      if (existing.exists) return 'duplicate';
      transaction.create(responseRef, {
        uid: sessionUser.uid,
        rating: parsed.data.rating,
        comment: parsed.data.comment,
        createdAt: new Date().toISOString(),
      });
      return 'saved';
    });

    if (result === 'under-threshold') {
      return NextResponse.json(
        { error: 'The survey is available after your fourth export.' },
        { status: 403 },
      );
    }
    if (result === 'duplicate') {
      return NextResponse.json(
        { error: 'Your survey response has already been received. Thank you!' },
        { status: 409 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Could not save export survey response', error);
    return NextResponse.json(
      { error: 'Could not save your response right now. Please try again.' },
      { status: 503 },
    );
  }
}
