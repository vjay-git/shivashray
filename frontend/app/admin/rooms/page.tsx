'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/api';
import { Room } from '@/types';
import { useAuthStore } from '@/lib/store';
import Link from 'next/link';
import { getRoomTypeImage } from '@/lib/utils/room-images';

export default function AdminRoomsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchRooms();
  }, [isAuthenticated, user, router]);

  const fetchRooms = async () => {
    try {
      const response = await api.get('/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
          <p className="text-[15px] text-gray-600 font-light">Loading rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] relative overflow-hidden">
      {/* Subtle Background Mesh */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#007aff]/2 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#5856d6]/2 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-white/20 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[34px] font-semibold text-gray-900 tracking-tight mb-1">Room Management</h1>
                <p className="text-[15px] text-gray-600 font-light">Manage your luxury inventory</p>
              </div>
              <Link
                href="/admin"
                className="px-5 py-2.5 bg-gray-900 text-white text-[15px] font-medium rounded-2xl hover:bg-gray-800 active:scale-[0.98] transition-all duration-300 ease-out shadow-lg shadow-black/10"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          {/* Rooms Grid */}
          <div 
            className={`bg-white/70 backdrop-blur-2xl rounded-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/20 overflow-hidden transition-all duration-700 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="px-8 py-6 border-b border-gray-100/60">
              <h2 className="text-[24px] font-semibold text-gray-900 tracking-tight">All Rooms</h2>
              <p className="text-[15px] text-gray-600 font-light mt-1">{rooms.length} rooms available</p>
            </div>

            <div className="p-6">
              {rooms.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100/50 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <p className="text-[17px] text-gray-600 font-light">No rooms available</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rooms.map((room, index) => (
                    <Link
                      key={room.id}
                      href={`/rooms/${room.id}`}
                      className="group bg-white/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-100/60 hover:border-gray-200/80 hover:bg-white/70 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out"
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      {/* Room Image */}
                      <div className="relative h-48 bg-gray-100/50 overflow-hidden">
                        <Image
                          src={
                            room.image_urls && room.image_urls.length > 0
                              ? room.image_urls[0]
                              : getRoomTypeImage(room.room_type.name, room.id)
                          }
                          alt={room.room_number}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>

                      {/* Room Content */}
                      <div className="p-6">
                        {/* Room Header */}
                        <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-[20px] font-semibold text-gray-900">Room {room.room_number}</h3>
                            {room.floor && (
                              <span className="px-2 py-0.5 rounded-lg text-[11px] font-medium text-gray-600 bg-gray-100/50">
                                Floor {room.floor}
                              </span>
                            )}
                          </div>
                          <p className="text-[15px] text-gray-600 font-light">{room.room_type.name}</p>
                        </div>
                        <span
                          className={`px-3 py-1.5 rounded-xl text-[12px] font-medium ${
                            room.is_active
                              ? 'bg-emerald-50/80 text-emerald-700 border border-emerald-200/60'
                              : 'bg-rose-50/80 text-rose-700 border border-rose-200/60'
                          }`}
                        >
                          {room.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      {/* Room Details */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] text-gray-500 font-medium">Price per night</span>
                          <span className="text-[17px] font-semibold text-gray-900">
                            ₹{room.room_type.base_price.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] text-gray-500 font-medium">Max occupancy</span>
                          <span className="text-[15px] text-gray-900 font-medium">
                            {room.room_type.max_occupancy} {room.room_type.max_occupancy === 1 ? 'guest' : 'guests'}
                          </span>
                        </div>
                      </div>

                      {/* Amenities Preview */}
                      {room.amenities && room.amenities.length > 0 && (
                        <div className="pt-4 border-t border-gray-100/60">
                          <p className="text-[11px] text-gray-500 uppercase tracking-wide font-medium mb-2">Amenities</p>
                          <div className="flex flex-wrap gap-2">
                            {room.amenities.slice(0, 3).map((amenity) => (
                              <span
                                key={amenity.id}
                                className="px-2.5 py-1 rounded-lg text-[12px] font-medium text-gray-700 bg-gray-100/50"
                              >
                                {amenity.name}
                              </span>
                            ))}
                            {room.amenities.length > 3 && (
                              <span className="px-2.5 py-1 rounded-lg text-[12px] font-medium text-gray-600 bg-gray-100/50">
                                +{room.amenities.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                        {/* Hover Indicator */}
                        <div className="mt-4 pt-4 border-t border-gray-100/60 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-[13px] text-gray-600 font-medium">View details</span>
                          <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
