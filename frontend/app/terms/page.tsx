'use client';

import { useEffect, useState } from 'react';
import { hotelContent } from '@/lib/content/hotel-content';
import Link from 'next/link';
import { PremiumBackground } from '@/components/layout/PremiumBackground';

const GOLD = '#D4AF37';
const EFFECTIVE_DATE = '2025';

const SECTIONS = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'check-in-out', label: 'Check-in & Check-out' },
  { id: 'cancellation', label: 'Cancellation' },
  { id: 'children', label: 'Children & Guests' },
  { id: 'house-rules', label: 'House Rules' },
  { id: 'identification', label: 'Identification' },
  { id: 'meal-plan', label: 'Meal Plan' },
  { id: 'property', label: 'Property Information' },
  { id: 'contact', label: 'Contact' },
  { id: 'disclaimer', label: 'Disclaimer' },
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

export default function TermsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const observers = SECTIONS.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const ob = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setActiveId(id);
          });
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      );
      ob.observe(el);
      return ob;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <PremiumBackground variant="rooms">
      <div className="fixed inset-0 pointer-events-none z-[1]" style={{ boxShadow: 'inset 0 0 120px rgba(0,0,0,0.04)' }} />
      <div className="fixed inset-0 pointer-events-none z-[1] hidden dark:block" style={{ boxShadow: 'inset 0 0 140px rgba(0,0,0,0.2)' }} />

      <div className="relative z-0 min-h-screen">
        {/* Header */}
        <header className="pt-24 pb-12 md:pt-28 md:pb-16">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div
              className={`text-center transition-all duration-[600ms] ease-out ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <h1
                className="text-4xl md:text-5xl font-light text-slate-900 dark:text-slate-100 tracking-tight"
                style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
              >
                Terms & Conditions
              </h1>
              <p className="mt-3 text-[15px] text-slate-500 dark:text-slate-400 font-light">
                Effective date: {EFFECTIVE_DATE}
              </p>
            </div>
            <SacredDivider />
          </div>
        </header>

        {/* Main: two-column on desktop, single on mobile */}
        <div className="max-w-6xl mx-auto px-6 lg:px-8 pb-24 md:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Sticky section nav (desktop) */}
            <aside className="lg:col-span-4 xl:col-span-3 order-1 lg:order-1">
              <nav
                className="lg:sticky lg:top-24 space-y-1 flex lg:block overflow-x-auto lg:overflow-visible gap-2 lg:gap-0 pb-4 lg:pb-0 scrollbar-hide"
                aria-label="Terms sections"
              >
                {SECTIONS.map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => scrollTo(id)}
                    className={`flex-shrink-0 lg:flex-shrink py-2.5 px-3 rounded-[10px] text-[15px] font-medium transition-all duration-200 border-l-2 lg:block lg:w-full lg:text-left ${
                      activeId === id
                        ? 'text-slate-900 dark:text-slate-100 border-[#D4AF37] bg-slate-100/50 dark:bg-slate-800/40'
                        : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/40 dark:hover:bg-slate-800/30'
                    }`}
                    style={activeId === id ? { borderLeftColor: GOLD } : undefined}
                  >
                    {label}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Content */}
            <main className="lg:col-span-8 xl:col-span-9 order-2 lg:order-2">
              <div
                className={`transition-all duration-[600ms] ease-out ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: '80ms' }}
              >
                <section id="introduction" className="scroll-mt-28 mb-12 md:mb-16">
                  <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 leading-[1.85]">
                    Please read these terms and conditions carefully before making a reservation at {hotelContent.name}. By booking a stay, you agree to these terms.
                  </p>
                </section>

                <div className="h-px bg-slate-200/50 dark:bg-slate-700/40 mb-12 md:mb-16" />

                <section id="check-in-out" className="scroll-mt-28 mb-12 md:mb-16">
                  <h2 className="text-2xl md:text-3xl font-medium text-slate-900 dark:text-slate-100 mb-6 tracking-tight">
                    Check-in & Check-out
                  </h2>
                  <div className="space-y-5 text-base md:text-lg text-slate-700 dark:text-slate-300 leading-[1.85]">
                    <p>
                      <strong className="text-slate-900 dark:text-slate-100 font-medium">Check-in:</strong> {hotelContent.policies.checkIn.time}
                    </p>
                    <p>
                      <strong className="text-slate-900 dark:text-slate-100 font-medium">Check-out:</strong> {hotelContent.policies.checkOut.time}
                    </p>
                    <p>
                      {hotelContent.policies.checkIn.description}. Checkout must be done on or before checkout time.
                    </p>
                  </div>
                </section>

                <div className="h-px bg-slate-200/50 dark:bg-slate-700/40 mb-12 md:mb-16" />

                <section id="cancellation" className="scroll-mt-28 mb-12 md:mb-16">
                  <h2 className="text-2xl md:text-3xl font-medium text-slate-900 dark:text-slate-100 mb-6 tracking-tight">
                    Cancellation
                  </h2>
                  <div className="space-y-5 text-base md:text-lg text-slate-700 dark:text-slate-300 leading-[1.85]">
                    <p>
                      <strong className="text-slate-900 dark:text-slate-100 font-medium">Policy:</strong> {hotelContent.policies.cancellation.policy}
                    </p>
                    <p>{hotelContent.policies.cancellation.description}</p>
                    <p className="text-slate-600 dark:text-slate-400">
                      Cancellations made less than 3 days before check-in may be subject to charges as per your booking terms.
                    </p>
                  </div>
                </section>

                <div className="h-px bg-slate-200/50 dark:bg-slate-700/40 mb-12 md:mb-16" />

                <section id="children" className="scroll-mt-28 mb-12 md:mb-16">
                  <h2 className="text-2xl md:text-3xl font-medium text-slate-900 dark:text-slate-100 mb-6 tracking-tight">
                    Children & Guests
                  </h2>
                  <div className="space-y-5 text-base md:text-lg text-slate-700 dark:text-slate-300 leading-[1.85]">
                    <p className="font-medium text-slate-900 dark:text-slate-100">{hotelContent.policies.childPolicy.description}</p>
                    <ul className="space-y-2 pl-5 list-disc list-outside marker:text-slate-400 dark:marker:text-slate-500">
                      {hotelContent.policies.childPolicy.details.map((detail, i) => (
                        <li key={i}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                </section>

                <div className="h-px bg-slate-200/50 dark:bg-slate-700/40 mb-12 md:mb-16" />

                <section id="house-rules" className="scroll-mt-28 mb-12 md:mb-16">
                  <h2 className="text-2xl md:text-3xl font-medium text-slate-900 dark:text-slate-100 mb-6 tracking-tight">
                    House Rules
                  </h2>
                  <ul className="space-y-4 text-base md:text-lg text-slate-700 dark:text-slate-300 leading-[1.85] pl-5 list-disc list-outside marker:text-slate-400 dark:marker:text-slate-500">
                    {hotelContent.policies.termsAndConditions.map((term, i) => (
                      <li key={i}>{term}</li>
                    ))}
                  </ul>
                </section>

                <div className="h-px bg-slate-200/50 dark:bg-slate-700/40 mb-12 md:mb-16" />

                <section id="identification" className="scroll-mt-28 mb-12 md:mb-16">
                  <h2 className="text-2xl md:text-3xl font-medium text-slate-900 dark:text-slate-100 mb-6 tracking-tight">
                    Identification
                  </h2>
                  <div className="space-y-5 text-base md:text-lg text-slate-700 dark:text-slate-300 leading-[1.85]">
                    <p>Valid ID proof is required at check-in for every guest. Acceptable forms include government-issued photo ID (Aadhaar, Passport, Driving License, Voter ID) or a valid international passport for foreign guests.</p>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">Local ID is not accepted for check-in.</p>
                  </div>
                </section>

                <div className="h-px bg-slate-200/50 dark:bg-slate-700/40 mb-12 md:mb-16" />

                <section id="meal-plan" className="scroll-mt-28 mb-12 md:mb-16">
                  <h2 className="text-2xl md:text-3xl font-medium text-slate-900 dark:text-slate-100 mb-6 tracking-tight">
                    Meal Plan
                  </h2>
                  <div className="space-y-5 text-base md:text-lg text-slate-700 dark:text-slate-300 leading-[1.85]">
                    <p>
                      <strong className="text-slate-900 dark:text-slate-100 font-medium">Plan:</strong> {hotelContent.property.mealPlan} (room only, no meals included in the rate).
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      Meals are not included. Guests may use nearby dining or room service as per availability.
                    </p>
                  </div>
                </section>

                <div className="h-px bg-slate-200/50 dark:bg-slate-700/40 mb-12 md:mb-16" />

                <section id="property" className="scroll-mt-28 mb-12 md:mb-16">
                  <h2 className="text-2xl md:text-3xl font-medium text-slate-900 dark:text-slate-100 mb-6 tracking-tight">
                    Property Information
                  </h2>
                  <ul className="space-y-2 text-base md:text-lg text-slate-700 dark:text-slate-300 leading-[1.85]">
                    <li><strong className="text-slate-900 dark:text-slate-100 font-medium">Rooms:</strong> {hotelContent.property.totalRooms}</li>
                    <li><strong className="text-slate-900 dark:text-slate-100 font-medium">Floors:</strong> {hotelContent.property.totalFloors}</li>
                    <li><strong className="text-slate-900 dark:text-slate-100 font-medium">Built:</strong> {hotelContent.property.builtYear}</li>
                    <li><strong className="text-slate-900 dark:text-slate-100 font-medium">GSTIN:</strong> {hotelContent.property.gstin}</li>
                  </ul>
                </section>

                <div className="h-px bg-slate-200/50 dark:bg-slate-700/40 mb-12 md:mb-16" />

                <section id="contact" className="scroll-mt-28 mb-12 md:mb-16">
                  <h2 className="text-2xl md:text-3xl font-medium text-slate-900 dark:text-slate-100 mb-6 tracking-tight">
                    Contact
                  </h2>
                  <div className="space-y-3 text-base md:text-lg text-slate-700 dark:text-slate-300 leading-[1.85]">
                    <p><strong className="text-slate-900 dark:text-slate-100 font-medium">Property:</strong> {hotelContent.name}</p>
                    <p><strong className="text-slate-900 dark:text-slate-100 font-medium">Address:</strong> {hotelContent.location.address}</p>
                    <p><strong className="text-slate-900 dark:text-slate-100 font-medium">Contact:</strong> {hotelContent.contact.contactPerson}</p>
                    <p>
                      <strong className="text-slate-900 dark:text-slate-100 font-medium">Phone:</strong>{' '}
                      <a href={`tel:${hotelContent.contact.phone.replace(/\s/g, '')}`} className="text-slate-600 dark:text-slate-400 hover:text-[#D4AF37] hover:underline transition-colors duration-200">
                        {hotelContent.contact.phone}
                      </a>
                    </p>
                    <p>
                      <strong className="text-slate-900 dark:text-slate-100 font-medium">Email:</strong>{' '}
                      <a href={`mailto:${hotelContent.contact.email}`} className="text-slate-600 dark:text-slate-400 hover:text-[#D4AF37] hover:underline transition-colors duration-200">
                        {hotelContent.contact.email}
                      </a>
                    </p>
                    <p>
                      <strong className="text-slate-900 dark:text-slate-100 font-medium">Website:</strong>{' '}
                      <a href={hotelContent.contact.website} target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-400 hover:text-[#D4AF37] hover:underline transition-colors duration-200">
                        {hotelContent.contact.website}
                      </a>
                    </p>
                  </div>
                </section>

                <div className="h-px bg-slate-200/50 dark:bg-slate-700/40 mb-12 md:mb-16" />

                <section id="disclaimer" className="scroll-mt-28 mb-12 md:mb-16">
                  <h2 className="text-2xl md:text-3xl font-medium text-slate-900 dark:text-slate-100 mb-6 tracking-tight">
                    Disclaimer
                  </h2>
                  <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 leading-[1.85]">
                    By making a reservation at {hotelContent.name}, you acknowledge that you have read, understood, and agree to these terms and conditions. The property reserves the right to refuse service to anyone who violates these policies.
                  </p>
                </section>

                <div className="pt-8 border-t border-slate-200/60 dark:border-slate-700/40">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-[15px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:underline transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Back to Home
                  </Link>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </PremiumBackground>
  );
}
