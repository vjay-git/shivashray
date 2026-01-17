'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import api from '@/lib/api';
import { RoomType } from '@/types';
import Link from 'next/link';
import { getRoomTypeImage } from '@/lib/utils/room-images';

export function RoomsPreview() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
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
      setRoomTypes(response.data.slice(0, 3)); // Show first 3 room types
    } catch (error) {
      console.error('Error fetching room types:', error);
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
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div 
          className={`text-center mb-16 transition-all duration-1000 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-[48px] md:text-[56px] font-semibold text-gray-900 mb-4 tracking-tight">
            Our Rooms
          </h2>
          <p className="text-[21px] text-gray-600 font-light max-w-2xl mx-auto">
            Thoughtfully designed spaces for your comfort
          </p>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roomTypes.map((roomType, index) => (
            <Link
              key={roomType.id}
              href="/rooms"
              ref={(el) => { itemRefs.current[index] = el as HTMLDivElement | null; }}
              className={`group bg-white/70 backdrop-blur-sm rounded-[28px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-gray-100/60 hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-500 ease-out ${
                visibleItems.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              {/* Image */}
              <div className="h-64 bg-gray-100/50 relative overflow-hidden">
                <Image
                  src={getRoomTypeImage(roomType.name, index)}
                  alt={roomType.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              {/* Content */}
              <div className="p-8">
                <h3 className="text-[24px] font-semibold text-gray-900 mb-2 tracking-tight">
                  {roomType.name}
                </h3>
                {roomType.description && (
                  <p className="text-[15px] text-gray-600 font-light mb-4 leading-relaxed line-clamp-2">
                    {roomType.description}
                  </p>
                )}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100/60">
                  <div>
                    <p className="text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-1">Starting from</p>
                    <p className="text-[21px] font-semibold text-gray-900">
                      ₹{roomType.base_price.toLocaleString('en-IN')}
                      <span className="text-[15px] font-normal text-gray-600">/night</span>
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href="/rooms"
            className="inline-flex items-center space-x-2 text-[17px] font-medium text-gray-900 hover:text-[#007aff] transition-colors duration-300"
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
