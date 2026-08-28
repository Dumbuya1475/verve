import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE = 'firebase-auth'; // keep in sync with src/lib/firebase/constants.ts

const PROTECTED_PREFIXES = ['/exam', '/submit'];

function firebaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() &&
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim() &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() &&
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim(),
  );
}

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function isAuthPath(pathname: string): boolean {
  return (
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/forgot-password' ||
    pathname.startsWith('/login/') ||
    pathname.startsWith('/signup/') ||
    pathname.startsWith('/forgot-password/')
  );
}

export function proxy(request: NextRequest) {
  if (!firebaseConfigured()) {
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
    '/exam/:path*',
    '/submit/:path*',
    '/login',
    '/signup',
    '/forgot-password',
  ],
};
