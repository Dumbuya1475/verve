import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { feedbackBodySchema } from '@/lib/validation';
import { getFirebaseWebConfig } from '@/lib/firebase/config';
import { SESSION_COOKIE, verifyIdToken } from '@/lib/firebase/session';

type FirestoreFields = Record<string, { stringValue: string }>;

export async function POST(request: Request) {
  const config = getFirebaseWebConfig();
  if (!config) {
    return NextResponse.json(
      {
        error:
          'Feedback is not available yet. Add Firebase project keys to the server environment.',
      },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: 'Send a JSON body with your message.' }, { status: 400 });
  }

  const parsed = feedbackBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Check the form and try again.' },
      { status: 400 },
    );
  }

  const store = await cookies();
  const sessionToken = store.get(SESSION_COOKIE)?.value;
  const sessionUser = sessionToken ? await verifyIdToken(sessionToken) : null;

  const name = parsed.data.name?.trim() || sessionUser?.displayName || '';
  const email = parsed.data.email?.trim() || sessionUser?.email || '';

  const fields: FirestoreFields = {
    message: { stringValue: parsed.data.message },
    createdAt: { stringValue: new Date().toISOString() },
  };
  if (name) fields.name = { stringValue: name };
  if (email) fields.email = { stringValue: email };
  if (sessionUser?.uid) fields.userId = { stringValue: sessionUser.uid };

  const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/feedback?key=${encodeURIComponent(config.apiKey)}`;

  try {
    const response = await fetch(firestoreUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields }),
    });

    if (!response.ok) {
      const details = await response.text();
      console.error('Firestore feedback write failed', response.status, details);
      return NextResponse.json(
        {
          error:
            'Could not save your feedback. Enable Cloud Firestore in the Firebase console and deploy the rules in firestore.rules.',
        },
        { status: 502 },
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Could not reach Firestore. Check your network and Firebase project.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
