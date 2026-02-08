import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MainContent } from "@/components/layout/MainContent";

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
  title: "Shiv Ashray - Premier Lodging in the Heart of Varanasi",
  description: "A seamless blend of tradition and spiritual serenity in the spiritual capital of India. Located near Kashi Vishwanath Temple, offering personalized services for a memorable stay. 25 rooms across 3 floors with modern amenities.",
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
        <Navbar />
        <MainContent>{children}</MainContent>
        <Footer />
      </body>
    </html>
  );
}
