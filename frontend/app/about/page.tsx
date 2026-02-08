'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { hotelContent } from '@/lib/content/hotel-content';
import { PremiumBackground } from '@/components/layout/PremiumBackground';

const GOLD = '#D4AF37';

const PRINCIPLES = [
  {
    title: 'Devotion',
    description: 'We hold space for what brought you here—pilgrimage, reflection, or the simple need to step out of the world. Our place is rooted in respect for Kashi and the intention of every guest.',
  },
  {
    title: 'Hospitality',
    description: 'Warmth without performance. We offer care, clarity, and comfort so you can rest and move at your own pace. No grand gestures—only presence when it matters.',
  },
  {
    title: 'Serenity',
    description: 'Quiet rooms, calm corridors, and a location that lets you breathe. We believe the best hospitality is the kind that gets out of the way and lets the sacred city speak.',
  },
];

function SacredDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-8 md:py-10" aria-hidden>
      <div className="h-px w-20 bg-gradient-to-r from-transparent via-slate-300/60 to-slate-300/60 dark:via-slate-500/40 dark:to-slate-500/40" />
      <div className="w-1.5 h-1.5 rounded-full bg-slate-400/50 dark:bg-slate-500/40" />
      <div className="h-px w-20 bg-gradient-to-l from-transparent via-slate-300/60 to-slate-300/60 dark:via-slate-500/40 dark:to-slate-500/40" />
    </div>
  );
}

function PrincipleMarker() {
  return (
    <div
      className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
      style={{ background: GOLD, opacity: 0.8 }}
      aria-hidden
    />
  );
}

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState<Set<number>>(new Set());
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const observers = refs.current.map((ref, index) => {
      if (!ref) return null;
      const ob = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setVisible((prev) => new Set(prev).add(index));
          });
        },
        { threshold: 0.12, rootMargin: '-40px' }
      );
      ob.observe(ref);
      return ob;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  const contactPerson = hotelContent.contact.contactPerson || 'Our host';

  return (
    <PremiumBackground variant="rooms">
      {/* Soft vignette */}
      <div className="fixed inset-0 pointer-events-none z-[1]" style={{ boxShadow: 'inset 0 0 120px rgba(0,0,0,0.04)' }} />
      <div className="fixed inset-0 pointer-events-none z-[1] hidden dark:block" style={{ boxShadow: 'inset 0 0 140px rgba(0,0,0,0.2)' }} />

      <div className="relative z-0">
        {/* A. Opening Sacred Statement */}
        <section className="pt-24 pb-16 md:pt-28 md:pb-20">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div
              className={`text-center transition-all duration-[600ms] ease-out ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-900 dark:text-slate-100 mb-6 tracking-tight leading-[1.1]"
                style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
              >
                A Sanctuary Rooted in Devotion
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
                A place of rest and intention in the heart of Kashi—where hospitality meets stillness.
              </p>
            </div>
            <SacredDivider />
          </div>
        </section>

        {/* B. Origin Story */}
        <section
          ref={(el) => { refs.current[0] = el; }}
          className="max-w-6xl mx-auto px-6 lg:px-8 py-16 md:py-24"
        >
          <div
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center transition-all duration-[600ms] ease-out ${
              visible.has(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="relative aspect-[4/3] lg:aspect-[3/4] rounded-[20px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.2)]">
              <Image
                src="/shivashray_images/Property Images/713583d6-b231-4eb5-82a8-4bbdcc4791fc.avif"
                alt="Shivashray — your sanctuary in Kashi"
                fill
                className="object-cover transition-transform duration-500 ease-out hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="space-y-6">
              <h2
                className="text-2xl md:text-3xl font-light text-slate-900 dark:text-slate-100 tracking-tight"
                style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
              >
                Our story
              </h2>
              <p
                className="text-base md:text-lg text-slate-600 dark:text-slate-300 font-light leading-[1.8]"
              >
                {hotelContent.marketing.about.story}
              </p>
              <p
                className="text-base md:text-lg text-slate-600 dark:text-slate-300 font-light leading-[1.8]"
              >
                {hotelContent.location.proximity}
              </p>
            </div>
          </div>
        </section>

        <SacredDivider />

        {/* C. Philosophy */}
        <section
          ref={(el) => { refs.current[1] = el; }}
          className="max-w-4xl mx-auto px-6 lg:px-8 py-20 md:py-28"
        >
          <div
            className={`transition-all duration-[600ms] ease-out ${
              visible.has(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2
              className="text-2xl md:text-3xl font-light text-slate-900 dark:text-slate-100 text-center mb-16 md:mb-20 tracking-tight"
              style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
            >
              What we hold dear
            </h2>
            <div className="space-y-0">
              {PRINCIPLES.map((principle, index) => (
                <div
                  key={principle.title}
                  className={`py-10 md:py-14 transition-all duration-[500ms] ease-out ${
                    visible.has(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <div className="flex gap-4 md:gap-6">
                    <PrincipleMarker />
                    <div>
                      <h3
                        className="text-xl md:text-2xl font-light text-slate-900 dark:text-slate-100 mb-3 tracking-tight"
                        style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
                      >
                        {principle.title}
                      </h3>
                      <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 font-light leading-[1.8] max-w-2xl">
                        {principle.description}
                      </p>
                    </div>
                  </div>
                  {index < PRINCIPLES.length - 1 && (
                    <div className="mt-10 md:mt-14 h-px bg-gradient-to-r from-transparent via-slate-200/60 to-transparent dark:via-slate-600/40" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <SacredDivider />

        {/* D. Experience Vision */}
        <section
          ref={(el) => { refs.current[2] = el; }}
          className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center py-24 md:py-32"
        >
          <div className="absolute inset-0">
            <Image
              src="/shivashray_images/Property Images/WhatsApp Image 2025-09-19 at 16.20.14_8319d8cc.jpg"
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              priority={false}
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, rgba(15,17,21,0.75) 0%, rgba(15,17,21,0.85) 100%)',
              }}
            />
          </div>
          <div
            className={`relative z-10 max-w-3xl mx-auto px-6 lg:px-8 text-center transition-all duration-[600ms] ease-out ${
              visible.has(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2
              className="text-2xl md:text-3xl lg:text-4xl font-light text-white mb-6 tracking-tight leading-snug"
              style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif', color: GOLD }}
            >
              We are here to hold space for your journey—whether you come for pilgrimage, silence, or simply to rest in the oldest living city.
            </h2>
            <p className="text-base md:text-lg text-white/80 font-light leading-relaxed mb-10 max-w-2xl mx-auto">
              Every room, every corridor, and every moment of care is offered with that intention.
            </p>
            <Link
              href="/rooms"
              className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-medium text-[15px] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: GOLD, color: '#0F1115' }}
            >
              Explore Rooms
            </Link>
          </div>
        </section>

        <SacredDivider />

        {/* E. Human Touch */}
        <section
          ref={(el) => { refs.current[3] = el; }}
          className="max-w-3xl mx-auto px-6 lg:px-8 py-20 md:py-28"
        >
          <div
            className={`text-center transition-all duration-[600ms] ease-out ${
              visible.has(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div
              className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-light text-slate-700 dark:text-slate-300 ring-2 ring-slate-200/60 dark:ring-slate-600/40 shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.2)] bg-white/80 dark:bg-slate-800/80"
              style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
            >
              {contactPerson.charAt(0)}
            </div>
            <h2
              className="text-xl md:text-2xl font-light text-slate-900 dark:text-slate-100 mb-3 tracking-tight"
              style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
            >
              {contactPerson}
            </h2>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 font-light leading-[1.8] max-w-xl mx-auto">
              We welcome you with the same care we would offer a guest in our own home. Your comfort, your peace, and your intention matter to us—and we are here to support your stay in Kashi with warmth and simplicity.
            </p>
          </div>
        </section>

        <SacredDivider />

        {/* F. Closing Sacred Line */}
        <section className="max-w-4xl mx-auto px-6 lg:px-8 pb-24 md:pb-32">
          <div className="text-center">
            <p
              className="text-xl md:text-2xl font-light text-slate-700 dark:text-slate-300 leading-relaxed mb-8"
              style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
            >
              May your stay be restful, meaningful, and remembered.
            </p>
            <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-slate-300/60 to-transparent dark:via-slate-500/40" />
          </div>
        </section>
      </div>
    </PremiumBackground>
  );
}
