'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PremiumBackground } from '@/components/layout/PremiumBackground';

const GOLD = '#D4AF37';

const FEATURED_SERVICES = [
  {
    title: 'Guided Temple Walks',
    description: 'Walk with care through the sacred lanes of Kashi. Our gentle guided experiences bring you closer to Vishwanath, the ghats, and the living devotion of Varanasi—without rush, with reverence.',
    highlights: ['Vishwanath & ghats', 'Small groups', 'Early morning option'],
    image: '/kashi_temple.jpg',
    cta: 'Learn More',
    href: '/contact',
  },
  {
    title: 'Ayurvedic Wellness Rituals',
    description: 'Rest and restore with time-honoured care. Simple, intentional rituals—massage, herbal care, and quiet—designed to leave you grounded and renewed.',
    highlights: ['In-room or dedicated space', 'Herbal & oil rituals', 'By appointment'],
    image: '/shivashray_images/Super Deluxe Room/WhatsApp Image 2025-09-19 at 16.20.15_9b75fed0.jpg',
    cta: 'Book Experience',
    href: '/contact',
  },
  {
    title: 'Private Dining Experience',
    description: 'Meals crafted with intention, served in the privacy of your room or a reserved space. Simple, nourishing, and attentive—so you can break bread in peace.',
    highlights: ['In-room or private space', 'Vegetarian focus', 'On request'],
    image: '/shivashray_images/Super Deluxe Room/63e98d7a-cc99-46c8-bf34-639f2e82cf22.jpg',
    cta: 'Enquire',
    href: '/contact',
  },
  {
    title: 'Sacred Morning Aarti Access',
    description: 'Begin the day in the presence of the Ganga. We help you reach the morning aarti with ease—so you can witness devotion at the water’s edge in peace.',
    highlights: ['Dawn timing', 'Walking distance', 'Respectful guidance'],
    image: '/Varanasi_aarti.avif',
    cta: 'Learn More',
    href: '/contact',
  },
  {
    title: 'Cultural Storytelling Evenings',
    description: 'Stories of Kashi, the Ganga, and the saints who walked these streets. Intimate, seated evenings of narrative and reflection—no performance, only presence.',
    highlights: ['Small groups', 'Seasonal themes', 'On request'],
    image: '/story_telling.jpg',
    cta: 'Enquire',
    href: '/contact',
  },
  {
    title: 'Airport & Pilgrimage Transfers',
    description: 'Seamless arrivals and thoughtful journeys to temples and sites. Comfortable vehicles and considerate drivers so you can focus on the pilgrimage, not the road.',
    highlights: ['VNS & nearby', 'Temple circuits', 'Flexible scheduling'],
    image: '/banaras_airport.avif',
    cta: 'Arrange Transfer',
    href: '/contact',
  },
];

const SUPPORTING_SERVICES = [
  { title: '24/7 Concierge', description: 'Assistance whenever you need it.', icon: 'concierge' },
  { title: 'In-Room Dining', description: 'Meals brought to your room with care.', icon: 'dining' },
  { title: 'Free Wi-Fi', description: 'Stay connected throughout your stay.', icon: 'wifi' },
  { title: 'Housekeeping', description: 'Daily care and fresh linens.', icon: 'housekeeping' },
  { title: 'Guided Tours', description: 'Temple and city walks by arrangement.', icon: 'tours' },
  { title: 'Laundry', description: 'Laundry and pressing on request.', icon: 'laundry' },
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

function ThinIcon({ name }: { name: string }) {
  const stroke = 'currentColor';
  const strokeWidth = 1.5;
  const className = 'w-6 h-6 text-slate-500 dark:text-slate-400 flex-shrink-0';
  switch (name) {
    case 'concierge':
      return (
        <svg className={className} fill="none" stroke={stroke} viewBox="0 0 24 24" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.5 21a1.5 1.5 0 01-3 0" />
        </svg>
      );
    case 'dining':
      return (
        <svg className={className} fill="none" stroke={stroke} viewBox="0 0 24 24" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12h18M3 18h18M12 3v15M8 6h8" />
        </svg>
      );
    case 'wifi':
      return (
        <svg className={className} fill="none" stroke={stroke} viewBox="0 0 24 24" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01" />
        </svg>
      );
    case 'housekeeping':
      return (
        <svg className={className} fill="none" stroke={stroke} viewBox="0 0 24 24" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
      );
    case 'tours':
      return (
        <svg className={className} fill="none" stroke={stroke} viewBox="0 0 24 24" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    case 'laundry':
      return (
        <svg className={className} fill="none" stroke={stroke} viewBox="0 0 24 24" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18M3 12h18M3 18h18M6 9v9M12 9v9M18 9v9" />
        </svg>
      );
    default:
      return (
        <svg className={className} fill="none" stroke={stroke} viewBox="0 0 24 24" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      );
  }
}

export default function ServicesPage() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState<Set<number>>(new Set());
  const refs = useRef<(HTMLDivElement | null)[]>([]);

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
        { threshold: 0.15, rootMargin: '-40px' }
      );
      ob.observe(ref);
      return ob;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, [FEATURED_SERVICES.length]);

  return (
    <PremiumBackground variant="rooms">
      {/* Soft vignette at edges */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          boxShadow: 'inset 0 0 120px rgba(0,0,0,0.04)',
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-[1] hidden dark:block"
        style={{
          boxShadow: 'inset 0 0 140px rgba(0,0,0,0.2)',
        }}
      />

      <div className="relative z-0">
        {/* A. Opening – Sacred Introduction */}
        <section className="pt-24 pb-12 md:pt-28 md:pb-16">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div
              className={`text-center transition-all duration-[600ms] ease-out ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-900 dark:text-slate-100 mb-6 tracking-tight"
                style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
              >
                Services & Experiences
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
                Care, comfort, and devotion—curated offerings to deepen your stay in Kashi. Nothing utilitarian; only what serves your peace and intention.
              </p>
            </div>
            <SacredDivider />
          </div>
        </section>

        {/* B. Featured Services – Hero blocks */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-20 md:pb-28">
          <div className="space-y-16 md:space-y-24">
            {FEATURED_SERVICES.map((service, index) => {
              const isEven = index % 2 === 0;
              const isVisible = visible.has(index);
              return (
                <div
                  key={service.title}
                  ref={(el) => { refs.current[index] = el; }}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-[20px] overflow-hidden bg-white/90 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/40 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.15)] transition-all duration-600 ease-out hover:shadow-[0_12px_48px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_48px_rgba(0,0,0,0.2)] ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <div className={`relative aspect-[4/3] lg:aspect-auto lg:min-h-[320px] overflow-hidden order-2 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-500 ease-out hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                  <div className={`p-8 md:p-10 lg:p-12 flex flex-col justify-center order-1 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <h2
                      className="text-xl md:text-2xl font-light text-slate-900 dark:text-slate-100 mb-4 tracking-tight"
                      style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
                    >
                      {service.title}
                    </h2>
                    <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 font-light leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <ul className="space-y-2 mb-8">
                      {service.highlights.map((h) => (
                        <li key={h} className="flex items-center gap-2 text-[15px] text-slate-500 dark:text-slate-400 font-light">
                          <span className="w-1 h-1 rounded-full bg-slate-400/60 dark:bg-slate-500/50" />
                          {h}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={service.href}
                      className="inline-flex items-center gap-2 text-[15px] font-medium transition-all duration-200 hover:opacity-90"
                      style={{ color: GOLD }}
                    >
                      {service.cta}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <SacredDivider />

        {/* C. Supporting Services – Minimal grid */}
        <section className="max-w-6xl mx-auto px-6 lg:px-8 py-16 md:py-24">
          <h2
            className="text-2xl md:text-3xl font-light text-slate-900 dark:text-slate-100 mb-12 md:mb-16 text-center tracking-tight"
            style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
          >
            Supporting Your Stay
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
            {SUPPORTING_SERVICES.map((item) => (
              <div
                key={item.title}
                className="flex gap-4 text-left border-b border-slate-200/40 dark:border-slate-700/30 pb-8"
              >
                <ThinIcon name={item.icon} />
                <div>
                  <h3 className="text-[17px] font-medium text-slate-800 dark:text-slate-200 mb-1 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-[15px] text-slate-500 dark:text-slate-400 font-light">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <SacredDivider />

        {/* D. Sacred Highlight */}
        <section className="max-w-6xl mx-auto px-6 lg:px-8 py-20 md:py-28">
          <div
            className="relative rounded-[20px] overflow-hidden bg-slate-800/90 dark:bg-slate-900/95 border border-slate-700/40 px-8 md:px-16 py-16 md:py-24 text-center"
            style={{
              boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
            }}
          >
            <div
              className="absolute inset-0 opacity-[0.08] dark:opacity-[0.06]"
              style={{
                backgroundImage: 'url(/kashi_temple.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="relative z-10">
              <h2
                className="text-2xl md:text-3xl lg:text-4xl font-light text-white mb-6 tracking-tight max-w-2xl mx-auto"
                style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif', color: GOLD }}
              >
                Your journey in Kashi begins with a single step—we are here to walk beside you.
              </h2>
              <Link
                href="/rooms"
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-medium text-[15px] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: GOLD, color: '#0F1115' }}
              >
                Book Your Stay
              </Link>
            </div>
          </div>
        </section>

        <SacredDivider />

        {/* E. Testimonial */}
        <section className="max-w-4xl mx-auto px-6 lg:px-8 pb-24 md:pb-32">
          <blockquote className="rounded-[20px] p-8 md:p-12 text-center bg-white/60 dark:bg-slate-800/60 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-slate-200/50 dark:border-slate-700/40">
            <p
              className="text-xl md:text-2xl font-light text-slate-700 dark:text-slate-300 leading-relaxed mb-6"
              style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
            >
              “The temple walk and the morning aarti arrangement made our pilgrimage feel personal—not touristy. Shivashray understood what we came for.”
            </p>
            <footer className="text-[14px] text-slate-500 dark:text-slate-400 font-light">
              — Guest, Shivashray
            </footer>
          </blockquote>
        </section>
      </div>
    </PremiumBackground>
  );
}
