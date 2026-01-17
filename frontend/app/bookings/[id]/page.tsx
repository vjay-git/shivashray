'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Booking } from '@/types';
import { useAuthStore } from '@/lib/store';
import { format } from 'date-fns';

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchBooking();
  }, [params.id, isAuthenticated, router]);

  const fetchBooking = async () => {
    try {
      const response = await api.get(`/bookings/${params.id}`);
      setBooking(response.data);
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-50/60 text-emerald-700';
      case 'refunded':
        return 'bg-slate-50/60 text-slate-700';
      default:
        return 'bg-amber-50/60 text-amber-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
          <p className="text-[15px] text-gray-600 font-light">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="text-center">
          <p className="text-[17px] text-gray-600 font-light mb-4">Booking not found</p>
          <button
            onClick={() => router.push('/bookings')}
            className="px-6 py-3 bg-gray-900 text-white text-[15px] font-medium rounded-2xl hover:bg-gray-800 active:scale-[0.98] transition-all duration-300 ease-out"
          >
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  const checkInDate = new Date(booking.check_in_date);
  const checkOutDate = new Date(booking.check_out_date);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

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
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white flex items-center justify-center transition-all duration-300 ease-out active:scale-95 shadow-lg"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-[34px] font-semibold text-gray-900 tracking-tight">Booking Details</h1>
              <p className="text-[15px] text-gray-600 font-light mt-0.5">Booking #{booking.id}</p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 lg:px-8 pb-24">
          <div 
            className={`transition-all duration-700 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/70 backdrop-blur-2xl rounded-[24px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/20">
                <p className="text-[13px] text-gray-600 font-medium mb-2 uppercase tracking-wide">Booking Status</p>
                <span className={`px-4 py-2 rounded-xl text-[15px] font-medium border ${getStatusColor(booking.status)}`}>
                  {booking.status.replace('_', ' ')}
                </span>
              </div>

              <div className="bg-white/70 backdrop-blur-2xl rounded-[24px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/20">
                <p className="text-[13px] text-gray-600 font-medium mb-2 uppercase tracking-wide">Payment Status</p>
                <span className={`px-4 py-2 rounded-xl text-[15px] font-medium ${getPaymentStatusColor(booking.payment_status)}`}>
                  {booking.payment_status}
                </span>
              </div>
            </div>

            {/* Booking Details */}
            <div className="bg-white/70 backdrop-blur-2xl rounded-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/20 overflow-hidden mb-8">
              <div className="px-8 py-6 border-b border-gray-100/60">
                <h2 className="text-[24px] font-semibold text-gray-900 tracking-tight">Booking Information</h2>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-2">Check-in</p>
                    <p className="text-[19px] text-gray-900 font-medium">
                      {format(checkInDate, 'EEEE, MMMM d, yyyy')}
                    </p>
                    <p className="text-[15px] text-gray-600 font-light mt-1">
                      {format(checkInDate, 'h:mm a')}
                    </p>
                  </div>

                  <div>
                    <p className="text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-2">Check-out</p>
                    <p className="text-[19px] text-gray-900 font-medium">
                      {format(checkOutDate, 'EEEE, MMMM d, yyyy')}
                    </p>
                    <p className="text-[15px] text-gray-600 font-light mt-1">
                      {format(checkOutDate, 'h:mm a')}
                    </p>
                  </div>

                  <div>
                    <p className="text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-2">Duration</p>
                    <p className="text-[19px] text-gray-900 font-medium">
                      {nights} {nights === 1 ? 'night' : 'nights'}
                    </p>
                  </div>

                  <div>
                    <p className="text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-2">Number of Guests</p>
                    <p className="text-[19px] text-gray-900 font-medium">{booking.number_of_guests}</p>
                  </div>

                  <div className="md:col-span-2 pt-4 border-t border-gray-100/60">
                    <p className="text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-2">Total Amount</p>
                    <p className="text-[32px] font-semibold text-gray-900 tracking-tight">
                      ₹{booking.total_amount.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Information */}
            <div className="bg-white/70 backdrop-blur-2xl rounded-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/20 overflow-hidden mb-8">
              <div className="px-8 py-6 border-b border-gray-100/60">
                <h2 className="text-[24px] font-semibold text-gray-900 tracking-tight">Guest Information</h2>
              </div>

              <div className="p-8">
                <div className="space-y-6">
                  <div>
                    <p className="text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-2">Name</p>
                    <p className="text-[19px] text-gray-900 font-medium">{booking.guest_name}</p>
                  </div>

                  <div>
                    <p className="text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-2">Email</p>
                    <p className="text-[17px] text-gray-900 font-light">{booking.guest_email}</p>
                  </div>

                  {booking.guest_phone && (
                    <div>
                      <p className="text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-2">Phone</p>
                      <p className="text-[17px] text-gray-900 font-light">{booking.guest_phone}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Special Requests */}
            {booking.special_requests && (
              <div className="bg-white/70 backdrop-blur-2xl rounded-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/20 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100/60">
                  <h2 className="text-[24px] font-semibold text-gray-900 tracking-tight">Special Requests</h2>
                </div>

                <div className="p-8">
                  <p className="text-[17px] text-gray-700 font-light leading-relaxed">{booking.special_requests}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
