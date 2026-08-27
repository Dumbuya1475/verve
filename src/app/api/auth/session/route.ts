import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sessionBodySchema } from '@/lib/validation';
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  verifyIdToken,
} from '@/lib/firebase/session';

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: 'Send a JSON body with an idToken.' }, { status: 400 });
  }

  const parsed = sessionBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid session request.' },
      { status: 400 },
    );
  }

  const user = await verifyIdToken(parsed.data.idToken);
  if (!user) {
    return NextResponse.json(
      { error: 'That sign-in session is not valid. Sign in again.' },
      { status: 401 },
    );
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, parsed.data.idToken, cookieOptions());
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const store = await cookies();
  store.set(SESSION_COOKIE, '', { ...cookieOptions(), maxAge: 0 });
  return NextResponse.json({ ok: true });
}
