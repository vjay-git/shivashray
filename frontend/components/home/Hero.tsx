'use client';

import Image from 'next/image';
import { getBookingEngineUrl } from '@/lib/booking-engine';

const TRUST = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    value: '2 min walk',
    label: 'Kashi Vishwanath',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ),
    value: '5.0 / 5',
    label: 'Google Reviews',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    value: 'Free cancel',
    label: 'Up to 3 days prior',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
    value: '25 Rooms',
    label: 'Boutique property',
  },
];

export function Hero() {
  const bookingUrl = getBookingEngineUrl();

  return (
    // Fix 1: h-[100dvh] avoids iOS Safari 100vh jump; min-h-screen is the fallback
    <section className="relative h-[100dvh] min-h-screen flex flex-col -mt-[72px] overflow-hidden">

      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/kashi_temple.jpg"
          alt="Kashi Vishwanath Temple — 2 min from Shiv Ashray"
          fill
          priority
          quality={95}
          className="object-cover object-center scale-[1.03]"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.30) 38%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.92) 100%)',
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-64"
          style={{ background: 'linear-gradient(to top, rgba(20,12,0,0.6) 0%, transparent 100%)' }}
        />
      </div>

      {/* Main content
          Fix 2: pt-[88px] (not pt-32) — shifts optical center up to compensate for
                  the asymmetry between navbar (72px) and trust strip (143px mobile / 87px desktop).
          Fix 3: pb-44 mobile (176px) > trust strip height (143px) = 33px clearance.
                 pb-32 desktop (128px) > trust strip height (87px)  = 41px clearance.
      */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-[88px] md:pt-32 pb-44 md:pb-32 text-center">

        {/* Location pill */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-black/30 backdrop-blur-sm border border-white/15 text-white/75 text-[11px] font-medium tracking-wide uppercase mb-6 md:mb-8">
          <svg className="w-3 h-3 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          Old City, Varanasi
        </div>

        {/* Hotel name */}
        <h1 className="mb-4 md:mb-5 drop-shadow-[0_4px_32px_rgba(0,0,0,0.55)]" aria-label="Shiv Ashray">
          <span
            className="block font-serif font-light uppercase tracking-[0.55em] text-xl md:text-2xl mb-2 md:mb-3 title-gold-glow"
            style={{ color: '#D4AF37' }}
          >
            Shiv
          </span>
          <span
            className="block font-serif font-light tracking-[0.1em] title-shimmer"
            style={{ fontSize: 'clamp(3.2rem, 10vw, 7rem)', lineHeight: 1 }}
          >
            Ashray
          </span>
        </h1>

        {/* Gold rule */}
        <div className="flex items-center gap-4 mb-4 md:mb-6">
          <div className="h-px w-14 md:w-24" style={{ background: 'linear-gradient(to right, transparent, #C6A75E)' }} />
          <svg className="w-3 h-3 text-amber-400 shrink-0" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 0 L12 6 L6 12 L0 6 Z" />
          </svg>
          <div className="h-px w-14 md:w-24" style={{ background: 'linear-gradient(to left, transparent, #C6A75E)' }} />
        </div>

        {/* Tagline */}
        <p className="font-serif font-light italic text-white/80 text-base md:text-xl lg:text-[1.6rem] mb-7 md:mb-10 max-w-sm md:max-w-lg leading-snug">
          Wake up steps from the sacred.<br className="hidden sm:block" /> Every morning begins at the Ghats.
        </p>

        {/* CTA
            Fix 4: w-full sm:w-auto + justify-center on both buttons so they are
                   equal width when stacked on mobile, not a mismatched pair.
        */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full max-w-xs sm:max-w-none sm:w-auto">
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2.5 px-10 py-4 rounded-full text-[14.5px] font-semibold text-gray-900 shadow-[0_8px_40px_rgba(198,167,94,0.45)] transition-all duration-300 hover:shadow-[0_12px_48px_rgba(198,167,94,0.6)] hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #C6A75E 0%, #D4AF37 50%, #C6A75E 100%)' }}
          >
            Reserve Your Room
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="/rooms"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-[14px] font-medium text-white/85 border border-white/20 hover:border-white/45 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            Explore Rooms
          </a>
        </div>

      </div>

      {/* Trust strip — absolute at bottom
          Mobile (grid-cols-2, px-3 py-3): 2 rows × ~44px + pb-4 = ~104px total
          Desktop (grid-cols-4, px-5 py-4): 1 row × ~52px + pb-6 = ~58px total
          Both safely below the pb-44 / pb-32 clearance above.
      */}
      <div className="absolute bottom-0 inset-x-0 z-20 px-4 pb-4 md:pb-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden backdrop-blur-md border border-white/10">
            {TRUST.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 px-3 py-3 md:px-5 md:py-4 bg-black/35 hover:bg-black/45 transition-colors"
              >
                <span className="text-amber-400 shrink-0">{item.icon}</span>
                <div className="min-w-0">
                  <p className="text-white font-semibold text-[12px] md:text-[13px] leading-tight truncate">{item.value}</p>
                  <p className="text-white/50 text-[10px] md:text-[11px] mt-0.5 truncate">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator — desktop only, well above 1-row trust strip */}
      <div className="hidden md:flex absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-1 text-white/30 animate-bounce">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

    </section>
  );
}
