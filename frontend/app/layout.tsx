import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MainContent } from "@/components/layout/MainContent";
import { WhatsAppFloater } from "@/components/layout/WhatsAppFloater";

/* Luxury typography: two families only – serif (headings), sans (body & UI) */
const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  weight: ["300", "400"],
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://shivashraybanaras.com'),
  title: {
    default: 'Shiv Ashray — Premier Lodging in the Heart of Varanasi',
    template: '%s | Shiv Ashray Varanasi',
  },
  description:
    'Stay in the heart of Varanasi\'s old city — 220 m from Kashi Vishwanath Temple, 2–5 min walk to Ganga Ghats, Kal Bhairav & the sacred lanes of Kachourigali. 25 thoughtfully appointed rooms.',
  keywords: [
    'hotel varanasi', 'shiv ashray', 'kashi vishwanath temple hotel',
    'varanasi accommodation', 'old city varanasi hotel', 'ganga ghat hotel',
    'banarasi hotel', 'kachourigali hotel', 'varanasi guesthouse',
    'spiritual retreat varanasi',
  ],
  authors: [{ name: 'Shiv Ashray', url: 'https://shivashraybanaras.com' }],
  creator: 'Shiv Ashray',
  publisher: 'Shiv Ashray',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://shivashraybanaras.com',
    siteName: 'Shiv Ashray',
    title: 'Shiv Ashray — Premier Lodging in the Heart of Varanasi',
    description:
      'Stay in the heart of Varanasi\'s old city — 220 m from Kashi Vishwanath Temple, 2–5 min walk to Ganga Ghats.',
    images: [
      {
        url: '/property_2.jpg',
        width: 1200,
        height: 630,
        alt: 'Shiv Ashray Hotel — Kachourigali, Varanasi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shiv Ashray — Premier Lodging in the Heart of Varanasi',
    description: 'Stay in the heart of Varanasi\'s old city — 220 m from Kashi Vishwanath Temple.',
    images: ['/property_2.jpg'],
  },
  icons: {
    icon: '/shivashray.png',
    apple: '/shivashray.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorantGaramond.variable} ${inter.variable} ${geistMono.variable} font-sans antialiased min-h-screen flex flex-col text-base text-slate-900 dark:text-slate-100 leading-[1.75]`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LodgingBusiness',
              name: 'Shiv Ashray',
              url: 'https://shivashraybanaras.com',
              logo: 'https://shivashraybanaras.com/shivashray.png',
              image: 'https://shivashraybanaras.com/property_2.jpg',
              description:
                'Premier lodging in the heart of Varanasi\'s old city, 220 m from Kashi Vishwanath Temple and 2–5 min walk to Ganga Ghats.',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '25/14, Kachaudi Gali, Lahori Tola',
                addressLocality: 'Varanasi',
                addressRegion: 'Uttar Pradesh',
                postalCode: '221001',
                addressCountry: 'IN',
              },
              telephone: '+91-9369353505',
              email: 'shivashrayvns@gmail.com',
              numberOfRooms: 25,
              priceRange: '₹₹',
              checkinTime: '12:00',
              checkoutTime: '11:00',
              hasMap: 'https://maps.app.goo.gl/nGkDab58p3uh257E9',
              amenityFeature: [
                { '@type': 'LocationFeatureSpecification', name: 'Free WiFi', value: true },
                { '@type': 'LocationFeatureSpecification', name: 'Air Conditioning', value: true },
                { '@type': 'LocationFeatureSpecification', name: '24-hour Front Desk', value: true },
              ],
              sameAs: ['https://shivashraybanaras.com'],
            }),
          }}
        />
        <Navbar />
        <MainContent>{children}</MainContent>
        <Footer />
        <WhatsAppFloater />
      </body>
    </html>
  );
}
