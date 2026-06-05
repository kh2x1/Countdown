import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'World Cup 2026 Match Center',
    short_name: 'WC 2026',
    description:
      'Live countdown timers, fixtures and stadium details for every FIFA World Cup 2026 match.',
    start_url: '/',
    display: 'standalone',
    background_color: '#070b18',
    theme_color: '#070b18',
    orientation: 'portrait',
    categories: ['sports', 'news'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
