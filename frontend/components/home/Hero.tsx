'use client';

import Image from 'next/image';
import { hotelContent } from '@/lib/content/hotel-content';
import { getBookingEngineUrl } from '@/lib/booking-engine';

const GOLD = '#D4AF37';
const SERIF = 'var(--font-playfair-display), Georgia, serif';

const TITLE_GRADIENT =
  'linear-gradient(118deg, #9A7B2F 0%, #C8A84B 14%, #F5E27A 34%, #FFFDE0 50%, #F5E27A 66%, #C8A84B 83%, #9A7B2F 100%)';

const LANDMARKS = [
  { name: 'Ganga Ghat', time: '2 min' },
  { name: 'Kal Bhairav', time: '3 min' },
  { name: 'Vishwanath Mandir', time: '5 min' },
];

// Staggered entrance animation helper
const fadeIn = (delay: string) => ({
  animationName: 'fadeInUp',
  animationDuration: '0.8s',
  animationDelay: delay,
  animationTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
  animationFillMode: 'both' as const,
});

export function Hero() {
  const bookingEngineUrl = getBookingEngineUrl();
  const nameParts = hotelContent.name.split(/\s+/);

  /* ── ornament ── */
  const ornament = (w: number) => (
    <div className="flex items-center gap-2" style={{ width: w }}>
      <span className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}66)` }} />
      <svg width="8" height="8" viewBox="0 0 9 9"><path d="M4.5 0L5.5 3.5L9 4.5L5.5 5.5L4.5 9L3.5 5.5L0 4.5L3.5 3.5Z" fill={GOLD} opacity="0.9" /></svg>
      <svg width="5" height="5" viewBox="0 0 9 9"><path d="M4.5 0L5.5 3.5L9 4.5L5.5 5.5L4.5 9L3.5 5.5L0 4.5L3.5 3.5Z" fill={GOLD} opacity="0.55" /></svg>
      <svg width="8" height="8" viewBox="0 0 9 9"><path d="M4.5 0L5.5 3.5L9 4.5L5.5 5.5L4.5 9L3.5 5.5L0 4.5L3.5 3.5Z" fill={GOLD} opacity="0.9" /></svg>
      <span className="h-px flex-1" style={{ background: `linear-gradient(270deg, transparent, ${GOLD}66)` }} />
    </div>
  );

  /* ── 5-star row ── */
  const stars = (
    <div className="flex items-center gap-1.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 13 13" fill={GOLD}>
          <path d="M6.5 1l1.5 3.04 3.35.487-2.425 2.363.572 3.335L6.5 8.637 3.505 10.226l.572-3.335L1.65 4.527 5 4.04z" />
        </svg>
      ))}
      <span className="text-[11px] text-white/50 font-light ml-1 tracking-wide">5.0 · Google Reviews</span>
    </div>
  );

  /* ── sacred ray config ── */
  const rays = [
    { left: '8%',  h: 180, dur: 4.2, delay: 0 },
    { left: '20%', h: 260, dur: 5.0, delay: 0.7 },
    { left: '34%', h: 200, dur: 4.6, delay: 1.4 },
    { left: '50%', h: 320, dur: 5.5, delay: 0.3 },
    { left: '65%', h: 220, dur: 4.8, delay: 1.1 },
    { left: '78%', h: 170, dur: 4.3, delay: 0.6 },
    { left: '90%', h: 240, dur: 5.2, delay: 1.8 },
  ];

  /* ── floating particle config ── */
  const particles = [
    { left: '12%',  top: '62%', s: 3, dur: 6.0, delay: 0.0 },
    { left: '27%',  top: '48%', s: 2, dur: 7.5, delay: 1.2 },
    { left: '42%',  top: '70%', s: 2, dur: 5.8, delay: 0.6 },
    { left: '58%',  top: '55%', s: 3, dur: 6.8, delay: 2.0 },
    { left: '71%',  top: '40%', s: 2, dur: 7.0, delay: 0.4 },
    { left: '83%',  top: '65%', s: 3, dur: 5.5, delay: 1.5 },
    { left: '6%',   top: '35%', s: 2, dur: 8.0, delay: 3.0 },
    { left: '92%',  top: '50%', s: 2, dur: 6.5, delay: 0.9 },
  ];

  return (
    <section className="relative min-h-[100svh] flex flex-col overflow-hidden -mt-[72px]">

      {/* ══ BACKGROUND STACK ══ */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/kashi_temple.jpg"
          alt="Kashi Vishwanath Temple, Varanasi"
          fill priority quality={100}
          className="object-cover"
          sizes="100vw"
        />

        {/* Primary dark gradient — lighter at top so image breathes, darker at bottom for text contrast */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(168deg, rgba(8,14,24,0.22) 0%, rgba(8,14,24,0.38) 30%, rgba(5,8,14,0.82) 65%, rgba(3,5,9,0.97) 100%)',
          }}
        />

        {/* Warm amber diya-glow — radiates from bottom-center like temple lamps */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 75% 48% at 38% 92%, rgba(210,135,18,0.24) 0%, rgba(185,95,12,0.12) 38%, transparent 62%)',
          }}
        />

        {/* Edge vignette for depth */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 110% 110% at 50% 50%, transparent 38%, rgba(0,0,0,0.50) 100%)',
          }}
        />
      </div>

      {/* ══ SACRED LIGHT RAYS ══ */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        {rays.map((r, i) => (
          <div
            key={i}
            className="absolute bottom-0"
            style={{
              left: r.left,
              width: i % 2 === 0 ? 1 : 2,
              height: r.h,
              background: `linear-gradient(0deg, ${GOLD}55 0%, ${GOLD}11 60%, transparent 100%)`,
              animationName: 'sacredRay',
              animationDuration: `${r.dur}s`,
              animationDelay: `${r.delay}s`,
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
              transformOrigin: 'bottom center',
            }}
          />
        ))}
      </div>

      {/* ══ FLOATING GOLD PARTICLES ══ */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: p.left,
              top: p.top,
              width: p.s,
              height: p.s,
              background: GOLD,
              boxShadow: `0 0 ${p.s * 3}px ${GOLD}99`,
              animationName: 'floatParticle',
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
            }}
          />
        ))}
      </div>

      {/* ════════════════════════════════════
          MOBILE — centered, welcoming
      ════════════════════════════════════ */}
      <div className="sm:hidden relative z-10 flex-1 flex flex-col items-center justify-center text-center px-7 pt-[88px] pb-28">

        {/* Glowing Om */}
        <span
          className="block text-[2.8rem] leading-none select-none mb-7"
          style={{
            color: `${GOLD}95`,
            fontFamily: 'serif',
            filter: `drop-shadow(0 0 20px ${GOLD}70) drop-shadow(0 0 40px ${GOLD}40)`,
            animationName: 'gentleGlow',
            animationDuration: '3s',
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
          }}
        >
          ॐ
        </span>

        {/* Hotel name */}
        <h1 aria-label={hotelContent.name} className="leading-none mb-5" style={fadeIn('0.15s')}>
          <span
            className="block font-light uppercase mb-2"
            style={{
              fontFamily: SERIF,
              fontSize: '0.9rem',
              color: 'rgba(255,255,255,0.58)',
              letterSpacing: '0.52em',
            }}
          >
            {nameParts[0]}
          </span>
          <span
            className="block italic font-light"
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(4.4rem, 21vw, 5.8rem)',
              lineHeight: 0.87,
              letterSpacing: '-0.03em',
              background: TITLE_GRADIENT,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 6px 36px rgba(212,175,55,0.50))',
            }}
          >
            {nameParts.slice(1).join(' ')}
          </span>
        </h1>

        {/* Ornament */}
        <div className="mb-5" style={fadeIn('0.30s')}>{ornament(150)}</div>

        {/* Tagline */}
        <p
          className="text-[15px] font-light leading-snug mb-6"
          style={{ color: 'rgba(255,255,255,0.68)', maxWidth: 255, fontFamily: SERIF, fontStyle: 'italic', ...fadeIn('0.45s') }}
        >
          Spiritual serenity in the heart of Varanasi
        </p>

        {/* Walkable landmark pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8" style={fadeIn('0.60s')}>
          {LANDMARKS.map((l) => (
            <span
              key={l.name}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10.5px] font-medium"
              style={{
                background: 'rgba(212,175,55,0.10)',
                border: `1px solid rgba(212,175,55,0.32)`,
                color: 'rgba(245,226,122,0.90)',
              }}
            >
              <span className="w-1 h-1 rounded-full inline-block" style={{ background: GOLD, boxShadow: `0 0 5px ${GOLD}` }} />
              {l.name} · {l.time}
            </span>
          ))}
        </div>

        {/* Primary CTA */}
        <a
          href={bookingEngineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-[300px] flex items-center justify-center gap-2 py-4 rounded-2xl text-[15px] font-semibold transition-all duration-300 active:scale-[0.97] mb-3"
          style={{
            background: `linear-gradient(135deg, #BF9B35 0%, ${GOLD} 45%, #EAD060 75%, #C8A84B 100%)`,
            color: '#0D1829',
            boxShadow: `0 8px 28px rgba(212,175,55,0.40), 0 2px 8px rgba(212,175,55,0.20)`,
            ...fadeIn('0.75s'),
          }}
        >
          Check Availability
          <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
            <path d="M4 10h12M11 5l5 5-5 5" stroke="#0D1829" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        {/* Stars */}
        <div className="flex justify-center" style={fadeIn('0.85s')}>{stars}</div>
      </div>

      {/* ════════════════════════════════════
          DESKTOP — bottom-anchored, editorial
      ════════════════════════════════════ */}
      <div className="hidden sm:flex relative z-10 flex-1 items-end">
        <div className="w-full max-w-7xl mx-auto px-10 lg:px-14 pb-14 lg:pb-18">
          <div className="max-w-2xl xl:max-w-[46rem]">

            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-7" style={fadeIn('0s')}>
              <span
                className="text-2xl leading-none select-none"
                style={{
                  color: `${GOLD}88`,
                  fontFamily: 'serif',
                  filter: `drop-shadow(0 0 12px ${GOLD}55)`,
                  animationName: 'gentleGlow',
                  animationDuration: '3.5s',
                  animationTimingFunction: 'ease-in-out',
                  animationIterationCount: 'infinite',
                }}
              >
                ॐ
              </span>
              <span className="h-px w-10" style={{ background: `linear-gradient(90deg, ${GOLD}60, transparent)` }} />
              <span
                className="text-[9px] font-medium tracking-[0.36em] uppercase"
                style={{ color: 'rgba(255,255,255,0.32)' }}
              >
                Est. 2025 &nbsp;·&nbsp; Varanasi, India
              </span>
            </div>

            {/* Hotel name */}
            <h1 aria-label={hotelContent.name} className="leading-none" style={fadeIn('0.12s')}>
              <span
                className="block font-light uppercase"
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(1rem, 2.4vw, 1.45rem)',
                  color: 'rgba(255,255,255,0.62)',
                  marginBottom: '0.08em',
                  letterSpacing: '0.50em',
                }}
              >
                {nameParts[0]}
              </span>
              <span
                className="block italic font-light"
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(4.8rem, 10vw, 8.5rem)',
                  lineHeight: 0.88,
                  letterSpacing: '-0.03em',
                  background: TITLE_GRADIENT,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 6px 44px rgba(212,175,55,0.42))',
                }}
              >
                {nameParts.slice(1).join(' ')}
              </span>
            </h1>

            {/* Ornament */}
            <div className="mt-6 mb-5" style={fadeIn('0.24s')}>{ornament(340)}</div>

            {/* Italic marketing headline */}
            <p
              className="text-xl md:text-[1.35rem] font-light leading-snug mb-2"
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                color: 'rgba(255,255,255,0.80)',
                ...fadeIn('0.34s'),
              }}
            >
              Experience Spiritual Serenity
            </p>

            {/* Supporting copy */}
            <p
              className="text-[14px] text-white/50 max-w-sm leading-relaxed font-light mb-6"
              style={fadeIn('0.44s')}
            >
              City center lodging — iconic sacred sites, famous street food &amp; the Ganga all within a short walk.
            </p>

            {/* Walkable landmark pills */}
            <div className="flex flex-wrap gap-2.5 mb-9" style={fadeIn('0.54s')}>
              {LANDMARKS.map((l) => (
                <span
                  key={l.name}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-[10.5px] font-medium tracking-wide uppercase"
                  style={{
                    background: 'rgba(212,175,55,0.08)',
                    border: `1px solid rgba(212,175,55,0.28)`,
                    color: 'rgba(245,226,122,0.85)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: GOLD, boxShadow: `0 0 6px ${GOLD}AA` }}
                  />
                  {l.name} · {l.time}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-4 mb-5" style={fadeIn('0.64s')}>
              {/* Primary */}
              <a
                href={bookingEngineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-[13.5px] font-semibold transition-all duration-300 hover:scale-[1.025] active:scale-[0.975]"
                style={{
                  background: `linear-gradient(135deg, #BF9B35 0%, ${GOLD} 45%, #EAD060 78%, #C8A84B 100%)`,
                  color: '#0D1829',
                  boxShadow: `0 8px 32px rgba(212,175,55,0.38), 0 2px 10px rgba(212,175,55,0.20)`,
                  transition: 'transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 48px rgba(212,175,55,0.52), 0 4px 16px rgba(212,175,55,0.25)`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px rgba(212,175,55,0.38), 0 2px 10px rgba(212,175,55,0.20)`;
                }}
              >
                Check Availability
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h12M11 5l5 5-5 5" stroke="#0D1829" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>

              {/* Secondary — map */}
              <a
                href={hotelContent.location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-[13px] font-medium transition-all duration-300"
                style={{
                  border: `1px solid rgba(255,255,255,0.16)`,
                  color: 'rgba(255,255,255,0.68)',
                  backdropFilter: 'blur(10px)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.28)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.16)';
                }}
              >
                <svg width="13" height="13" viewBox="0 0 20 26" fill="none">
                  <path d="M10 0C4.48 0 0 4.48 0 10c0 7.5 10 16 10 16s10-8.5 10-16C20 4.48 15.52 0 10 0zm0 13.5A3.5 3.5 0 1110 6.5a3.5 3.5 0 010 7z" fill="currentColor" opacity="0.85" />
                </svg>
                View on Map
              </a>
            </div>

            {/* Stars */}
            <div style={fadeIn('0.74s')}>{stars}</div>

          </div>
        </div>
      </div>

      {/* ══ SCROLL CUE ══ */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none">
        <div
          className="w-px"
          style={{
            height: 44,
            background: `linear-gradient(to bottom, transparent, rgba(255,255,255,0.35), transparent)`,
            animationName: 'sacredRay',
            animationDuration: '2.2s',
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
          }}
        />
        <span className="text-[7px] uppercase tracking-[0.28em] text-white/30">Scroll</span>
      </div>

    </section>
  );
}