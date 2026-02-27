'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { RoomType } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { hotelContent } from '@/lib/content/hotel-content';
import { getRoomTypeImage } from '@/lib/utils/room-images';
import { hardcodedRoomTypes } from '@/lib/data/room-types';
import { PremiumBackground } from '@/components/layout/PremiumBackground';
import { getBookingEngineUrl } from '@/lib/booking-engine';

const GOLD = '#D4AF37';
const SERIF = 'var(--font-playfair-display), Georgia, serif';

// Best cover image index per room type (chosen for composition & warmth)
const COVER_IMG: Record<string, number> = {
  'deluxe room':       4,   // 89ba8bcf — warm, well-lit interior
  'super deluxe room': 3,   // 14667271 — different angle from hero
  'family room':       2,   // WhatsApp 7455891f — spacious feel
};

export default function RoomsPage() {
  const [roomTypes, setRoomTypes]   = useState<RoomType[]>([]);
  const [mounted, setMounted]       = useState(false);
  const [activeIdx, setActiveIdx]   = useState(0);
  const [imgVisible, setImgVisible] = useState(true);
  const bookingEngineUrl = getBookingEngineUrl();

  useEffect(() => {
    setMounted(true);
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    try {
      const res = await api.get('/rooms/types');
      setRoomTypes(res.data?.length ? res.data : hardcodedRoomTypes);
    } catch {
      setRoomTypes(hardcodedRoomTypes);
    }
  };

  const switchTo = (idx: number) => {
    if (idx === activeIdx) return;
    setImgVisible(false);
    setTimeout(() => { setActiveIdx(idx); setImgVisible(true); }, 240);
  };
  const prev = () => switchTo((activeIdx - 1 + roomTypes.length) % roomTypes.length);
  const next = () => switchTo((activeIdx + 1) % roomTypes.length);

  const activeType = roomTypes[activeIdx];
  // Use a rich Super Deluxe image for the cinematic hero
  const heroImg = '/shivashray_images/Super Deluxe Room/66de74a8-c3ad-4a98-b49d-9e331e4eacfc.jpg';

  return (
    <PremiumBackground variant="rooms">
      <div className="relative z-0">

        {/* ══ HERO ══════════════════════════════════════════════════════ */}
        <section className="relative min-h-[540px] md:min-h-[600px] lg:min-h-[680px] overflow-hidden">
          <Image
            src={heroImg}
            alt="Shivashray rooms"
            fill priority quality={95}
            className="object-cover"
            sizes="100vw"
          />
          {/* Asymmetric overlay: darker on left for text, lighter on right */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(110deg, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.48) 55%, rgba(0,0,0,0.18) 100%)' }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.50) 0%, transparent 40%)' }}
          />

          {/* Single flex-column container: clears navbar top, text in middle, stats pinned bottom */}
          <div className="absolute inset-0 flex flex-col">

            {/* Text block — grows to fill space, vertically centered in remaining area */}
            <div className="flex-1 flex items-center pt-20 md:pt-24 pb-6">
              <div
                className={`px-6 md:px-10 lg:px-16 w-full max-w-xl transition-all duration-700 ease-out ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                {/* Eyebrow */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px w-8 flex-shrink-0" style={{ background: GOLD }} />
                  <span className="text-[11px] uppercase tracking-[0.2em] font-medium whitespace-nowrap" style={{ color: GOLD }}>
                    Shiv Ashray · Kashi
                  </span>
                </div>

                {/* Heading — single line to save vertical space on mobile */}
                <h1
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white leading-[1.06] tracking-[-0.025em] mb-4 md:mb-5"
                  style={{ fontFamily: SERIF }}
                >
                  Our Rooms
                </h1>

                {/* Subtitle */}
                <p className="text-[15px] md:text-[16px] text-white/65 font-light leading-relaxed mb-7 md:mb-8 max-w-[320px] md:max-w-sm">
                  Thoughtfully crafted sanctuaries in the ancient lanes of Varanasi.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3">
                  <a
                    href={bookingEngineUrl}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 md:px-7 py-3 md:py-3.5 rounded-2xl font-semibold text-[14px] md:text-[15px] transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                    style={{ background: GOLD, color: '#0F1115' }}
                  >
                    Book Now
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 10L10 2M10 2H5M10 2V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                  <Link
                    href="#showcase"
                    className="inline-flex items-center px-6 md:px-7 py-3 md:py-3.5 rounded-2xl font-medium text-[14px] md:text-[15px] text-white border border-white/25 hover:bg-white/10 transition-all duration-200"
                  >
                    Explore Rooms
                  </Link>
                </div>
              </div>
            </div>

            {/* Stats bar — flows naturally at bottom, no absolute positioning */}
            <div
              className="flex divide-x divide-white/10 backdrop-blur-sm flex-shrink-0"
              style={{ background: 'rgba(0,0,0,0.44)' }}
            >
              {[
                { label: 'Room Types',  value: `${roomTypes.length || 3}` },
                { label: 'Total Rooms', value: `${hotelContent.property.totalRooms}+` },
                { label: 'Check-in',   value: hotelContent.policies.checkIn.time },
                { label: 'Check-out',  value: hotelContent.policies.checkOut.time },
              ].map(s => (
                <div key={s.label} className="flex-1 px-3 md:px-5 py-3 md:py-4 text-center">
                  <p className="text-[9px] text-white/40 uppercase tracking-wider font-medium leading-none mb-1.5">{s.label}</p>
                  <p className="text-[13px] md:text-[15px] font-light text-white leading-none">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ ROOM TYPE SHOWCASE ════════════════════════════════════════ */}
        {roomTypes.length > 0 && (
          <section id="showcase" className="py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">

              {/* Label */}
              <div className="flex items-center gap-4 mb-10 md:mb-14">
                <div className="h-px flex-1 bg-slate-200/60 dark:bg-slate-700/40" />
                <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-600 font-medium px-1">
                  Room Types
                </span>
                <div className="h-px flex-1 bg-slate-200/60 dark:bg-slate-700/40" />
              </div>

              {/* Stage: image + info */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-10 items-center">

                {/* Image pane */}
                <div className="lg:col-span-7">
                  <div className="relative aspect-[4/3] md:aspect-[16/10] rounded-2xl md:rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-2xl">
                    {activeType && (
                      <Image
                        src={getRoomTypeImage(activeType.name, COVER_IMG[activeType.name.toLowerCase()] ?? 0)}
                        alt={activeType.name}
                        fill quality={95}
                        className="object-cover transition-opacity duration-300"
                        sizes="(max-width: 1024px) 100vw, 58vw"
                        style={{ opacity: imgVisible ? 1 : 0 }}
                      />
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />

                    {/* Counter badge */}
                    <div
                      className="absolute top-5 right-5 px-3 py-1.5 rounded-full text-white text-[12px] font-light tracking-widest backdrop-blur-md"
                      style={{ background: 'rgba(0,0,0,0.38)' }}
                    >
                      {String(activeIdx + 1).padStart(2, '0')} / {String(roomTypes.length).padStart(2, '0')}
                    </div>

                    {/* Prev / Next arrows */}
                    {roomTypes.length > 1 && (
                      <>
                        <button
                          onClick={prev}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 active:scale-95 backdrop-blur-md"
                          style={{ background: 'rgba(0,0,0,0.35)' }}
                          aria-label="Previous room type"
                        >
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M11 14l-5-5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        <button
                          onClick={next}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 active:scale-95 backdrop-blur-md"
                          style={{ background: 'rgba(0,0,0,0.35)' }}
                          aria-label="Next room type"
                        >
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </>
                    )}

                    {/* Dot nav */}
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                      {roomTypes.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => switchTo(i)}
                          className="rounded-full transition-all duration-300"
                          style={{
                            width: i === activeIdx ? '22px' : '6px',
                            height: '6px',
                            background: i === activeIdx ? GOLD : 'rgba(255,255,255,0.5)',
                          }}
                          aria-label={`Room type ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Info pane */}
                <div className="lg:col-span-5 pt-8 lg:pt-0">
                  {activeType && (
                    <div
                      className="transition-all duration-300 ease-out"
                      style={{ opacity: imgVisible ? 1 : 0, transform: imgVisible ? 'translateY(0)' : 'translateY(8px)' }}
                    >
                      {/* Category chip */}
                      <span
                        className="inline-block text-[11px] font-medium uppercase tracking-[0.15em] px-3 py-1 rounded-full mb-5"
                        style={{ background: `${GOLD}15`, color: GOLD }}
                      >
                        {activeIdx === 1 ? 'Most Popular' : 'Premium'}
                      </span>

                      {/* Room name */}
                      <h2
                        className="text-3xl md:text-4xl xl:text-5xl font-light text-slate-900 dark:text-slate-100 leading-tight tracking-tight mb-4"
                        style={{ fontFamily: SERIF }}
                      >
                        {activeType.name}
                      </h2>

                      {/* Price */}
                      <div className="mb-6">
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-medium mb-1">Starting from</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl md:text-4xl font-semibold" style={{ color: GOLD }}>
                            ₹{activeType.base_price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[14px] text-slate-400 dark:text-slate-500 font-light">/night</span>
                        </div>
                      </div>

                      <div className="h-px bg-slate-200/70 dark:bg-slate-700/50 mb-6" />

                      {/* Quick stats */}
                      <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6 text-[13px] text-slate-500 dark:text-slate-400 font-light">
                        <div className="flex items-center gap-1.5">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-60 flex-shrink-0">
                            <path d="M7 7a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm-4.5 5.5a4.5 4.5 0 019 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                          </svg>
                          <span>{activeType.max_occupancy} {activeType.max_occupancy === 1 ? 'guest' : 'guests'}</span>
                        </div>
                        {activeType.extra_adult_price ? (
                          <div className="flex items-center gap-1.5">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-60 flex-shrink-0">
                              <path d="M10 7a2 2 0 100-4M12.5 12a4 4 0 00-4-4H5.5a4 4 0 00-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                            </svg>
                            <span>Extra guests welcome</span>
                          </div>
                        ) : null}
                      </div>

                      {/* Description */}
                      <p className="text-[15px] text-slate-600 dark:text-slate-300 font-light leading-relaxed mb-8">
                        {activeType.description}
                      </p>

                      {/* CTAs */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <a
                          href={bookingEngineUrl}
                          target="_blank" rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-[15px] transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                          style={{ background: GOLD, color: '#0F1115' }}
                        >
                          Book Now
                          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                            <path d="M2 11L11 2M11 2H5M11 2V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail strip */}
              {roomTypes.length > 1 && (
                <div className="mt-8 flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
                  {roomTypes.map((type, idx) => (
                    <button
                      key={type.id}
                      onClick={() => switchTo(idx)}
                      className="group flex-shrink-0 w-[150px] md:w-[200px] rounded-xl overflow-hidden transition-all duration-300"
                      style={{
                        outline: idx === activeIdx ? `2px solid ${GOLD}` : '2px solid transparent',
                        outlineOffset: '2px',
                        opacity: idx === activeIdx ? 1 : 0.55,
                      }}
                    >
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={getRoomTypeImage(type.name, COVER_IMG[type.name.toLowerCase()] ?? 0)}
                          alt={type.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          sizes="200px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-2.5 md:p-3">
                          <p className="text-white text-[11px] md:text-[12px] font-medium leading-tight truncate">{type.name}</p>
                          <p className="text-white/55 text-[10px] font-light mt-0.5">
                            from ₹{type.base_price.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}


        {/* ══ POLICIES STRIP ════════════════════════════════════════════ */}
        <section
          className="py-10 md:py-12 border-y border-slate-200/40 dark:border-slate-700/30"
          style={{ background: 'rgba(212,175,55,0.04)' }}
        >
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-6 gap-x-4">
              {[
                { label: 'Check-in',       value: '12:00 PM' },
                { label: 'Check-out',      value: '11:00 AM' },
                { label: 'Cancellation',   value: '3 Days' },
                { label: 'Children 0–5',   value: 'Free' },
                { label: 'Food',           value: 'Veg Only' },
                { label: 'Smoking',        value: 'Not Allowed' },
              ].map(p => (
                <div key={p.label} className="text-center">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400 dark:text-slate-600 font-medium mb-1.5">{p.label}</p>
                  <p className="text-[13px] md:text-[14px] font-medium text-slate-700 dark:text-slate-300">{p.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ AMENITIES ═════════════════════════════════════════════════ */}
        <section id="amenities" className="py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-10 md:mb-12">
              <h2
                className="text-2xl md:text-3xl font-light text-slate-900 dark:text-slate-100 tracking-tight"
                style={{ fontFamily: SERIF }}
              >
                What&apos;s Included
              </h2>
              <p className="mt-2 text-[14px] text-slate-400 dark:text-slate-600 font-light tracking-wide">
                Every room, every night
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {(hotelContent.amenities || []).slice(0, 14).map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-200/70 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/40 backdrop-blur-sm"
                >
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: GOLD }} />
                  <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ BOOKING BANNER ════════════════════════════════════════════ */}
        <section className="pb-16 md:pb-20">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <div
              className="relative rounded-3xl overflow-hidden py-14 md:py-16 px-8 md:px-14 text-center"
              style={{ background: 'linear-gradient(135deg, #78350f 0%, #92400e 38%, #b45309 68%, #78350f 100%)' }}
            >
              {/* Dot pattern */}
              <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '28px 28px',
                }}
              />
              <div className="relative">
                <p className="text-[10px] uppercase tracking-[0.22em] text-amber-200/65 font-medium mb-3">
                  Live Availability
                </p>
                <h2
                  className="text-3xl md:text-4xl font-light text-white mb-3 tracking-tight"
                  style={{ fontFamily: SERIF }}
                >
                  Ready to Experience Kashi?
                </h2>
                <p className="text-[15px] text-white/65 font-light mb-8 max-w-xs mx-auto leading-relaxed">
                  Secure your stay instantly via our trusted booking partner.
                </p>
                <a
                  href={bookingEngineUrl}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl font-semibold text-[16px] transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-xl"
                  style={{ background: GOLD, color: '#0F1115' }}
                >
                  Book on Stayflexi
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 11.5L11.5 2.5M11.5 2.5H5.5M11.5 2.5V8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ══ TESTIMONIAL ═══════════════════════════════════════════════ */}
        <section className="pb-28 md:pb-36">
          <div className="max-w-2xl mx-auto px-6">
            <blockquote className="text-center">
              <div
                className="text-6xl mb-5 leading-none select-none"
                style={{ color: `${GOLD}38`, fontFamily: SERIF }}
              >
                &ldquo;
              </div>
              <p
                className="text-xl md:text-2xl font-light text-slate-700 dark:text-slate-300 leading-relaxed"
                style={{ fontFamily: SERIF }}
              >
                A place of calm in the heart of the city. The room was spotless
                and the silence at night felt sacred.
              </p>
              <div className="mt-7 flex items-center justify-center gap-3">
                <div className="h-px w-10 bg-slate-300/60 dark:bg-slate-600/40" />
                <footer className="text-[13px] text-slate-400 dark:text-slate-600 font-light tracking-wide">
                  Guest, Shivashray
                </footer>
                <div className="h-px w-10 bg-slate-300/60 dark:bg-slate-600/40" />
              </div>
            </blockquote>
          </div>
        </section>

      </div>
    </PremiumBackground>
  );
}
