'use client';

import Link from 'next/link';
import { getBookingEngineUrl } from '@/lib/booking-engine';

const QUICK_LINKS = [
  { label: 'Rooms & Rates', href: '/rooms' },
  { label: 'Explore Varanasi', href: '/experiences' },
  { label: 'Our Services', href: '/services' },
  { label: 'Contact Us', href: '/contact' },
];

export function CTA() {
  const bookingUrl = getBookingEngineUrl();

  return (
    <section
      className="py-14 md:py-20 px-4 md:px-8 lg:px-12"
      style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)' }}
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">

        {/* Left: text */}
        <div className="text-center lg:text-left">
          <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
            Book direct &amp; save
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to experience Varanasi?
          </h2>
          <p className="text-white/60 text-sm md:text-base max-w-md">
            Best rates guaranteed when you book direct. Free cancellation up to 3 days before check-in.
          </p>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-6">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[12px] font-semibold text-white/60 hover:text-white border border-white/15 hover:border-white/30 px-3.5 py-1.5 rounded-full transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-[14px] font-bold text-gray-900 transition-all duration-200 hover:brightness-110 active:scale-[0.97] whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, #C6A75E, #D4AF37)' }}
          >
            Check Availability
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-[14px] font-semibold text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-200 whitespace-nowrap"
          >
            Contact Us
          </Link>
        </div>

      </div>

      {/* Bottom strip */}
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/40 text-[12px]">
        <p>© {new Date().getFullYear()} Shiv Ashray, Varanasi. All rights reserved.</p>
        <p>Kachaudi Gali, Lahori Tola, Varanasi – 221001</p>
      </div>
    </section>
  );
}
