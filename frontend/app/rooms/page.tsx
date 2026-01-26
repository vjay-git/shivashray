'use client';

import { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';
import { Room, RoomType } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { hotelContent } from '@/lib/content/hotel-content';
import { getRoomTypeImage, getRoomImageByIndex } from '@/lib/utils/room-images';
import { hardcodedRoomTypes } from '@/lib/data/room-types';

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
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleRooms((prev) => new Set(prev).add(index));
            }
          });
        },
        { threshold: 0.1, rootMargin: '-50px' }
      );
      
      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, [rooms]);

  const fetchRoomTypes = async () => {
    try {
      const response = await api.get('/rooms/types');
      // Use API data if available, otherwise fallback to hardcoded
      const types = response.data && response.data.length > 0 ? response.data : hardcodedRoomTypes;
      setRoomTypes(types);
      if (types.length > 0) {
        const prices = types.map((rt: RoomType) => rt.base_price);
        setPriceRange([Math.min(...prices), Math.max(...prices)]);
      }
    } catch (error) {
      // On error, use hardcoded data
      console.error('Error fetching room types, using hardcoded data:', error);
      setRoomTypes(hardcodedRoomTypes);
      const prices = hardcodedRoomTypes.map((rt) => rt.base_price);
      setPriceRange([Math.min(...prices), Math.max(...prices)]);
    }
  };

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (checkIn && checkOut) {
        params.check_in = checkIn;
        params.check_out = checkOut;
        params.available = true;
      }
      if (selectedType) {
        params.room_type_id = selectedType;
      }
      const response = await api.get('/rooms', { params });
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const [today, setToday] = useState('');
  const [tomorrow, setTomorrow] = useState('');

  useEffect(() => {
    const todayDate = new Date().toISOString().split('T')[0];
    const tomorrowDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    setToday(todayDate);
    setTomorrow(tomorrowDate);
  }, []);

  const filteredRooms = rooms.filter((room) => {
    const price = room.room_type.base_price;
    return price >= priceRange[0] && price <= priceRange[1];
  });

  return (
    <div className="min-h-screen bg-[#f5f5f7] relative overflow-hidden">
      {/* Subtle Background Mesh */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#007aff]/2 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#5856d6]/2 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Intro Section */}
        <section className="pt-24 pb-16 md:pt-32 md:pb-24">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div
              className={`text-center transition-all duration-1000 ease-out ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <h1 className="text-[56px] md:text-[72px] font-semibold text-gray-900 mb-6 tracking-tight">
                Our Rooms
              </h1>
              <p className="text-[21px] text-gray-600 font-light max-w-2xl mx-auto">
                Thoughtfully designed spaces for your comfort and tranquility
              </p>
            </div>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="max-w-6xl mx-auto px-6 lg:px-8 mb-16">
          <div
            className={`bg-white/70 backdrop-blur-2xl rounded-[28px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/20 transition-all duration-1000 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-2">
                  Check-in
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={today}
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/60 rounded-2xl text-[17px] text-gray-900 focus:outline-none focus:ring-0 focus:border-[#007aff]/40 focus:bg-white transition-all duration-300 ease-out"
                />
              </div>
              <div>
                <label className="block text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-2">
                  Check-out
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || tomorrow}
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/60 rounded-2xl text-[17px] text-gray-900 focus:outline-none focus:ring-0 focus:border-[#007aff]/40 focus:bg-white transition-all duration-300 ease-out"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full px-4 py-3 bg-gray-100/50 text-gray-900 text-[15px] font-medium rounded-2xl hover:bg-gray-200/50 active:scale-[0.98] transition-all duration-300 ease-out flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span>Filters</span>
                </button>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-100/60 space-y-6 animate-in slide-in-from-top-4 duration-500">
                <div>
                  <label className="block text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-3">
                    Room Type
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setSelectedType(null)}
                      className={`px-5 py-2.5 rounded-xl text-[15px] font-medium transition-all duration-300 ease-out ${
                        selectedType === null
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100/50 text-gray-700 hover:bg-gray-200/50'
                      }`}
                    >
                      All Types
                    </button>
                    {roomTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`px-5 py-2.5 rounded-xl text-[15px] font-medium transition-all duration-300 ease-out ${
                          selectedType === type.id
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100/50 text-gray-700 hover:bg-gray-200/50'
                        }`}
                      >
                        {type.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-3">
                    Price Range: ₹{priceRange[0].toLocaleString('en-IN')} - ₹{priceRange[1].toLocaleString('en-IN')}
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      placeholder="Min"
                      className="px-4 py-3 bg-gray-50/50 border border-gray-200/60 rounded-2xl text-[17px] text-gray-900 focus:outline-none focus:ring-0 focus:border-[#007aff]/40 focus:bg-white transition-all duration-300 ease-out"
                    />
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      placeholder="Max"
                      className="px-4 py-3 bg-gray-50/50 border border-gray-200/60 rounded-2xl text-[17px] text-gray-900 focus:outline-none focus:ring-0 focus:border-[#007aff]/40 focus:bg-white transition-all duration-300 ease-out"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Rooms Gallery */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-[15px] text-gray-600 font-light">Loading rooms...</p>
              </div>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="text-center py-32">
              <div className="w-16 h-16 rounded-2xl bg-gray-100/50 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-[24px] font-semibold text-gray-900 mb-2">No Rooms Found</h3>
              <p className="text-[17px] text-gray-600 font-light mb-8 max-w-md mx-auto">
                {checkIn && checkOut
                  ? 'No rooms available for the selected dates. Try different dates.'
                  : 'No rooms match your filters. Try adjusting your search criteria.'}
              </p>
              <button
                onClick={() => {
                  setCheckIn('');
                  setCheckOut('');
                  setSelectedType(null);
                  fetchRooms();
                }}
                className="px-6 py-3 bg-gray-900 text-white text-[15px] font-medium rounded-2xl hover:bg-gray-800 active:scale-[0.98] transition-all duration-300 ease-out"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="mb-12 text-center">
                <p className="text-[15px] text-gray-600 font-light">
                  {filteredRooms.length} {filteredRooms.length === 1 ? 'room' : 'rooms'} available
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredRooms.map((room, index) => (
                  <Link
                    key={room.id}
                    href={`/rooms/${room.id}${checkIn && checkOut ? `?check_in=${checkIn}&check_out=${checkOut}` : ''}`}
                    ref={(el) => { roomRefs.current[index] = el as HTMLDivElement | null; }}
                    className={`group bg-white/70 backdrop-blur-sm rounded-[32px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-gray-100/60 hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-500 ease-out ${
                      visibleRooms.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{
                      transitionDelay: `${index * 100}ms`,
                    }}
                  >
                    {/* Image Section */}
                    <div className="relative h-80 bg-gray-100/50 overflow-hidden">
                      <Image
                        src={
                          room.image_urls && room.image_urls.length > 0
                            ? room.image_urls[0]
                            : getRoomTypeImage(room.room_type.name, room.id)
                        }
                        alt={room.room_number}
                        fill
                        quality={100}
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      {/* Availability Badge */}
                      <div className="absolute top-6 left-6">
                        <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-900 text-[12px] font-medium rounded-xl">
                          Available
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8">
                      <div className="mb-6">
                        <h3 className="text-[28px] font-semibold text-gray-900 mb-2 tracking-tight">
                          {room.room_type.name}
                        </h3>
                        <p className="text-[15px] text-gray-600 font-light">Room {room.room_number}</p>
                        {room.floor && (
                          <p className="text-[13px] text-gray-500 font-light mt-1">Floor {room.floor}</p>
                        )}
                      </div>

                      {room.description && (
                        <p className="text-[17px] text-gray-700 font-light mb-6 leading-relaxed line-clamp-2">
                          {room.description}
                        </p>
                      )}

                      {/* Key Details */}
                      <div className="mb-6 space-y-3">
                        <div className="flex items-center space-x-2 text-[15px] text-gray-600">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span className="font-light">{room.room_type.max_occupancy} {room.room_type.max_occupancy === 1 ? 'guest' : 'guests'}</span>
                        </div>
                        {room.amenities && room.amenities.length > 0 && (
                          <div className="flex items-center space-x-2 text-[15px] text-gray-600">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="font-light">{room.amenities.length} amenities</span>
                          </div>
                        )}
                      </div>

                      {/* Price and CTA */}
                      <div className="pt-6 border-t border-gray-100/60 flex items-center justify-between">
                        <div>
                          <p className="text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-1">Starting from</p>
                          <p className="text-[28px] font-semibold text-gray-900 tracking-tight">
                            ₹{room.room_type.base_price.toLocaleString('en-IN')}
                            <span className="text-[17px] font-normal text-gray-600">/night</span>
                          </p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
