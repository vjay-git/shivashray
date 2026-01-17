'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Booking } from '@/types';
import { useAuthStore } from '@/lib/store';
import { format } from 'date-fns';

export default function AdminBookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchBooking();
  }, [params.id, isAuthenticated, user, router]);

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

  const updateBookingStatus = async (status: string, paymentStatus?: string) => {
    setUpdating(true);
    try {
      const updateData: any = { status };
      if (paymentStatus) {
        updateData.payment_status = paymentStatus;
      }
      await api.patch(`/admin/bookings/${params.id}`, updateData);
      await fetchBooking();
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking');
    } finally {
      setUpdating(false);
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
          <p className="text-[15px] text-gray-600 font-light">Loading booking...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="text-center">
          <p className="text-[17px] text-gray-600 font-light">Booking not found</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-[15px] text-[#007aff] hover:text-[#0051d5] transition-colors"
          >
            Go back
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
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-white/20 shadow-sm">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.back()}
                  className="w-10 h-10 rounded-full bg-gray-100/50 hover:bg-gray-200/50 flex items-center justify-center transition-all duration-300 ease-out active:scale-95"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-[28px] font-semibold text-gray-900 tracking-tight">Booking #{booking.id}</h1>
                  <p className="text-[13px] text-gray-600 font-light mt-0.5">Manage booking details and status</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
          <div 
            className={`transition-all duration-700 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/70 backdrop-blur-2xl rounded-[24px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/20">
                <p className="text-[13px] text-gray-600 font-medium mb-2 uppercase tracking-wide">Booking Status</p>
                <div className="flex items-center justify-between">
                  <span className={`px-4 py-2 rounded-xl text-[15px] font-medium border ${getStatusColor(booking.status)}`}>
                    {booking.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-2xl rounded-[24px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/20">
                <p className="text-[13px] text-gray-600 font-medium mb-2 uppercase tracking-wide">Payment Status</p>
                <div className="flex items-center justify-between">
                  <span className={`px-4 py-2 rounded-xl text-[15px] font-medium ${getPaymentStatusColor(booking.payment_status)}`}>
                    {booking.payment_status}
                  </span>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="bg-white/70 backdrop-blur-2xl rounded-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/20 overflow-hidden mb-8">
              <div className="px-8 py-6 border-b border-gray-100/60">
                <h2 className="text-[24px] font-semibold text-gray-900 tracking-tight">Booking Details</h2>
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
              <div className="bg-white/70 backdrop-blur-2xl rounded-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/20 overflow-hidden mb-8">
                <div className="px-8 py-6 border-b border-gray-100/60">
                  <h2 className="text-[24px] font-semibold text-gray-900 tracking-tight">Special Requests</h2>
                </div>

                <div className="p-8">
                  <p className="text-[17px] text-gray-700 font-light leading-relaxed">{booking.special_requests}</p>
                </div>
              </div>
            )}

            {/* Status Management */}
            <div className="bg-white/70 backdrop-blur-2xl rounded-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/20 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-100/60">
                <h2 className="text-[24px] font-semibold text-gray-900 tracking-tight">Manage Status</h2>
                <p className="text-[15px] text-gray-600 font-light mt-1">Update booking and payment status</p>
              </div>

              <div className="p-8">
                <div className="space-y-4">
                  <div>
                    <p className="text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-4">Booking Status</p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => updateBookingStatus('confirmed')}
                        disabled={updating || booking.status === 'confirmed'}
                        className="px-5 py-2.5 bg-emerald-50/80 text-emerald-700 rounded-xl text-[15px] font-medium hover:bg-emerald-100/80 active:scale-[0.98] transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 border border-emerald-200/60"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateBookingStatus('checked_in')}
                        disabled={updating || booking.status === 'checked_in'}
                        className="px-5 py-2.5 bg-blue-50/80 text-blue-700 rounded-xl text-[15px] font-medium hover:bg-blue-100/80 active:scale-[0.98] transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 border border-blue-200/60"
                      >
                        Check In
                      </button>
                      <button
                        onClick={() => updateBookingStatus('checked_out')}
                        disabled={updating || booking.status === 'checked_out'}
                        className="px-5 py-2.5 bg-slate-50/80 text-slate-700 rounded-xl text-[15px] font-medium hover:bg-slate-100/80 active:scale-[0.98] transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 border border-slate-200/60"
                      >
                        Check Out
                      </button>
                      <button
                        onClick={() => updateBookingStatus('cancelled')}
                        disabled={updating || booking.status === 'cancelled'}
                        className="px-5 py-2.5 bg-rose-50/80 text-rose-700 rounded-xl text-[15px] font-medium hover:bg-rose-100/80 active:scale-[0.98] transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 border border-rose-200/60"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100/60">
                    <p className="text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-4">Payment Status</p>
                    <button
                      onClick={() => updateBookingStatus(booking.status, 'paid')}
                      disabled={updating || booking.payment_status === 'paid'}
                      className="px-5 py-2.5 bg-emerald-50/80 text-emerald-700 rounded-xl text-[15px] font-medium hover:bg-emerald-100/80 active:scale-[0.98] transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 border border-emerald-200/60"
                    >
                      Mark as Paid
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
