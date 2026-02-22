'use client';

import Image from 'next/image';
import { hotelContent } from '@/lib/content/hotel-content';
import { getBookingEngineUrl } from '@/lib/booking-engine';

const GOLD = '#D4AF37';

const TITLE_GRADIENT =
  'linear-gradient(118deg, #9A7B2F 0%, #C8A84B 15%, #F5E27A 35%, #FFFDE0 50%, #F5E27A 65%, #C8A84B 82%, #9A7B2F 100%)';
const SERIF = 'var(--font-playfair-display), Georgia, serif';

export function Hero() {
  const bookingEngineUrl = getBookingEngineUrl();
  const nameParts = hotelContent.name.split(/\s+/);

  const stars = (
    <div className="flex items-center justify-center gap-1">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 13 13" fill={GOLD}>
          <path d="M6.5 1l1.5 3.04 3.35.487-2.425 2.363.572 3.335L6.5 8.637 3.505 10.226l.572-3.335L1.65 4.527 5 4.04z" />
        </svg>
      ))}
      <span className="text-[11px] text-white/40 font-light ml-1.5 tracking-wide">
        Highly rated · Google
      </span>
    </div>
  );

  const ornament = (size: number) => (
    <div className="flex items-center gap-2" style={{ width: size }}>
      <span className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}55)` }} />
      <svg width="7" height="7" viewBox="0 0 9 9" fill="none">
        <path d="M4.5 0L5.5 3.5L9 4.5L5.5 5.5L4.5 9L3.5 5.5L0 4.5L3.5 3.5Z" fill={GOLD} opacity="0.7" />
      </svg>
      <span className="h-px flex-1" style={{ background: `linear-gradient(270deg, transparent, ${GOLD}55)` }} />
    </div>
  );

  return (
    <section className="relative min-h-[100svh] flex flex-col overflow-hidden -mt-20 sm:-mt-24 lg:mt-0">

      {/* Background image + overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/kashi_temple.jpg"
          alt="Kashi Vishwanath Temple"
          fill priority quality={100}
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(14,26,43,0.52) 0%, rgba(14,26,43,0.72) 45%, rgba(8,8,12,0.92) 100%)',
          }}
        />
      </div>

      {/* ════ MOBILE layout — centered & welcoming ════ */}
      <div className="sm:hidden relative z-10 flex-1 flex flex-col items-center justify-center text-center px-8 pt-20 pb-28">

        {/* Om */}
        <span
          className="block text-[2rem] leading-none select-none mb-6"
          style={{ color: `${GOLD}85`, fontFamily: 'serif' }}
        >
          ॐ
        </span>

        {/* Name */}
        <h1 aria-label={hotelContent.name} className="leading-none mb-5">
          <span
            className="block font-light uppercase mb-1.5"
            style={{
              fontFamily: SERIF,
              fontSize: '1.05rem',
              color: 'rgba(255,255,255,0.68)',
              letterSpacing: '0.44em',
            }}
          >
            {nameParts[0]}
          </span>
          <span
            className="block italic font-light"
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(4rem, 19vw, 5.2rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.025em',
              background: TITLE_GRADIENT,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 2px 28px rgba(212,175,55,0.28))',
            }}
          >
            {nameParts.slice(1).join(' ')}
          </span>
        </h1>

        {/* Ornament */}
        <div className="mb-6">{ornament(120)}</div>

        {/* Welcoming tagline */}
        <p
          className="text-[16px] font-light leading-snug mb-8"
          style={{ color: 'rgba(255,255,255,0.72)', maxWidth: 240 }}
        >
          A peaceful hotel in the heart of Varanasi
        </p>

        {/* Full-width CTA */}
        <a
          href={bookingEngineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-[300px] flex items-center justify-center py-4 rounded-2xl text-[16px] font-semibold transition-all duration-300 active:scale-[0.97]"
          style={{ background: GOLD, color: '#0E1A2B' }}
        >
          Check Availability
        </a>

        {/* Trust */}
        <div className="mt-4">{stars}</div>
      </div>

      {/* ════ DESKTOP layout — editorial left-aligned ════ */}
      <div className="hidden sm:block relative z-10 w-full max-w-7xl mx-auto px-8 lg:px-10 pt-28 pb-24 lg:pt-14">
        <div className="max-w-3xl">

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xl leading-none select-none" style={{ color: `${GOLD}70`, fontFamily: 'serif' }}>ॐ</span>
            <span className="h-px w-8" style={{ background: `linear-gradient(90deg, ${GOLD}55, transparent)` }} />
            <span
              className="text-[9px] font-medium tracking-[0.32em] uppercase"
              style={{ color: 'rgba(255,255,255,0.30)' }}
            >
              Est. 2025 &nbsp;·&nbsp; Varanasi
            </span>
          </div>

          {/* Name */}
          <h1 aria-label={hotelContent.name} className="leading-none">
            <span
              className="block font-light uppercase"
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(1.1rem, 2.8vw, 1.6rem)',
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
                fontFamily: SERIF,
                fontSize: 'clamp(4rem, 9vw, 7.5rem)',
                lineHeight: 0.92,
                letterSpacing: '-0.025em',
                background: TITLE_GRADIENT,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 2px 32px rgba(212,175,55,0.30))',
              }}
            >
              {nameParts.slice(1).join(' ')}
            </span>
          </h1>

          {/* Ornament */}
          <div className="mt-5 mb-0">{ornament(280)}</div>

          {/* Subheadline */}
          <p className="mt-5 text-lg md:text-xl text-white/75 max-w-lg leading-relaxed font-light">
            City center — Ganga Ghat, Kal Bhairav & Vishwanath Mandir all within a 2–5 min walk. No vehicle needed.
          </p>

          {/* CTA */}
          <a
            href={bookingEngineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold transition-all duration-300 hover:opacity-90 hover:shadow-[0_12px_40px_rgba(198,167,94,0.35)] active:scale-[0.98]"
            style={{ background: GOLD, color: '#0E1A2B' }}
          >
            Check Availability
          </a>

          {/* Trust signal */}
          <div className="mt-4 flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="12" height="12" viewBox="0 0 13 13" fill={GOLD}>
                <path d="M6.5 1l1.5 3.04 3.35.487-2.425 2.363.572 3.335L6.5 8.637 3.505 10.226l.572-3.335L1.65 4.527 5 4.04z" />
              </svg>
            ))}
            <span className="text-[11px] text-white/40 font-light ml-1">Highly rated · Google</span>
          </div>

        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 animate-bounce opacity-40 pointer-events-none">
        <span className="text-[8px] uppercase tracking-[0.2em] text-white">Scroll</span>
        <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
          <path d="M4 7l5 5 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}
