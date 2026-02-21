import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Rooms',
  description:
    'Choose from 25 thoughtfully appointed rooms across 3 floors at Shiv Ashray — Deluxe, Super Deluxe & Family rooms in the heart of Varanasi\'s old city, near Kashi Vishwanath Temple.',
  openGraph: {
    title: 'Rooms at Shiv Ashray — Varanasi',
    description:
      'Deluxe, Super Deluxe & Family rooms in the heart of Varanasi. 220 m from Kashi Vishwanath Temple, steps from the Ganga Ghats.',
    images: [{ url: '/deluxe_room_1.jpg', width: 1200, height: 630, alt: 'Deluxe Room — Shiv Ashray, Varanasi' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rooms at Shiv Ashray — Varanasi',
    description: 'Deluxe, Super Deluxe & Family rooms near Kashi Vishwanath Temple.',
    images: ['/deluxe_room_1.jpg'],
  },
};

export default function RoomsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
