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
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-8 pb-16 md:pb-24">
        <div className="max-w-3xl">
          {/* ── Aesthetic Hero Title ─────────────────────────────────── */}
          <div className="mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both [animation-delay:120ms]">

            {/* Sacred eyebrow: Om + provenance */}
            <div className="flex items-center gap-3 mb-5">
              <span
                className="text-xl leading-none select-none"
                style={{ color: `${GOLD}70`, fontFamily: 'serif' }}
              >
                ॐ
              </span>
              <span
                className="h-px w-8"
                style={{ background: `linear-gradient(90deg, ${GOLD}55, transparent)` }}
              />
              <span
                className="text-[9px] font-medium tracking-[0.32em] uppercase"
                style={{ color: 'rgba(255,255,255,0.32)' }}
              >
                Est. 2025 &nbsp;·&nbsp; Varanasi
              </span>
            </div>

            {/* Title */}
            <h1 aria-label={hotelContent.name} className="leading-none">

              {/* "SHIV" — visible qualifier, spaced uppercase */}
              <span
                className="block font-light uppercase"
                style={{
                  fontFamily: 'var(--font-playfair-display), Georgia, serif',
                  fontSize: 'clamp(1.1rem, 3vw, 1.6rem)',
                  color: 'rgba(255,255,255,0.80)',
                  marginBottom: '0.2em',
                  letterSpacing: '0.45em',
                }}
              >
                {nameParts[0]}
              </span>

              {/* "Ashray" — commanding italic gold-leaf shimmer */}
              <span
                className="block italic font-light"
                style={{
                  fontFamily: 'var(--font-playfair-display), Georgia, serif',
                  fontSize: 'clamp(4rem, 13vw, 7.5rem)',
                  lineHeight: 0.92,
                  letterSpacing: '-0.025em',
                  background:
                    'linear-gradient(118deg, #9A7B2F 0%, #C8A84B 15%, #F5E27A 35%, #FFFDE0 50%, #F5E27A 65%, #C8A84B 82%, #9A7B2F 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 2px 32px rgba(212,175,55,0.30))',
                }}
              >
                {nameParts.slice(1).join(' ')}
              </span>
            </h1>

            {/* Ornamental rule — wider, 4-point star center */}
            <div className="flex items-center gap-2.5 mt-5 max-w-[280px]">
              <span
                className="h-px flex-1"
                style={{ background: `linear-gradient(90deg, transparent, ${GOLD}55)` }}
              />
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path
                  d="M4.5 0L5.5 3.5L9 4.5L5.5 5.5L4.5 9L3.5 5.5L0 4.5L3.5 3.5Z"
                  fill={GOLD}
                  opacity="0.7"
                />
              </svg>
              <span
                className="h-px flex-1"
                style={{ background: `linear-gradient(270deg, transparent, ${GOLD}55)` }}
              />
            </div>

            {/* Tagline — whisper quiet, maximum elegance */}
            {tagline && (
              <p
                className="mt-3 text-[10px] sm:text-[11px] tracking-[0.28em] uppercase font-medium"
                style={{ color: 'rgba(255,255,255,0.36)' }}
              >
                {tagline}
              </p>
            )}
          </div>
          {/* Subheadline – trust-building */}
          <p className="text-lg sm:text-xl text-white/90 mb-10 md:mb-12 max-w-xl leading-relaxed font-normal">
            City center — Ganga Ghat, Kal Bhairav & Vishwanath Mandir walkable in 2–5 min. No vehicle needed. Lift,
            24hr hot water, AC & smart doors.
          </p>
          {/* Primary CTA – gold accent */}
          <a
            href={bookingEngineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 min-h-[52px] bg-[#C6A75E] text-[#0E1A2B] text-base font-semibold rounded-[12px] transition-all duration-300 hover:bg-[#D4AF37] hover:shadow-[0_12px_40px_rgba(198,167,94,0.35)] active:scale-[0.98]"
          >
            Check Availability
          </a>
        </div>

        {/* Trust signal – social proof directly under CTA */}
        <div className="mt-6 flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="13" height="13" viewBox="0 0 13 13" fill="#C6A75E">
                <path d="M6.5 1l1.5 3.04 3.35.487-2.425 2.363.572 3.335L6.5 8.637 3.505 10.226l.572-3.335L1.65 4.527 5 4.04z" />
              </svg>
            ))}
          </div>
          <span className="text-[12px] text-white/45 font-light tracking-wide">Highly rated · Google Reviews</span>
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
