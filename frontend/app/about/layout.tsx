import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us — A Sanctuary Rooted in Devotion',
  description:
    'Discover Shiv Ashray — a boutique hotel in Varanasi\'s sacred old city. 25 rooms, 2 min from Kashi Vishwanath Temple, built with devotion, warmth, and the spirit of Kashi.',
  openGraph: {
    title: 'About Shiv Ashray — Sanctuary in the Heart of Kashi',
    description:
      'Steps from Kashi Vishwanath, the Ganga Ghats, and Kal Bhairav. 25 rooms, modern amenities, and the warmth of a home rooted in Varanasi\'s sacred spirit.',
    images: [{ url: '/property_2.jpg', width: 1200, height: 630, alt: 'Shiv Ashray Hotel, Varanasi' }],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
