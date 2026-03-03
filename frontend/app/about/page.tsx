'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { hotelContent } from '@/lib/content/hotel-content';
import { getBookingEngineUrl } from '@/lib/booking-engine';

const GOLD = '#D4AF37';
const GOLD_LIGHT = '#C6A75E';

const STATS = [
  { value: '25', label: 'Rooms' },
  { value: '3',  label: 'Floors' },
  { value: '2025', label: 'Established' },
  { value: '4.4★', label: 'Guest Rating' },
];

const PRINCIPLES = [
  {
    num: '01',
    title: 'Devotion',
    description:
      'We hold space for what brought you here — pilgrimage, reflection, or the simple need to step out of the world. Our place is rooted in deep respect for Kashi and the intention of every guest.',
  },
  {
    num: '02',
    title: 'Hospitality',
    description:
      'Warmth without performance. We offer care, clarity, and comfort so you can rest and move at your own pace. No grand gestures — only genuine presence when it matters most.',
  },
  {
    num: '03',
    title: 'Serenity',
    description:
      'Quiet rooms, calm corridors, and a location that lets you breathe. We believe the best hospitality gets out of the way and lets the sacred city speak for itself.',
  },
];

const LANDMARKS = [
  {
    name: 'Kashi Vishwanath',
    time: '2 min',
    detail: 'One of the 12 Jyotirlingas',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m-7-9H4m16 0h-1M5.636 5.636l.707.707m11.314 11.314.707.707M5.636 18.364l.707-.707M17.657 6.343l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
      </svg>
    ),
  },
  {
    name: 'Ganga Ghats',
    time: '3 min',
    detail: 'Dashashwamedh & Manikarnika',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 21h20" />
      </svg>
    ),
  },
  {
    name: 'Kal Bhairav',
    time: '4 min',
    detail: 'Ancient guardian of Kashi',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
];

const AMENITIES = [
  { label: 'Lift / Elevator', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><rect x="5" y="2" width="14" height="20" rx="2" /><path strokeLinecap="round" d="M9 10l3-3 3 3M9 15l3 3 3-3" /></svg> },
  { label: '24-Hr Hot Water', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2M5.22 5.22l1.42 1.42m10.72 10.72 1.42 1.42M3 12h2m14 0h2M5.22 18.78l1.42-1.42M17.36 6.64l1.42-1.42" /><circle cx="12" cy="12" r="4" /></svg> },
  { label: 'Centralized AC', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18M5.636 5.636l12.728 12.728M18.364 5.636 5.636 18.364" /></svg> },
  { label: 'Free WiFi', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" /></svg> },
  { label: 'Smart Doors', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg> },
  { label: 'Power Backup', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg> },
  { label: '24/7 Reception', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg> },
  { label: 'CCTV Security', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg> },
  { label: 'Fire Safety', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.545 5.975 5.975 0 01-2.133-1A3.75 3.75 0 0012 18z" /></svg> },
  { label: 'Doctor on Call', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg> },
  { label: 'First Aid Kit', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { label: 'Veg Meals Only', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5M12 19.5V21M4.22 4.22l1.06 1.06M18.72 18.72l1.06 1.06M3 12H1.5M22.5 12H21M4.22 19.78l1.06-1.06M18.72 5.28l1.06-1.06" /><circle cx="12" cy="12" r="4" /></svg> },
];

function useScrollReveal() {
  const [visible, setVisible] = useState<Set<number>>(new Set());
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observers = refs.current.map((ref, index) => {
      if (!ref) return null;
      const ob = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setVisible((prev) => new Set(prev).add(index));
          });
        },
        { threshold: 0.1, rootMargin: '-30px' }
      );
      ob.observe(ref);
      return ob;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return { visible, refs };
}

function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-4 py-2" aria-hidden>
      <div className="h-px flex-1 max-w-[120px]" style={{ background: `linear-gradient(to right, transparent, ${GOLD_LIGHT}60)` }} />
      <svg className="w-3 h-3 shrink-0" viewBox="0 0 12 12" fill={GOLD_LIGHT}>
        <path d="M6 0 L12 6 L6 12 L0 6 Z" />
      </svg>
      <div className="h-px flex-1 max-w-[120px]" style={{ background: `linear-gradient(to left, transparent, ${GOLD_LIGHT}60)` }} />
    </div>
  );
}

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  const { visible, refs } = useScrollReveal();
  const bookingUrl = getBookingEngineUrl();

  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="bg-[#F8F6F2] text-slate-900">

      {/* ── A. Hero ── */}
      <section className="relative h-[70vh] min-h-[480px] flex items-end overflow-hidden">
        <Image
          src="/property_2.jpg"
          alt="Shiv Ashray — Varanasi"
          fill
          priority
          quality={90}
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.75) 80%, rgba(10,8,4,0.92) 100%)',
          }}
        />
        <div
          className={`relative z-10 w-full max-w-5xl mx-auto px-6 lg:px-8 pb-16 md:pb-20 transition-all duration-700 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <p
            className="text-xs font-semibold uppercase tracking-[0.3em] mb-4"
            style={{ color: GOLD }}
          >
            About Us
          </p>
          <h1
            className="font-serif font-light text-white text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight mb-4"
          >
            A Sanctuary Rooted<br className="hidden sm:block" /> in Devotion
          </h1>
          <p className="text-white/70 font-light text-base md:text-lg max-w-xl leading-relaxed">
            A place of rest and intention in the heart of Kashi — where hospitality meets stillness.
          </p>
        </div>
      </section>

      {/* ── B. Stats bar ── */}
      <div className="border-y border-amber-200/60" style={{ background: 'linear-gradient(135deg, #0E1A2B 0%, #1a2a3e 100%)' }}>
        <div className="max-w-4xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center py-3 px-4 gap-0.5">
              <span className="font-serif font-light text-3xl md:text-4xl" style={{ color: GOLD }}>
                {s.value}
              </span>
              <span className="text-[11px] uppercase tracking-widest text-white/50 font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── C. Our Story ── */}
      <section
        ref={(el) => { refs.current[0] = el; }}
        className="max-w-6xl mx-auto px-6 lg:px-8 py-20 md:py-28"
      >
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center transition-all duration-700 ease-out ${
            visible.has(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Image */}
          <div className="relative aspect-[4/3] lg:aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
            <Image
              src="/shivashray_images/Property Images/713583d6-b231-4eb5-82a8-4bbdcc4791fc.avif"
              alt="Shiv Ashray property — Kachourigali, Varanasi"
              fill
              className="object-cover hover:scale-[1.02] transition-transform duration-700 ease-out"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Gold corner accent */}
            <div className="absolute top-4 left-4 w-10 h-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-px" style={{ background: GOLD_LIGHT }} />
              <div className="absolute top-0 left-0 h-full w-px" style={{ background: GOLD_LIGHT }} />
            </div>
            <div className="absolute bottom-4 right-4 w-10 h-10 pointer-events-none">
              <div className="absolute bottom-0 right-0 w-full h-px" style={{ background: GOLD_LIGHT }} />
              <div className="absolute bottom-0 right-0 h-full w-px" style={{ background: GOLD_LIGHT }} />
            </div>
          </div>

          {/* Text */}
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: GOLD_LIGHT }}>
                Our Story
              </p>
              <h2 className="font-serif font-light text-3xl md:text-4xl text-slate-900 leading-tight tracking-tight">
                Born from the spirit<br /> of Kashi
              </h2>
            </div>
            <GoldDivider />
            <p className="text-slate-600 font-light leading-[1.85] text-base md:text-lg">
              {hotelContent.marketing.about.story}
            </p>
            <p className="text-slate-600 font-light leading-[1.85] text-base md:text-lg">
              {hotelContent.location.proximity}
            </p>
            <div className="pt-2">
              <Link
                href="/rooms"
                className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                style={{ color: GOLD_LIGHT }}
              >
                Explore our rooms
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── D. Philosophy ── */}
      <section
        ref={(el) => { refs.current[1] = el; }}
        className="py-20 md:py-28"
        style={{ background: 'linear-gradient(180deg, #F0EBE0 0%, #F8F6F2 100%)' }}
      >
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div
            className={`transition-all duration-700 ease-out ${
              visible.has(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="text-center mb-16 md:mb-20">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: GOLD_LIGHT }}>
                Our Philosophy
              </p>
              <h2 className="font-serif font-light text-3xl md:text-4xl text-slate-900 tracking-tight">
                What we hold dear
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PRINCIPLES.map((p, i) => (
                <div
                  key={p.title}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-amber-100/60 transition-all duration-500 ease-out hover:shadow-[0_12px_40px_rgba(0,0,0,0.09)] hover:-translate-y-0.5"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <span
                    className="font-serif font-light text-5xl leading-none block mb-5"
                    style={{ color: `${GOLD}40` }}
                  >
                    {p.num}
                  </span>
                  <h3
                    className="font-serif font-light text-xl text-slate-900 mb-3 tracking-tight"
                  >
                    {p.title}
                  </h3>
                  <p className="text-slate-600 font-light text-sm md:text-base leading-[1.8]">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── E. Location / Walkability ── */}
      <section
        ref={(el) => { refs.current[2] = el; }}
        className="max-w-5xl mx-auto px-6 lg:px-8 py-20 md:py-28"
      >
        <div
          className={`transition-all duration-700 ease-out ${
            visible.has(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: GOLD_LIGHT }}>
              Location
            </p>
            <h2 className="font-serif font-light text-3xl md:text-4xl text-slate-900 tracking-tight mb-4">
              Steps from the sacred
            </h2>
            <p className="text-slate-500 font-light text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              No vehicle needed. Kashi's holiest landmarks are a short walk from your door.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LANDMARKS.map((lm, i) => (
              <div
                key={lm.name}
                className="flex flex-col items-center text-center p-8 rounded-2xl border border-amber-100 bg-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300"
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
                  style={{ background: `${GOLD}15`, color: GOLD_LIGHT }}
                >
                  {lm.icon}
                </div>
                <div
                  className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
                  style={{ background: `${GOLD}18`, color: GOLD_LIGHT }}
                >
                  {lm.time} walk
                </div>
                <h3 className="font-serif font-light text-xl text-slate-900 mb-1.5">{lm.name}</h3>
                <p className="text-slate-500 text-[13px] font-light">{lm.detail}</p>
              </div>
            ))}
          </div>

          {/* Maps link */}
          <div className="text-center mt-10">
            <a
              href={hotelContent.location.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors border border-slate-200 hover:border-slate-400 px-5 py-2.5 rounded-full"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              View on Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* ── F. Vision banner ── */}
      <section
        ref={(el) => { refs.current[3] = el; }}
        className="relative min-h-[55vh] flex items-center justify-center py-24 md:py-32 overflow-hidden"
      >
        <Image
          src="/shivashray_images/Property Images/WhatsApp Image 2025-09-19 at 16.20.14_8319d8cc.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(10,8,4,0.80) 0%, rgba(10,8,4,0.88) 100%)' }}
        />
        <div
          className={`relative z-10 max-w-3xl mx-auto px-6 lg:px-8 text-center transition-all duration-700 ease-out ${
            visible.has(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <GoldDivider />
          <blockquote
            className="font-serif font-light text-2xl md:text-3xl lg:text-[2rem] leading-snug mt-8 mb-8"
            style={{ color: GOLD }}
          >
            We are here to hold space for your journey — whether you come for pilgrimage, silence, or simply to rest in the oldest living city.
          </blockquote>
          <p className="text-white/60 font-light text-base mb-10 max-w-xl mx-auto leading-relaxed">
            Every room, every corridor, and every moment of care is offered with that intention.
          </p>
          <GoldDivider />
          <div className="mt-10">
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-10 py-4 rounded-full text-[14.5px] font-semibold text-gray-900 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_32px_rgba(198,167,94,0.4)]"
              style={{ background: `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 50%, ${GOLD_LIGHT} 100%)` }}
            >
              Reserve Your Stay
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── G. Amenities ── */}
      <section
        ref={(el) => { refs.current[4] = el; }}
        className="max-w-5xl mx-auto px-6 lg:px-8 py-20 md:py-28"
      >
        <div
          className={`transition-all duration-700 ease-out ${
            visible.has(4) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: GOLD_LIGHT }}>
              Amenities
            </p>
            <h2 className="font-serif font-light text-3xl md:text-4xl text-slate-900 tracking-tight">
              Everything you need
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {AMENITIES.map((a) => (
              <div
                key={a.label}
                className="flex items-center gap-3 bg-white/70 border border-amber-100/70 rounded-xl px-4 py-3.5 hover:bg-white hover:border-amber-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-200"
              >
                <span style={{ color: GOLD_LIGHT }} className="shrink-0">{a.icon}</span>
                <span className="text-[13px] font-medium text-slate-700 leading-tight">{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── H. Meet your host ── */}
      <section
        ref={(el) => { refs.current[5] = el; }}
        className="py-20 md:py-24"
        style={{ background: 'linear-gradient(180deg, #F0EBE0 0%, #F8F6F2 100%)' }}
      >
        <div
          className={`max-w-2xl mx-auto px-6 text-center transition-all duration-700 ease-out ${
            visible.has(5) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-8" style={{ color: GOLD_LIGHT }}>
            Your Host
          </p>

          {/* Avatar */}
          <div
            className="w-24 h-24 rounded-full mx-auto mb-5 flex items-center justify-center font-serif font-light text-3xl text-white shadow-[0_8px_32px_rgba(198,167,94,0.3)]"
            style={{ background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})` }}
          >
            {hotelContent.contact.contactPerson.charAt(0)}
          </div>

          <h2 className="font-serif font-light text-2xl md:text-3xl text-slate-900 mb-1.5 tracking-tight">
            {hotelContent.contact.contactPerson}
          </h2>
          <p className="text-xs font-medium uppercase tracking-widest mb-6" style={{ color: GOLD_LIGHT }}>
            Host · Shiv Ashray, Varanasi
          </p>

          <GoldDivider />

          <p className="mt-8 text-slate-600 font-light text-base md:text-lg leading-[1.85] max-w-xl mx-auto">
            We welcome you with the same care we would offer a guest in our own home. Your comfort, your peace, and your intention matter to us — and we are here to support your stay in Kashi with warmth and simplicity.
          </p>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500">
            <a
              href={`tel:${hotelContent.contact.phone}`}
              className="inline-flex items-center gap-2 hover:text-slate-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              {hotelContent.contact.phone}
            </a>
            <span className="text-slate-300">·</span>
            <a
              href={`mailto:${hotelContent.contact.email}`}
              className="inline-flex items-center gap-2 hover:text-slate-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              {hotelContent.contact.email}
            </a>
          </div>
        </div>
      </section>

      {/* ── I. Closing line ── */}
      <section className="max-w-4xl mx-auto px-6 lg:px-8 py-16 md:py-20 text-center">
        <p className="font-serif font-light text-xl md:text-2xl text-slate-600 leading-relaxed mb-6 italic">
          May your stay be restful, meaningful, and remembered.
        </p>
        <div
          className="h-px w-32 mx-auto"
          style={{ background: `linear-gradient(to right, transparent, ${GOLD_LIGHT}60, transparent)` }}
        />
      </section>

    </div>
  );
}
