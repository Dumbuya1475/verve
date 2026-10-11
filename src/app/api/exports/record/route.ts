import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { SESSION_COOKIE, verifyIdToken } from '@/lib/firebase/session';
import { getFirebaseWebConfig } from '@/lib/firebase/config';

const exportBodySchema = z.object({
  kind: z.enum(['cover', 'document']),
  format: z.enum(['pdf', 'docx', 'word']),
});

function extractStringValue(fields: Record<string, any> | undefined, key: string): string {
  return typeof fields?.[key]?.stringValue === 'string' ? fields[key].stringValue : '';
}

export async function POST(request: Request) {
  const config = getFirebaseWebConfig();
  if (!config) {
    return NextResponse.json(
      { error: 'Add Firebase keys before enabling export tracking.' },
      { status: 503 },
    );
  }

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

  const store = await cookies();
  const sessionToken = store.get(SESSION_COOKIE)?.value;
  const sessionUser = sessionToken ? await verifyIdToken(sessionToken) : null;

  if (!sessionUser) {
    return NextResponse.json({ error: 'Sign in to export and record usage.' }, { status: 401 });
  }

  const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/exportEvents?key=${encodeURIComponent(config.apiKey)}`;
  const fields = {
    uid: { stringValue: sessionUser.uid },
    kind: { stringValue: parsed.data.kind },
    format: { stringValue: parsed.data.format },
    createdAt: { stringValue: new Date().toISOString() },
  };

  try {
      const response = await fetch(firestoreUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields }),
      });

    if (!response.ok) {
      const details = await response.text();
      console.error('exportEvents write failed', response.status, details);
      return NextResponse.json(
        { error: 'Could not record the export. Sign in again and try once more.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Could not record this export right now.' }, { status: 502 });
  }
}

export async function GET() {
  const config = getFirebaseWebConfig();
  if (!config) {
    return NextResponse.json(
      { error: 'Add Firebase keys before viewing export analytics.' },
      { status: 503 },
    );
  }

  const store = await cookies();
  const sessionToken = store.get(SESSION_COOKIE)?.value;
  const sessionUser = sessionToken ? await verifyIdToken(sessionToken) : null;

  if (!sessionUser) {
    return NextResponse.json({ error: 'Sign in to view export usage.' }, { status: 401 });
  }

  const statsUrl = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/exportEvents?key=${encodeURIComponent(config.apiKey)}`;

  try {
    const response = await fetch(statsUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const details = await response.text();
      console.error('exportEvents read failed', response.status, details);
      return NextResponse.json({ error: 'Could not read export analytics.' }, { status: 502 });
    }

    const payload = (await response.json()) as {
      documents?: Array<{
        fields?: Record<string, { stringValue?: string }>;
      }>;
    };

    const documents = payload.documents ?? [];
    const totalExports = documents.length;
    const uniqueUsers = new Set(
      documents
        .map((document) => extractStringValue(document.fields, 'uid'))
        .filter(Boolean),
    ).size;
    const exportsByKind = documents.reduce<Record<string, number>>((accumulator, document) => {
      const kind = extractStringValue(document.fields, 'kind');
      if (kind) accumulator[kind] = (accumulator[kind] ?? 0) + 1;
      return accumulator;
    }, {});

    return NextResponse.json({
      ok: true,
      totalExports,
      uniqueUsers,
      exportsByKind,
      generatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Could not read export analytics right now.' }, { status: 502 });
  }
}
