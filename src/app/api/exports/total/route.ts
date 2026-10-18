import { NextResponse } from 'next/server';
import { getFirebaseAdminFirestore } from '@/lib/firebase/admin';

export const runtime = 'nodejs';
export const revalidate = 3600;

export async function GET() {
  try {
    const result = await getFirebaseAdminFirestore().collection('exportEvents').count().get();
    return NextResponse.json(
      { totalExports: result.data().count },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      },
    );
  } catch (error) {
    console.error('Could not read public export total', error);
    return NextResponse.json(
      { error: 'Could not read the total exports right now.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
