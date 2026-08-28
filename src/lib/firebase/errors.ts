export function friendlyAuthError(error: unknown): string {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code: unknown }).code)
      : '';

  switch (code) {
    case 'auth/invalid-email':
      return 'That email address is not valid. Check the spelling and try again.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Contact support if you think that is a mistake.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
      return 'Incorrect email or password. Try again, or reset your password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Sign in instead, or reset your password.';
    case 'auth/weak-password':
      return 'Choose a password with at least 6 characters.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Wait a minute, then try again.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Google sign-in was cancelled. You can try again when you are ready.';
    case 'auth/popup-blocked':
      return 'The sign-in window was blocked. Allow pop-ups for this site, then try again.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled yet. Enable it in the Firebase console.';
    default:
      return 'Something went wrong while signing in. Try again in a moment.';
  }
}
