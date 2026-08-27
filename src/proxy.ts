import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getFirebaseWebConfig } from '@/lib/firebase/config';
import {
  SESSION_COOKIE,
  isAuthPath,
  isProtectedPath,
} from '@/lib/firebase/session';

export function proxy(request: NextRequest) {
  if (!getFirebaseWebConfig()) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  if (isProtectedPath(pathname) && !hasSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPath(pathname) && hasSession) {
    return NextResponse.redirect(new URL('/cover', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|_next/webpack-hmr|favicon.ico|icon.svg|sw.js|manifest.json|manifest.webmanifest|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
