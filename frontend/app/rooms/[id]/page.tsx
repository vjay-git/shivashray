'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Room } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { getRoomTypeImage, getAllRoomImages, getRoomTypeImages } from '@/lib/utils/room-images';
import { PremiumBackground } from '@/components/layout/PremiumBackground';
import { getBookingEngineUrl } from '@/lib/booking-engine';

const GOLD = '#D4AF37';

function SacredAccent() {
  return (
    <div className="flex items-center justify-center gap-3 py-6 md:py-8" aria-hidden>
      <div className="h-px w-12 bg-gradient-to-r from-transparent via-slate-300/50 to-slate-300/50 dark:via-slate-500/30 dark:to-slate-500/30" />
      <div className="w-1 h-1 rounded-full bg-slate-400/40 dark:bg-slate-500/30" />
      <div className="h-px w-12 bg-gradient-to-l from-transparent via-slate-300/50 to-slate-300/50 dark:via-slate-500/30 dark:to-slate-500/30" />
    </div>
  );
}

export default function RoomDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState(searchParams.get('check_in') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('check_out') || '');
  const bookingEngineUrl = getBookingEngineUrl();

  useEffect(() => {
    setMounted(true);
    fetchRoom();
  }, [params.id]);

  const fetchRoom = async () => {
    try {
      const response = await api.get(`/rooms/${params.id}`);
      setRoom(response.data);
    } catch {
      setRoom(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PremiumBackground variant="rooms">
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-2 border-slate-200 dark:border-slate-600 border-t-[#D4AF37] rounded-full animate-spin mb-4" />
          <p className="text-[15px] text-slate-500 dark:text-slate-400 font-light">Loading room...</p>
        </div>
      </PremiumBackground>
    );
  }

  if (!room) {
    return (
      <PremiumBackground variant="rooms">
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
          <p className="text-[17px] text-slate-600 dark:text-slate-400 font-light mb-6">Room not found</p>
          <Link
            href="/rooms"
            className="inline-flex items-center justify-center px-6 py-3 rounded-2xl font-medium text-[15px] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: GOLD, color: '#0F1115' }}
          >
            Back to Rooms
          </Link>
        </div>
      </PremiumBackground>
    );
  }

  const images =
    room.image_urls?.length
      ? room.image_urls
      : [getRoomTypeImage(room.room_type.name, room.id), ...getRoomTypeImages(room.room_type.name).slice(1, 5), ...getAllRoomImages().slice(0, 2)].filter(Boolean);
  const currentImage = images[selectedImageIndex] || images[0];

  return (
    <PremiumBackground variant="rooms">
      <div className="relative z-0">
        {/* Hero – full-width room image, gradient overlay, serif headline */}
        <section className="relative h-[50vh] min-h-[300px] md:h-[58vh] overflow-hidden">
          <Image
            src={currentImage}
            alt={room.room_number}
            fill
            priority
            quality={95}
            className="object-cover transition-opacity duration-500"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.65) 100%)',
            }}
          />
          <div className="absolute inset-0 flex flex-col justify-end pb-10 md:pb-14 px-6 md:px-10 lg:px-12">
            <div
              className={`max-w-4xl transition-all duration-600 ease-out ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <h1
                className="text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-tight mb-2"
                style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
              >
                {room.room_type.name}
              </h1>
              <p className="text-base md:text-lg text-white/90 font-light">Room {room.room_number} · Your sanctuary in the heart of Varanasi</p>
            </div>
          </div>
          <div className="absolute top-6 left-6 z-10">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-12 h-12 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-lg text-slate-800 dark:text-slate-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
          </div>
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
              {images.slice(0, 6).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImageIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    selectedImageIndex === i ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </section>

        <SacredAccent />

        {/* Main content: gallery left, info + booking right */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 -mt-0 pb-20 md:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left: Image gallery – main + thumbnails */}
            <div className="lg:col-span-7 space-y-4">
              <div
                className={`rounded-[18px] overflow-hidden bg-white/90 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-700/40 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.15)] transition-all duration-600 ease-out ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                <div className="relative aspect-[4/3] md:aspect-[16/10]">
                  <Image
                    src={currentImage}
                    alt={room.room_number}
                    fill
                    className="object-cover transition-opacity duration-300"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                  />
                </div>
                {images.length > 1 && (
                  <div className="p-4 flex gap-2 overflow-x-auto scrollbar-hide">
                    {images.slice(0, 8).map((src, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedImageIndex(i)}
                        className={`relative flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                          selectedImageIndex === i
                            ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/30'
                            : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <Image src={src} alt="" fill className="object-cover" sizes="80px" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Room description + details block */}
              <div
                className={`rounded-[18px] p-6 md:p-8 bg-white/90 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-700/40 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.15)] transition-all duration-600 ease-out ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: '80ms' }}
              >
                <h2
                  className="text-xl md:text-2xl font-light text-slate-900 dark:text-slate-100 mb-4 tracking-tight"
                  style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
                >
                  About this room
                </h2>
                {room.description ? (
                  <p className="text-[16px] md:text-[17px] text-slate-600 dark:text-slate-300 font-light leading-relaxed mb-6">{room.description}</p>
                ) : (
                  <p className="text-[16px] text-slate-600 dark:text-slate-300 font-light leading-relaxed mb-6">{room.room_type.description}</p>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-200/60 dark:border-slate-600/40">
                  <div>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-1">Guests</p>
                    <p className="text-[18px] font-medium text-slate-900 dark:text-slate-100">{room.room_type.max_occupancy}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-1">Price / night</p>
                    <p className="text-[20px] font-semibold" style={{ color: GOLD }}>₹{room.room_type.base_price.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-1">Room</p>
                    <p className="text-[16px] font-medium text-slate-900 dark:text-slate-100">{room.room_number}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-1">Status</p>
                    <span className={`inline-block px-3 py-1.5 rounded-xl text-[13px] font-medium ${room.is_active ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-slate-200/60 text-slate-600 dark:text-slate-400'}`}>
                      {room.is_active ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amenities – clean grid, thin icons */}
              {room.amenities && room.amenities.length > 0 && (
                <div
                  className={`rounded-[18px] p-6 md:p-8 bg-white/90 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-700/40 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.15)] transition-all duration-600 ease-out ${
                    mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                  style={{ transitionDelay: '120ms' }}
                >
                  <h2
                    className="text-xl md:text-2xl font-light text-slate-900 dark:text-slate-100 mb-6 tracking-tight"
                    style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
                  >
                    Amenities
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {room.amenities.map((a) => (
                      <div
                        key={a.id}
                        className="flex items-center gap-3 py-3 border-b border-slate-200/40 dark:border-slate-600/30 last:border-0"
                      >
                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-slate-500 dark:text-slate-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                        <span className="text-[15px] font-light text-slate-700 dark:text-slate-300">{a.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Sticky booking panel – glassmorphic, gold CTA */}
            <div className="lg:col-span-5">
              <div
                className={`sticky top-24 rounded-[18px] p-6 md:p-8 bg-white/80 dark:bg-slate-800/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-600 ease-out hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)] ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: '160ms' }}
              >
                <h2
                  className="text-2xl font-light text-slate-900 dark:text-slate-100 mb-2 tracking-tight"
                  style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
                >
                  {room.room_type.name}
                </h2>
                <p className="text-[15px] text-slate-500 dark:text-slate-400 font-light mb-6">Room {room.room_number}</p>
                <div className="mb-6 pb-6 border-b border-slate-200/60 dark:border-slate-600/40">
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-1">From</p>
                  <p className="text-2xl md:text-3xl font-semibold" style={{ color: GOLD }}>
                    ₹{room.room_type.base_price.toLocaleString('en-IN')}
                    <span className="text-[16px] font-normal text-slate-500 dark:text-slate-400">/night</span>
                  </p>
                </div>
                <div className="space-y-5">
                  <p className="text-[15px] text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                    Live availability and secure booking are handled via our booking engine.
                  </p>

                  <a
                    href={bookingEngineUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-4 rounded-2xl font-semibold text-[16px] text-center transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    style={{ background: GOLD, color: '#0F1115' }}
                  >
                    Check Availability on Stayflexi
                  </a>

                  <p className="text-[13px] text-slate-500 dark:text-slate-400 font-light">
                    Prefer booking with us directly? Use the WhatsApp button below-right.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial snippet */}
        <SacredAccent />
        <section className="max-w-4xl mx-auto px-6 lg:px-8 pb-20 md:pb-28">
          <blockquote className="rounded-[18px] p-8 md:p-10 text-center bg-white/60 dark:bg-slate-800/60 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-slate-200/50 dark:border-slate-700/40">
            <p
              className="text-lg md:text-xl font-light text-slate-700 dark:text-slate-300 leading-relaxed mb-4"
              style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
            >
              “Quiet, clean, and steps from the ghats. Exactly what we needed for our stay in Kashi.”
            </p>
            <footer className="text-[14px] text-slate-500 dark:text-slate-400 font-light">— Guest, Shivashray</footer>
          </blockquote>
        </section>
      </div>
    </PremiumBackground>
  );
}
