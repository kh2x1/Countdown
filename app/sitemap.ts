import type { MetadataRoute } from 'next';
import { getMatches } from '@/lib/data';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const matches = await getMatches();
  const matchUrls: MetadataRoute.Sitemap = matches.map((m) => ({
    url: `${siteUrl}/match/${m.id}`,
    lastModified: new Date(),
    changeFrequency: 'hourly',
    priority: 0.7,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    ...matchUrls,
  ];
}
