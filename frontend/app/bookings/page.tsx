'use client';

import { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';
import { Booking } from '@/types';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';

export default function BookingsPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [visibleBookings, setVisibleBookings] = useState<Set<number>>(new Set());
  const bookingRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchBookings();
  }, [isAuthenticated, router]);

  useEffect(() => {
    const observers = bookingRefs.current.map((ref, index) => {
      if (!ref) return null;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleBookings((prev) => new Set(prev).add(index));
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
  }, [bookings]);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    try {
      await api.delete(`/bookings/${bookingId}`);
      fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-50/80 text-emerald-700 border-emerald-200/60';
      case 'checked_in':
        return 'bg-blue-50/80 text-blue-700 border-blue-200/60';
      case 'checked_out':
        return 'bg-slate-50/80 text-slate-700 border-slate-200/60';
      case 'cancelled':
        return 'bg-rose-50/80 text-rose-700 border-rose-200/60';
      default:
        return 'bg-amber-50/80 text-amber-700 border-amber-200/60';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
          <p className="text-[15px] text-gray-600 font-light">Loading your bookings...</p>
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
        {/* Header */}
        <div className="max-w-5xl mx-auto px-6 lg:px-8 pt-12 pb-8">
          <div
            className={`transition-all duration-700 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <h1 className="text-[40px] md:text-[48px] font-semibold text-gray-900 mb-2 tracking-tight">My Bookings</h1>
            <p className="text-[17px] text-gray-600 font-light">View and manage your reservations</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 lg:px-8 pb-24">
          {bookings.length === 0 ? (
            <div
              className={`text-center py-32 transition-all duration-700 ease-out ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-gray-100/50 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-[19px] text-gray-600 font-light mb-8">You have no bookings yet.</p>
              <Link
                href="/rooms"
                className="inline-block px-8 py-4 bg-gray-900 text-white text-[17px] font-semibold rounded-2xl hover:bg-gray-800 active:scale-[0.98] transition-all duration-300 ease-out shadow-lg shadow-black/10"
              >
                Browse Rooms
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking, index) => {
                const checkInDate = new Date(booking.check_in_date);
                const checkOutDate = new Date(booking.check_out_date);
                const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

                return (
                  <Link
                    key={booking.id}
                    href={`/bookings/${booking.id}`}
                    ref={(el) => { bookingRefs.current[index] = el as HTMLDivElement | null; }}
                    className={`group block bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-100/60 hover:border-gray-200/80 hover:bg-white/70 hover:shadow-lg transition-all duration-300 ease-out ${
                      visibleBookings.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-xl bg-gray-100/50 flex items-center justify-center">
                              <span className="text-[17px] font-semibold text-gray-700">#{booking.id}</span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-[20px] font-semibold text-gray-900">Booking #{booking.id}</h3>
                              <span className={`px-3 py-1.5 rounded-xl text-[12px] font-medium border ${getStatusColor(booking.status)}`}>
                                {booking.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div>
                            <p className="text-[11px] text-gray-500 uppercase tracking-wide font-medium mb-1">Check-in</p>
                            <p className="text-[15px] text-gray-900 font-medium">
                              {format(checkInDate, 'MMM d, yyyy')}
                            </p>
                          </div>
                          <div>
                            <p className="text-[11px] text-gray-500 uppercase tracking-wide font-medium mb-1">Check-out</p>
                            <p className="text-[15px] text-gray-900 font-medium">
                              {format(checkOutDate, 'MMM d, yyyy')}
                            </p>
                          </div>
                          <div>
                            <p className="text-[11px] text-gray-500 uppercase tracking-wide font-medium mb-1">Duration</p>
                            <p className="text-[15px] text-gray-900 font-medium">
                              {nights} {nights === 1 ? 'night' : 'nights'}
                            </p>
                          </div>
                          <div>
                            <p className="text-[11px] text-gray-500 uppercase tracking-wide font-medium mb-1">Amount</p>
                            <p className="text-[15px] text-gray-900 font-semibold">₹{booking.total_amount.toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-2 ml-6">
                        {booking.status !== 'cancelled' && booking.status !== 'checked_out' && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleCancel(booking.id);
                            }}
                            className="px-4 py-2 bg-rose-50/80 text-rose-700 rounded-xl text-[13px] font-medium hover:bg-rose-100/80 active:scale-[0.98] transition-all duration-300 ease-out border border-rose-200/60"
                          >
                            Cancel
                          </button>
                        )}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
