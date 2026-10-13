import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { SESSION_COOKIE } from '@/lib/firebase/session';
import {
  getConfiguredAdminUid,
  getFirebaseAdminFirestore,
  verifyFirebaseSession,
} from '@/lib/firebase/admin';

export const runtime = 'nodejs';

const exportBodySchema = z.object({
  kind: z.enum(['cover', 'document']),
  format: z.enum(['pdf', 'docx', 'word', 'print']),
});

async function getSessionUser() {
  const sessionToken = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!sessionToken) return null;
  return verifyFirebaseSession(sessionToken);
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: 'Send export details.' }, { status: 400 });
  }

  const parsed = exportBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid export payload.' },
      { status: 400 },
    );
  }

  let sessionUser;
  try {
    sessionUser = await getSessionUser();
  } catch (error) {
    console.error('Firebase session verification failed', error);
    return NextResponse.json(
      { error: 'Could not verify your session right now.' },
      { status: 503 },
    );
  }

  if (!sessionUser) {
    return NextResponse.json({ error: 'Sign in to record export usage.' }, { status: 401 });
  }

  try {
    const firestore = getFirebaseAdminFirestore();
    if (parsed.data.format === 'print') {
      await firestore.collection('exportEvents').add({
        uid: sessionUser.uid,
        kind: parsed.data.kind,
        format: parsed.data.format,
        createdAt: new Date().toISOString(),
      });
      return NextResponse.json({ ok: true, showSurvey: false });
    }

    const surveyRef = firestore.collection('exportSurveyResponses').doc(sessionUser.uid);
    const eventRef = firestore.collection('exportEvents').doc();
    const userStatsRef = firestore.collection('userExportStats').doc(sessionUser.uid);
    const result = await firestore.runTransaction(async (transaction) => {
      const statsSnapshot = await transaction.get(userStatsRef);
      const surveySnapshot = await transaction.get(surveyRef);
      const stats = statsSnapshot.data();
      const previousCount =
        typeof stats?.exportCount === 'number' && Number.isSafeInteger(stats.exportCount)
          ? stats.exportCount
          : statsSnapshot.exists
            ? 0
            : (
                await transaction.get(
                  firestore.collection('exportEvents').where('uid', '==', sessionUser.uid),
                )
              ).size;
      const exportCount = previousCount + 1;
      const showSurvey = exportCount >= 4 && !surveySnapshot.exists;
      const createdAt = new Date().toISOString();

      transaction.create(eventRef, {
        uid: sessionUser.uid,
        kind: parsed.data.kind,
        format: parsed.data.format,
        createdAt,
      });
      transaction.set(
        userStatsRef,
        {
          exportCount,
          lastExportAt: createdAt,
        },
        { merge: true },
      );

      return { exportCount, showSurvey };
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error('Could not write export event', error);
    return NextResponse.json(
      { error: 'Could not record this export right now.' },
      { status: 503 },
    );
  }
}

export async function GET() {
  let sessionUser;
  try {
    sessionUser = await getSessionUser();
  } catch (error) {
    console.error('Firebase session verification failed', error);
    return NextResponse.json(
      { error: 'Could not verify your session right now.' },
      { status: 503 },
    );
  }

  if (!sessionUser) {
    return NextResponse.json({ error: 'Sign in to view export usage.' }, { status: 401 });
  }

  let adminUid: string;
  try {
    adminUid = getConfiguredAdminUid();
  } catch (error) {
    console.error('Admin analytics access is not configured', error);
    return NextResponse.json(
      { error: 'Admin analytics access is not configured.' },
      { status: 503 },
    );
  }

  if (sessionUser.uid !== adminUid) {
    return NextResponse.json(
      { error: 'You do not have access to export analytics.' },
      { status: 403 },
    );
  }

  try {
    const firestore = getFirebaseAdminFirestore();
    const snapshot = await firestore
      .collection('exportEvents')
      .select('uid', 'guestId', 'kind', 'format')
      .get();
    const usersWhoExported = new Set<string>();
    const exportsByKind: Record<string, number> = {};
    const exportsByFormat: Record<string, number> = {};
    let guestExports = 0;

    for (const document of snapshot.docs) {
      const uid: unknown = document.get('uid');
      const guestId: unknown = document.get('guestId');
      const kind: unknown = document.get('kind');
      const format: unknown = document.get('format');
      if (typeof uid === 'string' && uid) usersWhoExported.add(uid);
      if (
        typeof guestId === 'string' &&
        guestId &&
        format !== 'print'
      ) {
        guestExports += 1;
      }
      if (typeof kind === 'string' && kind) {
        exportsByKind[kind] = (exportsByKind[kind] ?? 0) + 1;
      }
      if (typeof format === 'string' && format) {
        exportsByFormat[format] = (exportsByFormat[format] ?? 0) + 1;
      }
    }

    return NextResponse.json(
      {
        ok: true,
        totalExports: snapshot.size,
        usersWhoExported: usersWhoExported.size,
        guestExports,
        exportsByKind,
        exportsByFormat,
        generatedAt: new Date().toISOString(),
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    console.error('Could not read export analytics', error);
    return NextResponse.json(
      { error: 'Could not read export analytics right now.' },
      { status: 503 },
    );
  }
}
