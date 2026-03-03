'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/api';
import { RoomType } from '@/types';
import { getRoomTypeImages } from '@/lib/utils/room-images';
import { hardcodedRoomTypes } from '@/lib/data/room-types';
import { getBookingEngineUrl } from '@/lib/booking-engine';

const ROOM_TAGS: Record<string, string[]> = {
  'Deluxe Room':       ['Free WiFi', 'AC', 'Hot Water', 'TV', '2 Guests'],
  'Super Deluxe Room': ['Free WiFi', 'AC', 'Hot Water', 'TV', 'Mirror Wall', '2 Guests'],
  'Family Room':       ['Free WiFi', 'AC', 'Hot Water', 'TV', 'Up to 4 Guests'],
};

function RoomCardSlideshow({ roomTypeName, roomId }: { roomTypeName: string; roomId: number }) {
  const images = getRoomTypeImages(roomTypeName);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isHovered && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 3000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isHovered, images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!isHovered && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 3000);
    }
  };

  if (images.length === 0) return null;

  return (
    <div
      className="relative h-56 bg-gray-100 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {images.map((src, index) => (
        <div
          key={`${roomId}-${index}`}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <Image
            src={src}
            alt={`${roomTypeName} - Image ${index + 1}`}
            fill
            quality={90}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={index === 0}
          />
        </div>
      ))}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); goToSlide(index); }}
              className={`rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-2 h-2 bg-white' : 'w-1.5 h-1.5 bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Prev / Next */}
      {images.length > 1 && isHovered && (
        <>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); goToSlide((currentIndex - 1 + images.length) % images.length); }}
            onMouseDown={(e) => e.preventDefault()}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white transition-colors"
          >
            <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); goToSlide((currentIndex + 1) % images.length); }}
            onMouseDown={(e) => e.preventDefault()}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white transition-colors"
          >
            <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

export function RoomsPreview() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>(hardcodedRoomTypes);
  const [loading, setLoading] = useState(true);
  const bookingUrl = getBookingEngineUrl();

  useEffect(() => {
    api.get('/rooms/types')
      .then((res) => {
        if (res.data && res.data.length > 0) setRoomTypes(res.data.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (roomTypes.length === 0) return null;

  return (
    <section className="bg-white py-14 md:py-20 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full mb-3">
              Rooms &amp; Rates
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Choose Your Room</h2>
            <p className="text-gray-500 text-sm mt-1">All rooms include complimentary breakfast &amp; free WiFi</p>
          </div>
          <Link
            href="/rooms"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:text-amber-800 underline underline-offset-2"
          >
            View all rooms
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {roomTypes.map((roomType) => {
            const tags = ROOM_TAGS[roomType.name] ?? ['Free WiFi', 'AC', 'Hot Water'];
            return (
              <div
                key={roomType.id}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-300 flex flex-col"
              >
                {/* Image slideshow */}
                <RoomCardSlideshow roomTypeName={roomType.name} roomId={roomType.id} />

                {/* Card body */}
                <div className="p-5 flex flex-col flex-1">
                  {/* Name + rating */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-gray-900 text-[17px] leading-snug">{roomType.name}</h3>
                    <div className="flex items-center gap-1 shrink-0">
                      <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs font-semibold text-gray-700">5.0</span>
                    </div>
                  </div>

                  {/* Description */}
                  {roomType.description && (
                    <p className="text-gray-500 text-[13px] leading-relaxed mb-3 line-clamp-2">
                      {roomType.description}
                    </p>
                  )}

                  {/* Amenity tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium text-gray-600 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Price + buttons */}
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-end justify-between mb-3">
                      <div>
                        <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Starting from</p>
                        <p className="text-[22px] font-bold text-gray-900 leading-none mt-0.5">
                          ₹{roomType.base_price.toLocaleString('en-IN')}
                          <span className="text-sm font-normal text-gray-500 ml-1">/night</span>
                        </p>
                      </div>
                      <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                        Free cancellation
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href="/rooms"
                        className="flex-1 text-center py-2.5 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-700 hover:border-amber-300 hover:text-amber-700 transition-colors"
                      >
                        View Details
                      </Link>
                      <a
                        href={bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center py-2.5 rounded-xl text-[13px] font-bold text-gray-900 transition-all duration-200 hover:brightness-110 active:scale-[0.97]"
                        style={{ background: 'linear-gradient(135deg, #C6A75E, #D4AF37)' }}
                      >
                        Book Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile view all */}
        <div className="sm:hidden mt-6 text-center">
          <Link href="/rooms" className="text-sm font-semibold text-amber-700 underline underline-offset-2">
            View all rooms →
          </Link>
        </div>

      </div>
    </section>
  );
}
