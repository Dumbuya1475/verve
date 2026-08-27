export type FirebaseWebConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

function readEnv(name: string): string {
  return process.env[name]?.trim() ?? '';
}

export function getFirebaseWebConfig(): FirebaseWebConfig | null {
  const apiKey = readEnv('NEXT_PUBLIC_FIREBASE_API_KEY');
  const authDomain = readEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN');
  const projectId = readEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
  const storageBucket = readEnv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET');
  const messagingSenderId = readEnv('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID');
  const appId = readEnv('NEXT_PUBLIC_FIREBASE_APP_ID');

  if (!apiKey || !authDomain || !projectId || !appId) {
    return null;
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  };
}

export function isFirebaseConfigured(): boolean {
  return getFirebaseWebConfig() !== null;
}
