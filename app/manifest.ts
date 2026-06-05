import type { MetadataRoute } from 'next';
import { withBasePath } from '@/lib/base-path';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'World Cup 2026 Match Center',
    short_name: 'WC 2026',
    description:
      'Live countdown timers, fixtures and stadium details for every FIFA World Cup 2026 match.',
    start_url: withBasePath('/'),
    scope: withBasePath('/'),
    display: 'standalone',
    background_color: '#070b18',
    theme_color: '#070b18',
    orientation: 'portrait',
    categories: ['sports', 'news'],
    icons: [
      { src: withBasePath('/icons/icon-192.png'), sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: withBasePath('/icons/icon-512.png'), sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: withBasePath('/icons/icon-512.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
