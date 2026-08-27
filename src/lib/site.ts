export const BUY_ME_A_COFFEE_URL =
  process.env.NEXT_PUBLIC_BUY_ME_A_COFFEE_URL?.trim() ?? '';

export function hasBuyMeACoffee(): boolean {
  return /^https?:\/\//i.test(BUY_ME_A_COFFEE_URL);
}

export const SITE_NAME = 'Verve';
export const SITE_TAGLINE =
  'A calm academic workspace for university students in Sierra Leone.';
