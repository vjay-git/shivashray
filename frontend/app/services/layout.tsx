import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services & Amenities',
  description:
    'Explore the services and amenities at Shiv Ashray, Varanasi — free WiFi, air conditioning, 24-hour front desk, concierge, and personalised guest services in the heart of the old city.',
  openGraph: {
    title: 'Services & Amenities — Shiv Ashray Varanasi',
    description:
      'Free WiFi, AC rooms, 24-hr front desk & personalised services at Shiv Ashray — Varanasi\'s premier old city hotel.',
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
