'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Booking } from '@/types';
import { useAuthStore } from '@/lib/store';
import { format } from 'date-fns';

// BF-10: mirrors the backend state machine — only show buttons the backend will accept
const VALID_BOOKING_TRANSITIONS: Record<string, string[]> = {
  pending:    ['confirmed', 'cancelled'],
  confirmed:  ['checked_in', 'cancelled', 'no_show'],
  checked_in: ['checked_out'],
  checked_out: [],
  cancelled:  [],
  no_show:    [],
};

const VALID_PAYMENT_TRANSITIONS: Record<string, string[]> = {
  pending:  ['paid'],
  paid:     ['refunded'],
  refunded: [],
};

export default function AdminBookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [actionError, setActionError] = useState('');
  const [markPaidDialog, setMarkPaidDialog] = useState(false);
  const [paymentRef, setPaymentRef] = useState('');
  const updatingRef = useRef(false); // PAY-12: synchronous guard against double-click

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

  const doUpdate = async (payload: Record<string, string>) => {
    if (updatingRef.current) return; // PAY-12
    updatingRef.current = true;
    setUpdating(true);
    setActionError('');
    try {
      await api.patch(`/admin/bookings/${params.id}`, payload);
      await fetchBooking();
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (detail?.code === 'PAYMENT_PENDING') {
        setActionError('Payment not confirmed — mark as paid before checking in.');
      } else if (typeof detail === 'string') {
        setActionError(detail);
      } else {
        setActionError('Failed to update booking. Please try again.');
      }
    } finally {
      setUpdating(false);
      updatingRef.current = false;
    }
  };

  const updateBookingStatus = (targetStatus: string) => doUpdate({ status: targetStatus });

  const confirmMarkAsPaid = async () => {
    setMarkPaidDialog(false);
    await doUpdate({
      payment_status: 'paid',
      ...(paymentRef.trim() ? { payment_reference: paymentRef.trim() } : {}),
    });
    setPaymentRef('');
  };

  const updatePaymentStatus = (targetPayment: string) => {
    if (targetPayment === 'paid') {
      setMarkPaidDialog(true); // PAY-16: require confirmation + reference
    } else {
      doUpdate({ payment_status: targetPayment });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':   return 'bg-emerald-50/80 text-emerald-700 border-emerald-200/60';
      case 'checked_in':  return 'bg-blue-50/80 text-blue-700 border-blue-200/60';
      case 'checked_out': return 'bg-slate-50/80 text-slate-700 border-slate-200/60';
      case 'cancelled':   return 'bg-rose-50/80 text-rose-700 border-rose-200/60';
      case 'no_show':     return 'bg-gray-50/80 text-gray-600 border-gray-200/60';
      default:            return 'bg-amber-50/80 text-amber-700 border-amber-200/60';
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
                  <h1 className="text-[28px] font-semibold text-gray-900 tracking-tight font-mono">{booking.booking_ref}</h1>
                  <p className="text-[13px] text-gray-600 font-light mt-0.5">Manage booking details and status</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
          {actionError && (
            <div className="mb-6 bg-rose-50/80 border border-rose-100 rounded-2xl px-5 py-4 flex items-center space-x-3">
              <svg className="w-5 h-5 text-rose-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-[15px] text-rose-800 font-medium">{actionError}</span>
              <button onClick={() => setActionError('')} className="ml-auto text-rose-400 hover:text-rose-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
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
                <p className="text-[15px] text-gray-600 font-light mt-1">Only valid transitions are enabled</p>
              </div>

              <div className="p-8">
                <div className="space-y-4">
                  {/* BF-10: buttons are enabled only when the transition is valid for the current status */}
                  <div>
                    <p className="text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-4">Booking Status</p>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { target: 'confirmed',   label: 'Confirm',    cls: 'bg-emerald-50/80 text-emerald-700 hover:bg-emerald-100/80 border-emerald-200/60' },
                        { target: 'checked_in',  label: 'Check In',   cls: 'bg-blue-50/80 text-blue-700 hover:bg-blue-100/80 border-blue-200/60' },
                        { target: 'checked_out', label: 'Check Out',  cls: 'bg-slate-50/80 text-slate-700 hover:bg-slate-100/80 border-slate-200/60' },
                        { target: 'no_show',     label: 'No Show',    cls: 'bg-gray-50/80 text-gray-600 hover:bg-gray-100/80 border-gray-200/60' },
                        { target: 'cancelled',   label: 'Cancel',     cls: 'bg-rose-50/80 text-rose-700 hover:bg-rose-100/80 border-rose-200/60' },
                      ].map(({ target, label, cls }) => {
                        const allowed = VALID_BOOKING_TRANSITIONS[booking.status] ?? [];
                        const isAllowed = allowed.includes(target);
                        return (
                          <button
                            key={target}
                            onClick={() => updateBookingStatus(target)}
                            disabled={updating || !isAllowed}
                            className={`px-5 py-2.5 rounded-xl text-[15px] font-medium active:scale-[0.98] transition-all duration-300 ease-out disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 border ${cls}`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100/60">
                    <p className="text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-4">Payment Status</p>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { target: 'paid',     label: 'Mark as Paid',     cls: 'bg-emerald-50/80 text-emerald-700 hover:bg-emerald-100/80 border-emerald-200/60' },
                        { target: 'refunded', label: 'Mark as Refunded', cls: 'bg-slate-50/80 text-slate-700 hover:bg-slate-100/80 border-slate-200/60' },
                      ].map(({ target, label, cls }) => {
                        const allowed = VALID_PAYMENT_TRANSITIONS[booking.payment_status] ?? [];
                        const isAllowed = allowed.includes(target);
                        return (
                          <button
                            key={target}
                            onClick={() => updatePaymentStatus(target)}
                            disabled={updating || !isAllowed}
                            className={`px-5 py-2.5 rounded-xl text-[15px] font-medium active:scale-[0.98] transition-all duration-300 ease-out disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 border ${cls}`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PAY-16: Mark as Paid confirmation modal */}
      {markPaidDialog && booking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-6">
          <div className="bg-white rounded-[28px] shadow-2xl max-w-sm w-full p-8 space-y-6">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-[20px] font-semibold text-gray-900 mb-1">Confirm Payment</h3>
              <p className="text-[15px] text-gray-600 font-light">
                {booking.guest_name} · {booking.booking_ref}
              </p>
              <p className="text-[24px] font-semibold text-gray-900 mt-2">
                ₹{booking.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <label className="block text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-2">
                Reference <span className="normal-case text-gray-400 font-normal">(UPI/cash receipt — optional)</span>
              </label>
              <input
                type="text"
                value={paymentRef}
                onChange={e => setPaymentRef(e.target.value)}
                placeholder="e.g. UPI/123456789012"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-[15px] text-gray-900 focus:outline-none focus:border-[#007aff]/40 transition-colors"
              />
            </div>
            <div className="space-y-3">
              <button
                onClick={confirmMarkAsPaid}
                className="w-full px-6 py-3.5 bg-emerald-600 text-white text-[15px] font-semibold rounded-2xl hover:bg-emerald-700 transition-colors"
              >
                Mark as Paid
              </button>
              <button
                onClick={() => { setMarkPaidDialog(false); setPaymentRef(''); }}
                className="w-full px-6 py-3.5 bg-gray-100 text-gray-700 text-[15px] font-medium rounded-2xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
