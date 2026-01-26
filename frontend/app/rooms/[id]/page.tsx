'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Room } from '@/types';
import Image from 'next/image';
import { BookingForm } from '@/components/booking/BookingForm';
import { useAuthStore } from '@/lib/store';
import { getRoomTypeImage, getAllRoomImages } from '@/lib/utils/room-images';

export default function RoomDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState(searchParams.get('check_in') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('check_out') || '');

  useEffect(() => {
    setMounted(true);
    fetchRoom();
  }, [params.id]);

  const fetchRoom = async () => {
    try {
      const response = await api.get(`/rooms/${params.id}`);
      setRoom(response.data);
    } catch (error) {
      console.error('Error fetching room:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
          <p className="text-[15px] text-gray-600 font-light">Loading room details...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="text-center">
          <p className="text-[17px] text-gray-600 font-light mb-4">Room not found</p>
          <button
            onClick={() => router.push('/rooms')}
            className="px-6 py-3 bg-gray-900 text-white text-[15px] font-medium rounded-2xl hover:bg-gray-800 active:scale-[0.98] transition-all duration-300 ease-out"
          >
            Back to Rooms
          </button>
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
        {/* Hero Image Section */}
        <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
          {(() => {
            const images = room.image_urls && room.image_urls.length > 0 
              ? room.image_urls 
              : [getRoomTypeImage(room.room_type.name, room.id), ...getAllRoomImages().slice(0, 3)];
            const currentImage = images[selectedImageIndex] || images[0];
            
            return (
              <>
                <Image
                  src={currentImage}
                  alt={room.room_number}
                  fill
                  priority
                  quality={100}
                  className="object-cover transition-opacity duration-500"
                  sizes="100vw"
                />
                {/* Image Gallery Navigation */}
                {images.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          selectedImageIndex === index
                            ? 'bg-white w-8'
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                        aria-label={`View image ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </>
            );
          })()}
          {/* Subtle Overlay */}
          <div className="absolute inset-0 bg-black/20"></div>
          
          {/* Back Button */}
          <div className="absolute top-6 left-6 z-20">
            <button
              onClick={() => router.back()}
              className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white flex items-center justify-center transition-all duration-300 ease-out active:scale-95 shadow-lg"
            >
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 -mt-16 md:-mt-24 pb-24 md:pb-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Room Header */}
              <div
                className={`bg-white/70 backdrop-blur-2xl rounded-[32px] p-8 md:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/20 transition-all duration-1000 ease-out ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="mb-6">
                  <h1 className="text-[40px] md:text-[48px] font-semibold text-gray-900 mb-3 tracking-tight">
                    {room.room_type.name}
                  </h1>
                  <p className="text-[17px] text-gray-600 font-light mb-2">Room {room.room_number}</p>
                  {room.floor && (
                    <p className="text-[15px] text-gray-500 font-light">Floor {room.floor}</p>
                  )}
                </div>

                {room.description && (
                  <p className="text-[19px] text-gray-700 font-light leading-relaxed mb-8">
                    {room.description}
                  </p>
                )}

                {/* Key Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-gray-100/60">
                  <div>
                    <p className="text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-2">Capacity</p>
                    <p className="text-[21px] font-semibold text-gray-900">
                      {room.room_type.max_occupancy}
                    </p>
                  </div>
                  <div>
                    <p className="text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-2">
                      {room.room_type.name.includes('Family Room') ? 'Quad Price' : 'Double Price'}
                    </p>
                    <p className="text-[21px] font-semibold text-gray-900">
                      ₹{room.room_type.base_price.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[13px] text-gray-500 font-light">per night</p>
                  </div>
                  <div>
                    <p className="text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-2">Type</p>
                    <p className="text-[17px] font-medium text-gray-900">{room.room_type.name}</p>
                  </div>
                  <div>
                    <p className="text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-2">Status</p>
                    <span className={`inline-block px-3 py-1.5 rounded-xl text-[13px] font-medium ${
                      room.is_active
                        ? 'bg-emerald-50/80 text-emerald-700 border border-emerald-200/60'
                        : 'bg-rose-50/80 text-rose-700 border border-rose-200/60'
                    }`}>
                      {room.is_active ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>

                {/* Additional Pricing Information */}
                {(room.room_type.extra_adult_price || room.room_type.child_price) && (
                  <div className="mt-6 pt-6 border-t border-gray-100/60">
                    <p className="text-[15px] text-gray-500 uppercase tracking-wide font-medium mb-4">Additional Pricing</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {room.room_type.extra_adult_price && (
                        <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100/60">
                          <p className="text-[13px] text-gray-600 font-light mb-1">Extra Adult</p>
                          <p className="text-[19px] font-semibold text-gray-900">
                            ₹{room.room_type.extra_adult_price.toLocaleString('en-IN')}
                            <span className="text-[14px] font-normal text-gray-600">/night</span>
                          </p>
                        </div>
                      )}
                      {room.room_type.child_price && (
                        <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100/60">
                          <p className="text-[13px] text-gray-600 font-light mb-1">Child (0-12 years)</p>
                          <p className="text-[19px] font-semibold text-gray-900">
                            ₹{room.room_type.child_price.toLocaleString('en-IN')}
                            <span className="text-[14px] font-normal text-gray-600">/night</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Amenities Section */}
              {room.amenities && room.amenities.length > 0 && (
                <div
                  className={`bg-white/70 backdrop-blur-2xl rounded-[32px] p-8 md:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/20 transition-all duration-1000 ease-out ${
                    mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: '100ms' }}
                >
                  <h2 className="text-[32px] font-semibold text-gray-900 mb-8 tracking-tight">Amenities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {room.amenities.map((amenity) => (
                      <div
                        key={amenity.id}
                        className="flex items-center space-x-3 p-4 rounded-2xl bg-gray-50/50 hover:bg-gray-100/50 transition-colors duration-300"
                      >
                        {amenity.icon && (
                          <span className="text-2xl">{amenity.icon}</span>
                        )}
                        <span className="text-[17px] text-gray-900 font-light">{amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div
                className={`bg-white/70 backdrop-blur-2xl rounded-[32px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/20 sticky top-8 transition-all duration-1000 ease-out ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '200ms' }}
              >
                <h2 className="text-[28px] font-semibold text-gray-900 mb-6 tracking-tight">Book This Room</h2>
                {isAuthenticated ? (
                  <BookingForm
                    room={room}
                    initialCheckIn={checkIn}
                    initialCheckOut={checkOut}
                  />
                ) : (
                  <div className="space-y-6">
                    <p className="text-[17px] text-gray-600 font-light leading-relaxed">
                      Please login to book this room.
                    </p>
                    <button
                      onClick={() => router.push('/login')}
                      className="w-full px-6 py-4 bg-gray-900 text-white text-[17px] font-semibold rounded-2xl hover:bg-gray-800 active:scale-[0.98] transition-all duration-300 ease-out shadow-lg shadow-black/10"
                    >
                      Login to Book
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
