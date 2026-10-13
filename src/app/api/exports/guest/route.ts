import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { SESSION_COOKIE } from '@/lib/firebase/session';
import {
  getFirebaseAdminFirestore,
  getFirebaseAdminSigningKey,
  verifyFirebaseSession,
} from '@/lib/firebase/admin';

export const runtime = 'nodejs';

const GUEST_COOKIE = 'verve-guest-export';
const GUEST_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const RESERVATION_MAX_AGE_MS = 10 * 60 * 1000;

const guestExportActionSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('reserve'),
    reservationId: z.string().uuid(),
    kind: z.enum(['cover', 'document']),
    format: z.enum(['pdf', 'docx', 'word']),
  }),
  z.object({
    action: z.literal('complete'),
    reservationId: z.string().uuid(),
  }),
  z.object({
    action: z.literal('cancel'),
    reservationId: z.string().uuid(),
  }),
  z.object({
    action: z.literal('record-print'),
  }),
]);

type GuestCookieIdentity = {
  id: string;
  value: string;
};

function signGuestId(id: string, signingKey: string): string {
  return createHmac('sha256', signingKey).update(id).digest('base64url');
}

async function getGuestIdentity(createIfMissing: boolean): Promise<GuestCookieIdentity | null> {
  const signingKey = getFirebaseAdminSigningKey();
  const cookieStore = await cookies();
  const value = cookieStore.get(GUEST_COOKIE)?.value;
  const [id, signature] = value?.split('.') ?? [];
  if (id && signature && /^[0-9a-f-]{36}$/i.test(id)) {
    const expected = signGuestId(id, signingKey);
    const receivedBytes = Buffer.from(signature);
    const expectedBytes = Buffer.from(expected);
    if (
      receivedBytes.length === expectedBytes.length &&
      timingSafeEqual(receivedBytes, expectedBytes)
    ) {
      return { id, value: `${id}.${expected}` };
    }
  }

  if (!createIfMissing) return null;
  const newId = randomUUID();
  return { id: newId, value: `${newId}.${signGuestId(newId, signingKey)}` };
}

function withGuestCookie(
  response: NextResponse,
  identity: GuestCookieIdentity | null,
): NextResponse {
  if (identity) {
    response.cookies.set(GUEST_COOKIE, identity.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/exports/guest',
      maxAge: GUEST_COOKIE_MAX_AGE,
    });
  }
  return response;
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: 'Send guest export details.' }, { status: 400 });
  }

  const parsed = guestExportActionSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid guest export request.' },
      { status: 400 },
    );
  }

  const sessionToken = (await cookies()).get(SESSION_COOKIE)?.value;
  if (sessionToken) {
    try {
      if (await verifyFirebaseSession(sessionToken)) {
        return NextResponse.json(
          { error: 'Use your signed-in account to export.' },
          { status: 401 },
        );
      }
    } catch (error) {
      console.error('Could not verify session for guest export', error);
      return NextResponse.json(
        { error: 'Could not verify your session right now.' },
        { status: 503 },
      );
    }
  }

  let identity: GuestCookieIdentity | null;
  try {
    identity = await getGuestIdentity(
      parsed.data.action === 'reserve' || parsed.data.action === 'record-print',
    );
  } catch (error) {
    console.error('Could not verify guest export identity', error);
    return NextResponse.json(
      {
        error:
          'Guest export tracking is not configured correctly on the server. Please try again later.',
      },
      { status: 503 },
    );
  }

  if (!identity) {
    return NextResponse.json(
      { error: 'Your guest export session expired. Create an account to continue.' },
      { status: 401 },
    );
  }

  try {
    const firestore = getFirebaseAdminFirestore();
    const guestRef = firestore.collection('guestExportStats').doc(identity.id);
    const now = Date.now();

    if (parsed.data.action === 'record-print') {
      await firestore.collection('exportEvents').add({
        guestId: identity.id,
        kind: 'cover',
        format: 'print',
        createdAt: new Date().toISOString(),
      });
      return withGuestCookie(NextResponse.json({ ok: true }), identity);
    }

    if (parsed.data.action === 'reserve') {
      const reservation = parsed.data;
      const result = await firestore.runTransaction(async (transaction) => {
        const snapshot = await transaction.get(guestRef);
        const data = snapshot.data();
        if ((data?.exportCount ?? 0) >= 1) return 'used';

        const currentReservationId = data?.reservationId;
        const reservedAt = data?.reservedAt;
        const reservationIsActive =
          typeof currentReservationId === 'string' &&
          typeof reservedAt === 'number' &&
          now - reservedAt < RESERVATION_MAX_AGE_MS;

        if (reservationIsActive) {
          return currentReservationId === reservation.reservationId
            ? 'reserved'
            : 'in-progress';
        }

        transaction.set(
          guestRef,
          {
            exportCount: 0,
            reservationId: reservation.reservationId,
            reservationKind: reservation.kind,
            reservationFormat: reservation.format,
            reservedAt: now,
          },
          { merge: true },
        );
        return 'reserved';
      });

      if (result === 'used') {
        return withGuestCookie(
          NextResponse.json(
            { error: 'Your free export has been used. Create an account to export again.' },
            { status: 409 },
          ),
          identity,
        );
      }
      if (result === 'in-progress') {
        return withGuestCookie(
          NextResponse.json(
            { error: 'A guest export is already in progress. Please try again shortly.' },
            { status: 409 },
          ),
          identity,
        );
      }
      return withGuestCookie(
        NextResponse.json({ ok: true, reservationId: parsed.data.reservationId }),
        identity,
      );
    }

    const action = parsed.data;
    const result = await firestore.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(guestRef);
      const data = snapshot.data();

      if (action.action === 'complete') {
        if (data?.lastReservationId === action.reservationId) return 'completed';
        if (data?.reservationId !== action.reservationId) return 'reservation-expired';

        const eventRef = firestore.collection('exportEvents').doc();
        const createdAt = new Date().toISOString();
        transaction.create(eventRef, {
          guestId: identity.id,
          kind: data.reservationKind,
          format: data.reservationFormat,
          createdAt,
        });
        transaction.set(
          guestRef,
          {
            exportCount: 1,
            lastExportAt: createdAt,
            lastReservationId: action.reservationId,
            reservationId: null,
            reservationKind: null,
            reservationFormat: null,
            reservedAt: null,
          },
          { merge: true },
        );
        return 'completed';
      }

      if (data?.lastReservationId === action.reservationId) return 'already-completed';
      if (data?.reservationId !== action.reservationId) return 'reservation-expired';
      transaction.set(
        guestRef,
        {
          reservationId: null,
          reservationKind: null,
          reservationFormat: null,
          reservedAt: null,
        },
        { merge: true },
      );
      return 'cancelled';
    });

    if (result === 'reservation-expired') {
      return withGuestCookie(
        NextResponse.json(
          { error: 'Your free export session expired. Create an account to continue.' },
          { status: 409 },
        ),
        identity,
      );
    }
    return withGuestCookie(NextResponse.json({ ok: true, status: result }), identity);
  } catch (error) {
    console.error('Could not update guest export usage', error);
    return withGuestCookie(
      NextResponse.json(
        { error: 'Could not verify your free export right now. Please try again.' },
        { status: 503 },
      ),
      identity,
    );
  }
}
