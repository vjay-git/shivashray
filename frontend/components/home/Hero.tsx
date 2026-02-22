'use client';

import Image from 'next/image';
import { hotelContent } from '@/lib/content/hotel-content';
import { getBookingEngineUrl } from '@/lib/booking-engine';

const GOLD = '#D4AF37';

export function Hero() {
  const bookingEngineUrl = getBookingEngineUrl();
  const tagline = hotelContent.tagline ?? '';
  const nameParts = hotelContent.name.split(/\s+/);

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-start overflow-hidden -mt-20 sm:-mt-24 lg:mt-0">
      {/* Full-width immersive background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/kashi_temple.jpg"
          alt="Kashi Vishwanath Temple - Spiritual heritage of Varanasi"
          fill
          priority
          quality={100}
          className="object-cover"
          sizes="100vw"
        />
        {/* Cinematic overlay: navy → dark indigo for readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(14, 26, 43, 0.5) 0%, rgba(14, 26, 43, 0.75) 40%, rgba(18, 18, 18, 0.92) 100%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 pt-24 sm:pt-28 lg:pt-12 pb-16 md:pb-24">
        <div className="max-w-3xl">

          {/* Eyebrow — hidden on mobile, shown from sm up */}
          <div className="hidden sm:flex items-center gap-3 mb-5">
            <span className="text-xl leading-none select-none" style={{ color: `${GOLD}70`, fontFamily: 'serif' }}>ॐ</span>
            <span className="h-px w-8" style={{ background: `linear-gradient(90deg, ${GOLD}55, transparent)` }} />
            <span className="text-[9px] font-medium tracking-[0.32em] uppercase" style={{ color: 'rgba(255,255,255,0.32)' }}>
              Est. 2025 &nbsp;·&nbsp; Varanasi
            </span>
          </div>

          {/* Mobile-only: tiny Om */}
          <div className="flex sm:hidden mb-4">
            <span className="text-base leading-none select-none" style={{ color: `${GOLD}70`, fontFamily: 'serif' }}>ॐ</span>
          </div>

          {/* Title */}
          <h1 aria-label={hotelContent.name} className="leading-none mb-4 sm:mb-0">
            <span
              className="block font-light uppercase"
              style={{
                fontFamily: 'var(--font-playfair-display), Georgia, serif',
                fontSize: 'clamp(0.95rem, 2.8vw, 1.6rem)',
                color: 'rgba(255,255,255,0.75)',
                marginBottom: '0.15em',
                letterSpacing: '0.42em',
              }}
            >
              {nameParts[0]}
            </span>
            <span
              className="block italic font-light"
              style={{
                fontFamily: 'var(--font-playfair-display), Georgia, serif',
                fontSize: 'clamp(3.6rem, 13vw, 7.5rem)',
                lineHeight: 0.92,
                letterSpacing: '-0.025em',
                background: 'linear-gradient(118deg, #9A7B2F 0%, #C8A84B 15%, #F5E27A 35%, #FFFDE0 50%, #F5E27A 65%, #C8A84B 82%, #9A7B2F 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 2px 32px rgba(212,175,55,0.30))',
              }}
            >
              {nameParts.slice(1).join(' ')}
            </span>
          </h1>

          {/* Ornamental rule */}
          <div className="flex items-center gap-2.5 mt-4 sm:mt-5 max-w-[220px] sm:max-w-[280px]">
            <span className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}55)` }} />
            <svg width="8" height="8" viewBox="0 0 9 9" fill="none">
              <path d="M4.5 0L5.5 3.5L9 4.5L5.5 5.5L4.5 9L3.5 5.5L0 4.5L3.5 3.5Z" fill={GOLD} opacity="0.7" />
            </svg>
            <span className="h-px flex-1" style={{ background: `linear-gradient(270deg, transparent, ${GOLD}55)` }} />
          </div>

          {/* Subheadline — short on mobile, full on desktop */}
          <p className="sm:hidden mt-4 text-[15px] text-white/70 font-light leading-relaxed">
            2 min walk to Ganga Ghat & Kashi Vishwanath.
          </p>
          <p className="hidden sm:block mt-5 text-lg md:text-xl text-white/80 max-w-lg leading-relaxed font-light">
            City center — Ganga Ghat, Kal Bhairav & Vishwanath Mandir all within a 2–5 min walk. No vehicle needed.
          </p>

          {/* CTA */}
          <a
            href={bookingEngineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 sm:mt-8 inline-flex items-center justify-center px-7 sm:px-8 py-3.5 sm:py-4 bg-[#C6A75E] text-[#0E1A2B] text-[15px] sm:text-base font-semibold rounded-xl transition-all duration-300 hover:bg-[#D4AF37] hover:shadow-[0_12px_40px_rgba(198,167,94,0.35)] active:scale-[0.98]"
          >
            Check Availability
          </a>

          {/* Trust signal */}
          <div className="mt-4 flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="12" height="12" viewBox="0 0 13 13" fill="#C6A75E">
                <path d="M6.5 1l1.5 3.04 3.35.487-2.425 2.363.572 3.335L6.5 8.637 3.505 10.226l.572-3.335L1.65 4.527 5 4.04z" />
              </svg>
            ))}
            <span className="text-[11px] text-white/40 font-light ml-1">Highly rated · Google</span>
          </div>

        </div>
      </div>

      {/* Scroll-down indicator */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 animate-bounce opacity-50 pointer-events-none">
        <span className="text-[9px] uppercase tracking-[0.18em] text-white font-medium">Scroll</span>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M4 7l5 5 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}
