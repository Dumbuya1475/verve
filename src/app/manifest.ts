import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Verve',
    short_name: 'Verve',
    description:
      'A calm academic workspace for university students in Sierra Leone. Build assignment cover pages and export them for class.',
    start_url: '/cover',
    scope: '/',
    display: 'standalone',
    background_color: '#FAFAF9',
    theme_color: '#FAFAF9',
    lang: 'en',
    categories: ['education', 'productivity'],
    icons: [
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
