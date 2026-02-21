import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/bookings', '/login', '/register'],
      },
    ],
    sitemap: 'https://shivashraybanaras.com/sitemap.xml',
  };
}
