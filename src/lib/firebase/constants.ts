export const SESSION_COOKIE = 'firebase-auth';

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 5;

export const PUBLIC_PATHS = [
  '/',
  '/cover',
  '/login',
  '/signup',
  '/forgot-password',
  '/feedback',
] as const;

export const PROTECTED_PREFIXES = [
  '/document',
  '/exam',
  '/submit',
] as const;

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || (path !== '/' && pathname.startsWith(`${path}/`)),
  );
}

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function safeNextPath(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/cover';
  return value;
}

export function isAuthPath(pathname: string): boolean {
  return (
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/forgot-password' ||
    pathname.startsWith('/login/') ||
    pathname.startsWith('/signup/') ||
    pathname.startsWith('/forgot-password/')
  );
}
