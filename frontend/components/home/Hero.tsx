'use client';

import Link from 'next/link';
import Image from 'next/image';
import { hotelContent } from '@/lib/content/hotel-content';

const GOLD = '#D4AF37';
const GOLD_BRIGHT = '#E8C547'; /* brighter gold for gradient visibility */
const GOLD_MUTED = 'rgba(212, 175, 55, 0.4)';

export function Hero() {
  const tagline = hotelContent.tagline ?? '';
  const nameParts = hotelContent.name.split(/\s+/);
  const hasTwoParts = nameParts.length > 1;

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden">
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
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
        <div className="max-w-3xl">
          {/* Editorial hero heading – two-line serif + sacred divider + tagline */}
          <div className="mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both [animation-delay:120ms]">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[4.25rem] font-light leading-[1.08] tracking-[-0.02em] text-white"
              style={{
                fontFamily: 'var(--font-playfair-display), Georgia, serif',
                filter: 'drop-shadow(0 2px 20px rgba(0,0,0,0.5)) drop-shadow(0 0 2px rgba(0,0,0,0.4))',
              }}
              aria-label={hotelContent.name}
            >
              {hasTwoParts ? (
                <>
                  <span
                    style={{
                      background: `linear-gradient(135deg, #ffffff 0%, #f5f0e0 35%, ${GOLD_BRIGHT} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {nameParts[0]}
                  </span>
                  <span
                    style={{
                      background: `linear-gradient(135deg, #ffffff 0%, #f5f0e0 35%, ${GOLD_BRIGHT} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {nameParts.slice(1).join('')}
                  </span>
                </>
              ) : (
                hotelContent.name
              )}
            </h1>
            {/* Sacred divider: thin gold lines + center dot */}
            <div className="flex items-center gap-3 mt-4 md:mt-5 max-w-[200px]">
              <span className="h-px flex-1 rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${GOLD_MUTED})` }} />
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: GOLD }} />
              <span className="h-px flex-1 rounded-full" style={{ background: `linear-gradient(270deg, transparent, ${GOLD_MUTED})` }} />
            </div>
            {tagline && (
              <p className="mt-3 md:mt-4 text-sm sm:text-base tracking-[0.2em] uppercase text-white/80 font-medium max-w-md">
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
          <Link
            href="/rooms"
            className="inline-flex items-center justify-center px-8 py-4 min-h-[52px] bg-[#C6A75E] text-[#0E1A2B] text-base font-semibold rounded-[12px] transition-all duration-300 hover:bg-[#D4AF37] hover:shadow-[0_12px_40px_rgba(198,167,94,0.35)] active:scale-[0.98]"
          >
            Book Your Stay
          </Link>
        </div>

        {/* Glassmorphic search module – elegant, spacious */}
        <div
          className="mt-12 md:mt-16 max-w-4xl rounded-[14px] p-5 sm:p-6 md:p-7 border border-white/15"
          style={{
            background: 'rgba(248, 246, 242, 0.12)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25)',
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            <div>
              <label className="block text-[13px] font-medium text-white/80 mb-2 uppercase tracking-wider">
                Check-in
              </label>
              <input
                type="date"
                className="w-full h-12 px-4 rounded-[10px] bg-white/10 border border-white/20 text-white placeholder-white/50 text-[15px] focus:outline-none focus:border-[#C6A75E]/60 focus:ring-1 focus:ring-[#C6A75E]/40 transition-colors"
                placeholder="Select date"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-white/80 mb-2 uppercase tracking-wider">
                Check-out
              </label>
              <input
                type="date"
                className="w-full h-12 px-4 rounded-[10px] bg-white/10 border border-white/20 text-white placeholder-white/50 text-[15px] focus:outline-none focus:border-[#C6A75E]/60 focus:ring-1 focus:ring-[#C6A75E]/40 transition-colors"
                placeholder="Select date"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-white/80 mb-2 uppercase tracking-wider">
                Guests
              </label>
              <select
                className="w-full h-12 px-4 rounded-[10px] bg-white/10 border border-white/20 text-white text-[15px] focus:outline-none focus:border-[#C6A75E]/60 focus:ring-1 focus:ring-[#C6A75E]/40 transition-colors [&>option]:bg-[#0E1A2B]"
                defaultValue=""
              >
                <option value="">Guests</option>
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4+ Guests</option>
              </select>
            </div>
            <div className="flex items-end">
              <Link
                href="/rooms"
                className="w-full h-12 flex items-center justify-center rounded-[10px] bg-[#C6A75E] text-[#0E1A2B] text-[15px] font-semibold transition-all duration-300 hover:bg-[#D4AF37] hover:shadow-[0_8px_24px_rgba(198,167,94,0.3)]"
              >
                Search
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
