import type { MetadataRoute } from 'next';
import { places } from '@/lib/data/places';

const BASE = 'https://shivashraybanaras.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                    lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/rooms`,         lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/explore`,       lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/about`,         lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contact`,       lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/services`,      lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];

  const placeRoutes: MetadataRoute.Sitemap = places.map(place => ({
    url: `${BASE}/explore/${place.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...placeRoutes];
}
