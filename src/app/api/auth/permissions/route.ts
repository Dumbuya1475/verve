import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE } from '@/lib/firebase/session';
import {
  getConfiguredCafePrintUids,
  verifyFirebaseSession,
} from '@/lib/firebase/admin';

export const runtime = 'nodejs';

export async function GET() {
  const sessionToken = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!sessionToken) return NextResponse.json({ canPrint: false }, { status: 401 });

  try {
    const user = await verifyFirebaseSession(sessionToken);
    return NextResponse.json({
      canPrint: Boolean(user && getConfiguredCafePrintUids().has(user.uid)),
    });
  } catch (error) {
    console.error('Could not verify account permissions', error);
    return NextResponse.json(
      { error: 'Could not verify your account permissions.' },
      { status: 503 },
    );
  }
}