'use client';

import { getBookingEngineUrl } from '@/lib/booking-engine';

const TRUST_ITEMS = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Free Cancellation',
    desc: 'Cancel up to 3 days before check-in for a full refund. No questions asked.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Best Price Guarantee',
    desc: 'Book direct for our lowest rates. No hidden fees, no markup.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: '24/7 Support',
    desc: 'Our reception team is available round the clock. Doctor on call too.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Instant Confirmation',
    desc: 'Your booking is confirmed immediately. No wait, no uncertainty.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
  },
];

export function ExclusiveDeals() {
  const bookingUrl = getBookingEngineUrl();

  return (
    <section className="bg-white py-14 md:py-20 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full mb-3">
            Why book direct
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Book with us, travel with confidence
          </h2>
          <p className="text-gray-500 text-sm md:text-base mt-2 max-w-xl mx-auto">
            Skip the OTA markup. When you book directly, you get better rates, flexible cancellation, and personalised service.
          </p>
        </div>

        {/* Trust grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-12">
          {TRUST_ITEMS.map((item) => (
            <div
              key={item.title}
              className={`${item.bg} border ${item.border} rounded-2xl p-6 flex flex-col gap-3`}
            >
              <span className={item.color}>{item.icon}</span>
              <h3 className="font-bold text-gray-900 text-[15px]">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA strip */}
        <div
          className="rounded-2xl px-8 py-10 md:py-12 text-center"
          style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)' }}
        >
          <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">Limited availability</p>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Steps from the Sacred Ghats
          </h3>
          <p className="text-white/60 text-sm md:text-base mb-7 max-w-md mx-auto">
            Kashi Vishwanath, Ganga Ghat & Kal Bhairav — all within a 2–5 minute walk. No vehicle needed.
          </p>
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-[14px] font-bold text-gray-900 transition-all duration-200 hover:brightness-110 active:scale-[0.97]"
            style={{ background: 'linear-gradient(135deg, #C6A75E, #D4AF37)' }}
          >
            Reserve Your Room
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}
