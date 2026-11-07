export const BUY_ME_A_COFFEE_URL =
  process.env.NEXT_PUBLIC_BUY_ME_A_COFFEE_URL?.trim() ?? '';

export function hasBuyMeACoffee(): boolean {
  return /^https?:\/\//i.test(BUY_ME_A_COFFEE_URL);
}

export const SITE_NAME = 'Verve';
export const SITE_TAGLINE =
  'A calm academic workspace for university students in Sierra Leone.';

const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();

export const SITE_URL = new URL(
  configuredSiteUrl
    ? /^https?:\/\//i.test(configuredSiteUrl)
      ? configuredSiteUrl
      : `https://${configuredSiteUrl}`
    : 'http://localhost:3000',
);

export const GITHUB_REPO_URL = 'https://github.com/Dumbuya1475/verve';
export const GITHUB_CLONE_URL = 'https://github.com/Dumbuya1475/verve.git';
