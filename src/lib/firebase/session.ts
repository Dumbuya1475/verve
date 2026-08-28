export {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  PUBLIC_PATHS,
  PROTECTED_PREFIXES,
  isPublicPath,
  isProtectedPath,
  isAuthPath,
} from './constants';

export type SessionUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

type LookupResponse = {
  users?: Array<{
    localId?: string;
    email?: string;
    displayName?: string;
  }>;
  error?: { message?: string };
};

export async function verifyIdToken(idToken: string): Promise<SessionUser | null> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim();
  if (!apiKey || !idToken) return null;

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    },
  );

  if (!response.ok) return null;

  const data = (await response.json()) as LookupResponse;
  const user = data.users?.[0];
  if (!user?.localId) return null;

  return {
    uid: user.localId,
    email: user.email ?? null,
    displayName: user.displayName ?? null,
  };
}

export function accountInitials(name: string, email: string | null): string {
  const source = name.trim() || email?.split('@')[0] || 'A';
  const parts = source.split(/\s+/).filter(Boolean);
  const letters =
    parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`
      : source.slice(0, 2);
  return letters.toUpperCase();
}

export function accountDisplayName(
  displayName: string | null | undefined,
  email: string | null | undefined,
): string {
  const name = displayName?.trim();
  if (name) return name;
  if (email) return email.split('@')[0] ?? email;
  return 'Account';
}
