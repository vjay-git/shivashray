import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Shiv Ashray — a premier hotel in the heart of Varanasi\'s old city, 220 m from Kashi Vishwanath Temple. 25 rooms, 3 floors, modern amenities with a spiritual touch.',
  openGraph: {
    title: 'About Shiv Ashray — Premier Hotel in Varanasi',
    description:
      'Shiv Ashray blends tradition and modern comfort in the spiritual capital of India, steps from the Kashi Vishwanath Temple and Ganga Ghats.',
    images: [{ url: '/property_2.jpg', width: 1200, height: 630, alt: 'Shiv Ashray Hotel, Varanasi' }],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
