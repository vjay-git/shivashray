import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Contact Shiv Ashray in Varanasi — call +91 9369353505, email shivashrayvns@gmail.com, or visit us at 25/14 Kachaudi Gali, Lahori Tola, Varanasi 221001.',
  openGraph: {
    title: 'Contact Shiv Ashray — Varanasi',
    description:
      'Get in touch with Shiv Ashray. Address: 25/14 Kachaudi Gali, Varanasi. Phone: +91 9369353505.',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
