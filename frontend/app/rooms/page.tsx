'use client';

import { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';
import { Room, RoomType } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { hotelContent } from '@/lib/content/hotel-content';
import { getRoomTypeImage } from '@/lib/utils/room-images';
import { hardcodedRoomTypes } from '@/lib/data/room-types';
import { PremiumBackground } from '@/components/layout/PremiumBackground';

const GOLD = '#D4AF37';

function SacredAccent() {
  return (
    <div className="flex items-center justify-center gap-3 py-8 md:py-10" aria-hidden>
      <div className="h-px w-16 bg-gradient-to-r from-transparent via-slate-300/60 to-slate-300/60 dark:via-slate-500/40 dark:to-slate-500/40" />
      <div className="w-1.5 h-1.5 rounded-full bg-slate-400/50 dark:bg-slate-500/40" />
      <div className="h-px w-16 bg-gradient-to-l from-transparent via-slate-300/60 to-slate-300/60 dark:via-slate-500/40 dark:to-slate-500/40" />
    </div>
  );
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [showFilters, setShowFilters] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visibleRooms, setVisibleRooms] = useState<Set<number>>(new Set());
  const roomRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
    fetchRoomTypes();
    fetchRooms();
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [checkIn, checkOut, selectedType]);

  useEffect(() => {
    const observers = roomRefs.current.map((ref, index) => {
      if (!ref) return null;
      const ob = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setVisibleRooms((prev) => new Set(prev).add(index));
          });
        },
        { threshold: 0.1, rootMargin: '-40px' }
      );
      ob.observe(ref);
      return ob;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, [rooms]);

  const fetchRoomTypes = async () => {
    try {
      const response = await api.get('/rooms/types');
      const types = response.data?.length ? response.data : hardcodedRoomTypes;
      setRoomTypes(types);
      if (types.length > 0) {
        const prices = types.map((rt: RoomType) => rt.base_price);
        setPriceRange([Math.min(...prices), Math.max(...prices)]);
      }
    } catch {
      setRoomTypes(hardcodedRoomTypes);
      const prices = hardcodedRoomTypes.map((rt) => rt.base_price);
      setPriceRange([Math.min(...prices), Math.max(...prices)]);
    }
  };

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = {};
      if (checkIn && checkOut) {
        params.check_in = checkIn;
        params.check_out = checkOut;
        params.available = true;
      }
      if (selectedType) params.room_type_id = selectedType;
      const response = await api.get('/rooms', { params });
      setRooms(response.data);
    } catch {
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const [today, setToday] = useState('');
  const [tomorrow, setTomorrow] = useState('');
  useEffect(() => {
    setToday(new Date().toISOString().split('T')[0]);
    setTomorrow(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  }, []);

  const filteredRooms = rooms.filter((room) => {
    const price = room.room_type.base_price;
    return price >= priceRange[0] && price <= priceRange[1];
  });

  const heroImage =
    roomTypes.length > 0
      ? getRoomTypeImage(roomTypes[0].name, 0)
      : '/shivashray_images/Property Images/713583d6-b231-4eb5-82a8-4bbdcc4791fc.avif';

  return (
    <PremiumBackground variant="rooms">
      <div className="relative z-0">
        {/* Hero – cinematic room image, soft overlay, serif headline */}
        <section className="relative h-[55vh] min-h-[320px] md:h-[65vh] overflow-hidden">
          <Image
            src={heroImage}
            alt="Shivashray rooms"
            fill
            priority
            quality={95}
            className="object-cover transition-transform duration-700 ease-out hover:scale-[1.02]"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.6) 100%)',
            }}
          />
          <div className="absolute inset-0 flex flex-col justify-end pb-12 md:pb-16 lg:pb-20 px-6 md:px-10 lg:px-12">
            <div
              className={`max-w-4xl transition-all duration-600 ease-out ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight mb-3"
                style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
              >
                Our Rooms
              </h1>
              <p className="text-lg md:text-xl text-white/90 font-light max-w-xl mb-8">
                Thoughtfully designed spaces for comfort and tranquility — your sanctuary in the heart of Varanasi.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#availability"
                  className="inline-flex items-center justify-center px-8 py-4 min-h-[52px] rounded-2xl font-medium text-[15px] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: GOLD, color: '#0F1115' }}
                >
                  Check Availability
                </a>
                <Link
                  href="#amenities"
                  className="inline-flex items-center justify-center px-8 py-4 min-h-[52px] rounded-2xl font-medium text-[15px] text-white border border-white/40 hover:bg-white/10 transition-all duration-200"
                >
                  View Amenities
                </Link>
              </div>
            </div>
          </div>
        </section>

        <SacredAccent />

        {/* Room categories – horizontal scroll (desktop) / stacked (mobile) */}
        {roomTypes.length > 1 && (
          <>
            <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
              <h2
                className="text-2xl md:text-3xl font-light text-slate-900 dark:text-slate-100 mb-8 tracking-tight"
                style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
              >
                Room Types
              </h2>
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide md:flex-wrap md:overflow-visible">
                {roomTypes.map((type, idx) => {
                  const img = getRoomTypeImage(type.name, 0);
                  const isPopular = idx === 1;
                  return (
                    <Link
                      key={type.id}
                      href={`#room-type-${type.id}`}
                      className="group flex-shrink-0 w-[280px] md:w-[300px] rounded-[18px] overflow-hidden bg-white/90 dark:bg-slate-800/70 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-slate-200/50 dark:border-slate-700/40 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={img}
                          alt={type.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          sizes="300px"
                        />
                        {isPopular && (
                          <span
                            className="absolute top-4 left-4 px-3 py-1 rounded-full text-[12px] font-medium uppercase tracking-wider"
                            style={{ background: GOLD, color: '#0F1115' }}
                          >
                            Most Popular
                          </span>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="text-[18px] font-medium text-slate-900 dark:text-slate-100 mb-2" style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}>
                          {type.name}
                        </h3>
                        <p className="text-[15px] text-slate-500 dark:text-slate-400 font-light line-clamp-2 mb-3">{type.description}</p>
                        <p className="text-[20px] font-semibold" style={{ color: GOLD }}>
                          ₹{type.base_price.toLocaleString('en-IN')}
                          <span className="text-[14px] font-normal text-slate-500 dark:text-slate-400">/night</span>
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
            <SacredAccent />
          </>
        )}

        {/* Search & filters – glassmorphic, gold accent */}
        <section id="availability" className="max-w-6xl mx-auto px-6 lg:px-8 pb-12 md:pb-16">
          <div
            className={`rounded-[18px] p-6 md:p-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-slate-200/50 dark:border-slate-700/40 transition-all duration-600 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-[12px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-2">Check-in</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={today}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200/80 dark:border-slate-600/60 bg-white/80 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]/50 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-[12px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-2">Check-out</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || tomorrow}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200/80 dark:border-slate-600/60 bg-white/80 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]/50 transition-all duration-200"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200/80 dark:border-slate-600/60 bg-white/60 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 text-[15px] font-medium hover:bg-white/80 dark:hover:bg-slate-800/60 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                  Filters
                </button>
              </div>
            </div>
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-slate-200/60 dark:border-slate-600/40 space-y-6">
                <div>
                  <label className="block text-[12px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-3">Room Type</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedType(null)}
                      className={`px-4 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 ${
                        selectedType === null
                          ? 'text-[#0F1115]'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                      style={{ background: selectedType === null ? GOLD : 'rgba(0,0,0,0.04)' }}
                    >
                      All Types
                    </button>
                    {roomTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedType(type.id)}
                        className={`px-4 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 ${
                          selectedType === type.id ? 'text-[#0F1115]' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                        style={{ background: selectedType === type.id ? GOLD : 'rgba(0,0,0,0.04)' }}
                      >
                        {type.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-3">
                    Price: ₹{priceRange[0].toLocaleString('en-IN')} – ₹{priceRange[1].toLocaleString('en-IN')}
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      placeholder="Min"
                      className="px-4 py-3 rounded-xl border border-slate-200/80 dark:border-slate-600/60 bg-white/80 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40"
                    />
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      placeholder="Max"
                      className="px-4 py-3 rounded-xl border border-slate-200/80 dark:border-slate-600/60 bg-white/80 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <SacredAccent />

        {/* Rooms list */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-24 md:pb-32">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-10 h-10 border-2 border-slate-200 dark:border-slate-600 border-t-[#D4AF37] rounded-full animate-spin mb-4" />
              <p className="text-[15px] text-slate-500 dark:text-slate-400 font-light">Loading rooms...</p>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="text-center py-24">
              <h3 className="text-2xl font-light text-slate-900 dark:text-slate-100 mb-2" style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}>No Rooms Found</h3>
              <p className="text-[16px] text-slate-500 dark:text-slate-400 font-light mb-8 max-w-md mx-auto">
                {checkIn && checkOut ? 'No rooms available for the selected dates.' : 'No rooms match your filters.'}
              </p>
              <button
                type="button"
                onClick={() => { setCheckIn(''); setCheckOut(''); setSelectedType(null); fetchRooms(); }}
                className="px-6 py-3 rounded-2xl font-medium text-[15px] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: GOLD, color: '#0F1115' }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <p className="text-center text-[15px] text-slate-500 dark:text-slate-400 font-light mb-12">
                {filteredRooms.length} {filteredRooms.length === 1 ? 'room' : 'rooms'} available
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredRooms.map((room, index) => (
                  <Link
                    key={room.id}
                    href={`/rooms/${room.id}${checkIn && checkOut ? `?check_in=${checkIn}&check_out=${checkOut}` : ''}`}
                    ref={(el) => { roomRefs.current[index] = el as HTMLDivElement | null; }}
                    className={`group block rounded-[18px] overflow-hidden bg-white/90 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/40 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.15)] transition-all duration-600 ease-out ${
                      visibleRooms.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{ transitionDelay: `${index * 80}ms` }}
                  >
                    <div className="relative h-72 overflow-hidden">
                      <Image
                        src={room.image_urls?.[0] || getRoomTypeImage(room.room_type.name, room.id)}
                        alt={room.room_number}
                        fill
                        quality={95}
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      <div className="absolute top-5 left-5">
                        <span className="px-3 py-1.5 rounded-xl text-[12px] font-medium bg-white/95 dark:bg-slate-800/95 text-slate-800 dark:text-slate-200 backdrop-blur-sm">
                          Available
                        </span>
                      </div>
                    </div>
                    <div className="p-6 md:p-8">
                      <h3
                        className="text-2xl font-light text-slate-900 dark:text-slate-100 mb-2 tracking-tight"
                        style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
                      >
                        {room.room_type.name}
                      </h3>
                      <p className="text-[15px] text-slate-500 dark:text-slate-400 font-light">Room {room.room_number}{room.floor ? ` · Floor ${room.floor}` : ''}</p>
                      {room.description && (
                        <p className="text-[16px] text-slate-600 dark:text-slate-300 font-light mt-4 leading-relaxed line-clamp-2">{room.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-4 text-[14px] text-slate-500 dark:text-slate-400 font-light">
                        <span>{room.room_type.max_occupancy} {room.room_type.max_occupancy === 1 ? 'guest' : 'guests'}</span>
                        {room.amenities?.length ? <span>{room.amenities.length} amenities</span> : null}
                      </div>
                      <div className="mt-6 pt-6 border-t border-slate-200/60 dark:border-slate-600/40 flex items-center justify-between">
                        <div>
                          <p className="text-[12px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-1">From</p>
                          <p className="text-2xl font-semibold" style={{ color: GOLD }}>
                            ₹{room.room_type.base_price.toLocaleString('en-IN')}
                            <span className="text-[15px] font-normal text-slate-500 dark:text-slate-400">/night</span>
                          </p>
                        </div>
                        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-slate-300/80 dark:border-slate-500/60 text-slate-600 dark:text-slate-400 group-hover:border-[#D4AF37] group-hover:text-[#D4AF37] transition-all duration-200">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Amenities – clean grid, thin icons, generous spacing */}
        <section id="amenities" className="max-w-6xl mx-auto px-6 lg:px-8 py-16 md:py-24">
          <h2
            className="text-2xl md:text-3xl font-light text-slate-900 dark:text-slate-100 mb-10 md:mb-12 tracking-tight text-center"
            style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
          >
            Amenities at Shivashray
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {(hotelContent.amenities || []).slice(0, 12).map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center p-6 rounded-2xl border border-slate-200/40 dark:border-slate-600/30 bg-white/50 dark:bg-slate-800/30"
              >
                <div className="w-10 h-10 flex items-center justify-center mb-3 text-slate-500 dark:text-slate-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                </div>
                <p className="text-[15px] font-medium text-slate-800 dark:text-slate-200">{item.name}</p>
                {item.description && <p className="text-[13px] text-slate-500 dark:text-slate-400 font-light mt-1 line-clamp-2">{item.description}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Testimonial snippet – minimal card */}
        {filteredRooms.length > 0 && (
          <>
            <SacredAccent />
            <section className="max-w-4xl mx-auto px-6 lg:px-8 pb-20 md:pb-28">
              <blockquote className="rounded-[18px] p-8 md:p-10 text-center bg-white/60 dark:bg-slate-800/60 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-slate-200/50 dark:border-slate-700/40">
                <p
                  className="text-xl md:text-2xl font-light text-slate-700 dark:text-slate-300 leading-relaxed mb-6"
                  style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
                >
                  “A place of calm in the heart of the city. The room was spotless and the silence at night felt sacred.”
                </p>
                <footer className="text-[14px] text-slate-500 dark:text-slate-400 font-light">— Guest, Shivashray</footer>
              </blockquote>
            </section>
          </>
        )}
      </div>
    </PremiumBackground>
  );
}
