import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { verifyIdToken as verifyFirebaseIdToken } from './session';

type ServiceAccount = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

function readServiceAccount(): ServiceAccount {
  let value = process.env.FIREBASE_SERVICE_ACCOUNT_KEY?.trim();
  if (!value) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not configured.');
  }

  const firstCharacter = value[0];
  const lastCharacter = value[value.length - 1];
  if (
    (firstCharacter === "'" || firstCharacter === '"') &&
    lastCharacter === firstCharacter &&
    value.slice(1, -1).trim().startsWith('{') &&
    value.slice(1, -1).trim().endsWith('}')
  ) {
    value = value.slice(1, -1).trim();
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT_KEY must contain raw, valid service-account JSON without surrounding quotes.',
    );
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

export async function getFirebaseAdminAuth() {
  const { getAuth } = await import('firebase-admin/auth');
  return getAuth(getAdminApp());
}

export function getFirebaseAdminSigningKey(): string {
  return readServiceAccount().privateKey;
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
): Promise<Awaited<ReturnType<typeof verifyFirebaseIdToken>>> {
  return verifyFirebaseIdToken(idToken);
}
