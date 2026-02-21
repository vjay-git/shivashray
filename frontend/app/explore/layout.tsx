import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Varanasi',
  description:
    'Discover 25+ sacred temples, historic ghats, cultural landmarks and day excursions within walking distance of Shiv Ashray — in the heart of Varanasi\'s old city.',
  openGraph: {
    title: 'Explore Varanasi — Places Near Shiv Ashray',
    description:
      'Discover temples, ghats & cultural landmarks within walking distance of Shiv Ashray hotel in Kachourigali, Varanasi.',
    images: [{ url: '/kashi_temple.jpg', width: 1200, height: 630, alt: 'Kashi Vishwanath Temple, Varanasi' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explore Varanasi — Places Near Shiv Ashray',
    description: 'Discover temples, ghats & cultural landmarks near Shiv Ashray, Varanasi.',
    images: ['/kashi_temple.jpg'],
  },
};

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
