'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Place } from '@/types';
import { getPlaceBySlug } from '@/lib/data/places';
import { PremiumBackground } from '@/components/layout/PremiumBackground';

/* ── Category meta ─────────────────────────────────────────────────────── */
const CAT_META = {
  'sacred-temples':     { icon: '◈', label: 'Sacred Temple',  light: '#ea580c', dark: '#fb923c' },
  'nature-scenic':      { icon: '◉', label: 'Ghat & Scenic',  light: '#0369a1', dark: '#38bdf8' },
  'cultural-landmarks': { icon: '◆', label: 'Culture & Food', light: '#6d28d9', dark: '#a78bfa' },
  'short-excursions':   { icon: '◎', label: 'Day Excursion',  light: '#0f766e', dark: '#2dd4bf' },
} as const;

/* ── Section block ─────────────────────────────────────────────────────── */
function SectionBlock({
  label, col, delay, mounted, children,
}: {
  label: string; col: string; delay: string; mounted: boolean; children: ReactNode;
}) {
  return (
    <div
      className={`mt-10 md:mt-12 transition-all duration-700 ease-out ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: delay }}
    >
      <div className="flex items-center gap-3 mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap"
          style={{ color: `${col}95` }}>
          {label}
        </p>
        <div className="h-px flex-1"
          style={{ background: `linear-gradient(to right, ${col}35, transparent)` }}/>
      </div>
      <p className="text-base md:text-lg font-light text-slate-700 dark:text-slate-300 leading-relaxed">
        {children}
      </p>
    </div>
  );
}

/* ── Main page ─────────────────────────────────────────────────────────── */
export default function PlaceDetailPage() {
  const params  = useParams();
  const router  = useRouter();
  const [place,      setPlace]      = useState<Place | null>(null);
  const [mounted,    setMounted]    = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isDark,     setIsDark]     = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsDark(document.documentElement.classList.contains('dark'));
    check();
    const ob = new MutationObserver(check);
    ob.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const slug       = params.slug as string;
    const foundPlace = getPlaceBySlug(slug);
    if (!foundPlace) { router.push('/explore'); return; }
    setPlace(foundPlace);

    return () => ob.disconnect();
  }, [params.slug, router]);

  /* ── Loading state ── */
  if (!place) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f5ef] dark:bg-[#13121b]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-9 h-9 rounded-full border-2 border-amber-300/20 border-t-amber-400/60 animate-spin"/>
          <p className="text-sm text-slate-400 dark:text-slate-600 font-light tracking-wide">Loading…</p>
        </div>
      </div>
    );
  }

  const cat       = CAT_META[place.category as keyof typeof CAT_META] ?? CAT_META['sacred-temples'];
  const col       = isDark ? cat.dark : cat.light;
  const showImage = !!place.imageUrl && !imageError;

  return (
    <PremiumBackground variant="explore">

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section className="relative w-full h-[58vh] md:h-[64vh] lg:h-[70vh] overflow-hidden">

        {/* ── Image or atmospheric fallback ── */}
        {showImage ? (
          <>
            <Image
              src={place.imageUrl!}
              alt={place.name}
              fill
              className="object-cover scale-[1.04]"
              priority
              sizes="100vw"
              onError={() => setImageError(true)}
            />
            {/* Multi-stop overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10"/>
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"/>
          </>
        ) : (
          <div className="absolute inset-0 overflow-hidden">
            {/* Atmospheric gradient base */}
            <div className="absolute inset-0" style={{
              background: isDark
                ? `radial-gradient(ellipse 110% 90% at 50% 40%, ${col}28 0%, transparent 65%), linear-gradient(160deg, #1e1a2e, #0f0e18)`
                : `radial-gradient(ellipse 110% 90% at 50% 40%, ${col}18 0%, transparent 65%), linear-gradient(160deg, #ede8dc, #ddd8cc)`,
            }}/>
            {/* Large watermark icon */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[220px] md:text-[300px] leading-none select-none"
                style={{ color: col, opacity: isDark ? 0.07 : 0.055, fontFamily: 'system-ui' }}>
                {cat.icon}
              </span>
            </div>
            {/* Decorative concentric rings */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.045 }}>
              <circle cx="50%" cy="45%" r="230" fill="none" stroke={col} strokeWidth="1.5"/>
              <circle cx="50%" cy="45%" r="155" fill="none" stroke={col} strokeWidth="1"/>
              <circle cx="50%" cy="45%" r="85"  fill="none" stroke={col} strokeWidth="0.8"/>
              <line x1="0" y1="45%" x2="100%" y2="45%" stroke={col} strokeWidth="0.4"/>
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke={col} strokeWidth="0.4"/>
            </svg>
            {/* Bottom darkening for text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"/>
          </div>
        )}

        {/* ── Back button ── */}
        <div className={`absolute top-5 left-5 md:top-7 md:left-8 z-10
          transition-all duration-500 ease-out ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-medium
              text-white/85 hover:text-white backdrop-blur-md transition-all duration-200
              hover:-translate-x-0.5 active:translate-x-0"
            style={{ background: 'rgba(0,0,0,0.28)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M8.5 2L3.5 6.5l5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Explore
          </Link>
        </div>

        {/* ── Hero bottom content ── */}
        <div className={`absolute bottom-0 left-0 right-0 px-6 md:px-10 lg:px-14 pb-9 md:pb-11
          transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          {/* Category + distance chips */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide text-white"
              style={{ background: `${col}35`, border: `1px solid ${col}55`, backdropFilter: 'blur(8px)' }}
            >
              <span className="text-[10px]">{cat.icon}</span>
              {cat.label}
            </span>
            {place.distance && (
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium text-white/80"
                style={{ background: 'rgba(255,255,255,0.13)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }}
              >
                <svg width="9" height="11" viewBox="0 0 9 11" fill="none" className="flex-shrink-0">
                  <circle cx="4.5" cy="4" r="2" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M4.5 10.5S1 7 1 4a3.5 3.5 0 017 0c0 3-3.5 6.5-3.5 6.5z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                </svg>
                {place.distance} from hotel
              </span>
            )}
          </div>

          {/* Place name */}
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white leading-[1.04] tracking-[-0.025em] max-w-3xl"
            style={{ textShadow: '0 2px 24px rgba(0,0,0,0.45)' }}
          >
            {place.name}
          </h1>

          {/* Short description */}
          {place.description && (
            <p className="mt-3 text-sm md:text-base font-light text-white/60 max-w-2xl leading-relaxed line-clamp-2"
              style={{ textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>
              {place.description}
            </p>
          )}
        </div>
      </section>

      {/* ══ CONTENT ═══════════════════════════════════════════════════════ */}
      <section className="px-6 md:px-10 lg:px-14 py-12 md:py-16 lg:py-20">
        <div className="max-w-3xl mx-auto">

          {/* ── Decorative divider + intro ── */}
          <div
            className={`transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: '150ms' }}
          >
            {/* Ornamental divider */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px flex-1"
                style={{ background: `linear-gradient(to right, ${col}55, ${col}10)` }}/>
              <span className="text-base leading-none" style={{ color: col }}>{cat.icon}</span>
              <div className="h-px flex-1"
                style={{ background: `linear-gradient(to left, ${col}55, ${col}10)` }}/>
            </div>

            {/* Lead paragraph */}
            <p className="text-xl md:text-2xl font-light text-slate-800 dark:text-slate-200 leading-relaxed"
              style={{ letterSpacing: '-0.01em' }}>
              {place.content.introduction}
            </p>
          </div>

          {/* ── Cultural Context ── */}
          {place.content.culturalContext && (
            <SectionBlock label="Cultural Significance" col={col} delay="300ms" mounted={mounted}>
              {place.content.culturalContext}
            </SectionBlock>
          )}

          {/* ── Spiritual Context ── */}
          {place.content.spiritualContext && (
            <SectionBlock label="Spiritual Significance" col={col} delay="450ms" mounted={mounted}>
              {place.content.spiritualContext}
            </SectionBlock>
          )}

          {/* ── General Context ── */}
          {place.content.context && (
            <SectionBlock label="About this Place" col={col} delay="300ms" mounted={mounted}>
              {place.content.context}
            </SectionBlock>
          )}

          {/* ── How to Reach card ── */}
          {place.content.howToReach && (
            <div
              className={`mt-10 md:mt-12 transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: '600ms' }}
            >
              <div
                className="rounded-2xl p-6 md:p-7 border"
                style={{
                  background: isDark ? `${col}10` : `${col}07`,
                  borderColor: `${col}28`,
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${col}20` }}>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <circle cx="3.5" cy="3.5" r="2" stroke={col} strokeWidth="1.3"/>
                      <circle cx="11.5" cy="11.5" r="2" stroke={col} strokeWidth="1.3"/>
                      <path d="M3.5 5.5v2.5a3 3 0 003 3H9" stroke={col} strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: col }}>
                    How to Reach
                  </h3>
                </div>
                <p className="text-base md:text-lg font-light text-slate-700 dark:text-slate-300 leading-relaxed">
                  {place.content.howToReach}
                </p>
              </div>
            </div>
          )}

          {/* ── Travel Tip card ── */}
          {place.travelHint && (
            <div
              className={`mt-4 transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: '750ms' }}
            >
              <div
                className="rounded-2xl p-5 md:p-6 border"
                style={{
                  background: isDark ? 'rgba(120,53,15,0.14)' : 'rgba(254,243,199,0.6)',
                  borderColor: isDark ? 'rgba(217,119,6,0.2)' : 'rgba(252,211,77,0.5)',
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: isDark ? 'rgba(217,119,6,0.22)' : 'rgba(251,191,36,0.35)' }}>
                    <span className="text-[12px] leading-none text-amber-600 dark:text-amber-400">✦</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600/65 dark:text-amber-400/65 mb-1.5">
                      Travel Tip
                    </p>
                    <p className="text-sm md:text-base font-light text-amber-900/75 dark:text-amber-200/65 leading-relaxed">
                      {place.travelHint}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Footer nav ── */}
          <div
            className={`mt-14 md:mt-16 pt-7 border-t border-slate-200/50 dark:border-slate-800/50
              transition-all duration-700 ease-out ${mounted ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: '900ms' }}
          >
            <Link
              href="/explore"
              className="group inline-flex items-center gap-3 text-slate-400 dark:text-slate-600
                hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-200"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center border
                border-slate-200 dark:border-slate-800
                group-hover:border-slate-400 dark:group-hover:border-slate-600
                group-hover:-translate-x-0.5 transition-all duration-200">
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M7.5 1.5l-4 4 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm font-medium">Discover more places nearby</span>
            </Link>
          </div>

        </div>
      </section>

    </PremiumBackground>
  );
}
