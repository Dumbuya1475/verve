import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import type { DecodedIdToken } from 'firebase-admin/auth';

type ServiceAccount = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

function readServiceAccount(): ServiceAccount {
  const value = process.env.FIREBASE_SERVICE_ACCOUNT_KEY?.trim();
  if (!value) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not configured.');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY must contain valid service-account JSON.');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY must contain a service-account object.');
  }

  const account = parsed as Record<string, unknown>;
  const projectId = account.project_id;
  const clientEmail = account.client_email;
  const privateKey = account.private_key;
  if (
    typeof projectId !== 'string' ||
    typeof clientEmail !== 'string' ||
    typeof privateKey !== 'string'
  ) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is missing required service-account fields.');
  }

  return { projectId, clientEmail, privateKey };
}

function getAdminApp() {
  const existing = getApps().find((app) => app.name === 'verve-admin');
  if (existing) return existing;

  const serviceAccount = readServiceAccount();
  return initializeApp(
    {
      credential: cert(serviceAccount),
      projectId: serviceAccount.projectId,
    },
    'verve-admin',
  );
}

export function getFirebaseAdminAuth() {
  return getAuth(getAdminApp());
}

export function getFirebaseAdminFirestore() {
  return getFirestore(getAdminApp());
}

export function getConfiguredAdminUid(): string {
  const uid = process.env.ADMIN_UID?.trim();
  if (!uid) {
    throw new Error('ADMIN_UID is not configured.');
  }
  return uid;
}

export async function verifyFirebaseSession(
  idToken: string,
): Promise<DecodedIdToken | null> {
  try {
    return await getFirebaseAdminAuth().verifyIdToken(idToken, true);
  } catch (error) {
    const code =
      typeof error === 'object' && error !== null && 'code' in error
        ? error.code
        : undefined;
    if (
      typeof code === 'string' &&
      [
        'auth/argument-error',
        'auth/id-token-expired',
        'auth/id-token-revoked',
        'auth/invalid-id-token',
        'auth/user-disabled',
        'auth/user-not-found',
      ].includes(code)
    ) {
      return null;
    }
    throw error;
  }
}
