'use client';

import { useEffect, useState } from 'react';
import { getBookingEngineUrl } from '@/lib/booking-engine';

export function ExclusiveDeals() {
  const [mounted, setMounted] = useState(false);
  const bookingEngineUrl = getBookingEngineUrl();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="exclusive-deals"
      className="relative py-20 md:py-28 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0E1A2B 0%, #121212 100%)',
      }}
    >
      {/* Cinematic lighting – subtle radial gradient */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(198, 167, 94, 0.12) 0%, transparent 60%)',
        }}
      />
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
        <div
          className={`transition-all duration-1000 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-[13px] font-medium text-[#C6A75E] uppercase tracking-[0.2em] mb-4">
            Kashi Awaits
          </p>
          <h2
            className="text-[36px] sm:text-[44px] md:text-[52px] font-normal text-[#F8F6F2] leading-[1.15] tracking-tight mb-6"
            style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
          >
            Steps from the Sacred Ghats
          </h2>
          <p className="text-[17px] md:text-[18px] text-white/70 font-normal leading-relaxed max-w-xl mx-auto mb-10">
            Ganga Ghat, Kashi Vishwanath & Kal Bhairav — all within a 2–5 minute walk. No vehicle needed, just pure presence.
          </p>
          <a
            href={bookingEngineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 min-h-[52px] bg-[#C6A75E] text-[#0E1A2B] text-base font-semibold rounded-[12px] transition-all duration-300 hover:bg-[#D4AF37] hover:shadow-[0_12px_40px_rgba(198,167,94,0.35)] active:scale-[0.98]"
          >
            Reserve Your Room
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2 11L11 2M11 2H5M11 2V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
