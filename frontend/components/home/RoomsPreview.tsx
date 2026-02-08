'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import api from '@/lib/api';
import { RoomType } from '@/types';
import Link from 'next/link';
import { getRoomTypeImages } from '@/lib/utils/room-images';
import { hardcodedRoomTypes } from '@/lib/data/room-types';

// Room card slideshow component
function RoomCardSlideshow({ 
  roomTypeName, 
  roomId 
}: { 
  roomTypeName: string; 
  roomId: number;
}) {
  const images = getRoomTypeImages(roomTypeName);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isHovered && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 3000); // Change image every 3 seconds
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovered, images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    // Restart auto-play after manual navigation
    if (!isHovered && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 3000);
    }
  };

  if (images.length === 0) return null;

  return (
    <div
      className="relative h-64 bg-gray-100/50 overflow-hidden group/slideshow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Images */}
      <div className="relative w-full h-full">
        {images.map((src, index) => (
          <div
            key={`${roomId}-${index}`}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <Image
              src={src}
              alt={`${roomTypeName} - Image ${index + 1}`}
              fill
              quality={100}
              className="object-cover group-hover/slideshow:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToSlide(index);
              }}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-2 h-2 bg-white'
                  : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Previous/Next Buttons (shown on hover) */}
      {images.length > 1 && isHovered && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToSlide((currentIndex - 1 + images.length) % images.length);
            }}
            onMouseDown={(e) => e.preventDefault()}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center text-gray-900 hover:bg-white hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg border border-white/20"
            aria-label="Previous image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToSlide((currentIndex + 1) % images.length);
            }}
            onMouseDown={(e) => e.preventDefault()}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center text-gray-900 hover:bg-white hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg border border-white/20"
            aria-label="Next image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  const [mounted, setMounted] = useState(false);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
    fetchRoomTypes();
  }, []);

  useEffect(() => {
    const observers = itemRefs.current.map((ref, index) => {
      if (!ref) return null;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleItems((prev) => new Set(prev).add(index));
            }
          });
        },
        { threshold: 0.2, rootMargin: '-50px' }
      );
      
      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, [roomTypes]);

  const fetchRoomTypes = async () => {
    try {
      const response = await api.get('/rooms/types');
      // Use API data if available, otherwise fallback to hardcoded
      if (response.data && response.data.length > 0) {
        setRoomTypes(response.data.slice(0, 3));
      } else {
        setRoomTypes(hardcodedRoomTypes);
      }
    } catch (error) {
      // On error, use hardcoded data
      console.error('Error fetching room types, using hardcoded data:', error);
      setRoomTypes(hardcodedRoomTypes);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  if (roomTypes.length === 0) {
    return null;
  }

  return (
    <section className="py-20 md:py-28 bg-[#F8F6F2] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header – serif title */}
        <div
          className={`text-center mb-14 md:mb-16 transition-all duration-1000 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2
            className="text-[36px] sm:text-[44px] md:text-[52px] font-normal text-[#0E1A2B] mb-4 tracking-tight"
            style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
          >
            Our Rooms
          </h2>
          <p className="text-[17px] md:text-[18px] text-[#2F5D62] font-normal max-w-2xl mx-auto">
            Thoughtfully designed spaces for your comfort
          </p>
        </div>

        {/* Rooms Grid – gold hover outline, soft shadow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {roomTypes.map((roomType, index) => (
            <Link
              key={roomType.id}
              href="/rooms"
              ref={(el) => { itemRefs.current[index] = el as HTMLDivElement | null; }}
              className={`group bg-[#F5F1E8] rounded-[14px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-[#C6A75E]/10 hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] hover:ring-2 hover:ring-[#C6A75E]/30 hover:ring-offset-2 hover:ring-offset-[#F8F6F2] hover:-translate-y-0.5 transition-all duration-500 ease-out ${
                visibleItems.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <RoomCardSlideshow roomTypeName={roomType.name} roomId={roomType.id} />

              <div className="p-6 md:p-8">
                <h3
                  className="text-[22px] md:text-[24px] font-semibold text-[#0E1A2B] mb-2 tracking-tight"
                  style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
                >
                  {roomType.name}
                </h3>
                {roomType.description && (
                  <p className="text-[15px] text-[#2F5D62] font-normal mb-4 leading-relaxed line-clamp-2">
                    {roomType.description}
                  </p>
                )}
                <div className="pt-4 border-t border-[#C6A75E]/15 space-y-3">
                  <div>
                    <p className="text-[12px] text-[#2F5D62] uppercase tracking-wider font-medium mb-1">
                      {roomType.name.includes('Family Room') ? 'Quad Occupancy' : 'Double Occupancy'}
                    </p>
                    <p className="text-[20px] font-semibold text-[#0E1A2B]">
                      ₹{roomType.base_price.toLocaleString('en-IN')}
                      <span className="text-[15px] font-normal text-[#2F5D62]">/night</span>
                    </p>
                  </div>
                  {(roomType.extra_adult_price || roomType.child_price) && (
                    <div className="text-[13px] text-[#2F5D62] space-y-1">
                      {roomType.extra_adult_price && (
                        <p>Extra Adult: ₹{roomType.extra_adult_price.toLocaleString('en-IN')}/night</p>
                      )}
                      {roomType.child_price && (
                        <p>Child: ₹{roomType.child_price.toLocaleString('en-IN')}/night</p>
                      )}
                    </div>
                  )}
                  <div className="pt-2 flex items-center text-[#C6A75E] font-medium text-[14px] group-hover:text-[#0E1A2B] transition-colors">
                    <span>View Details</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/rooms"
            className="inline-flex items-center space-x-2 text-[17px] font-medium text-[#0E1A2B] hover:text-[#C6A75E] transition-colors duration-300"
          >
            <span>View all rooms</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
