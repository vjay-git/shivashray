'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Booking } from '@/types';
import { format } from 'date-fns';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending Confirmation',
  confirmed: 'Confirmed',
  checked_in: 'Checked In',
  checked_out: 'Checked Out',
  cancelled: 'Cancelled',
  no_show: 'No Show',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-50/80 text-amber-700 border-amber-200/60',
  confirmed: 'bg-emerald-50/80 text-emerald-700 border-emerald-200/60',
  checked_in: 'bg-blue-50/80 text-blue-700 border-blue-200/60',
  checked_out: 'bg-slate-50/80 text-slate-700 border-slate-200/60',
  cancelled: 'bg-rose-50/80 text-rose-700 border-rose-200/60',
  no_show: 'bg-gray-50/80 text-gray-600 border-gray-200/60',
};

export default function BookingConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchBooking = async () => {
      try {
        const response = await api.get(`/bookings/${params.id}`);
        setBooking(response.data);
        // BF-08: clear the draft now that the booking is confirmed
        sessionStorage.removeItem(`booking_draft_${response.data.room_id}`);
      } catch {
        setError('Booking not found or you do not have access to view it.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
          <p className="text-[15px] text-gray-600 font-light">Loading your booking…</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-rose-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-[17px] text-gray-700 font-medium mb-2">Booking not found</p>
          <p className="text-[15px] text-gray-500 font-light mb-6">{error}</p>
          <Link href="/" className="text-[15px] text-[#007aff] hover:text-[#0051d5] font-medium transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const checkInDate = new Date(booking.check_in_date);
  const checkOutDate = new Date(booking.check_out_date);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  const isSuccess = booking.status === 'pending' || booking.status === 'confirmed';

  const handleCopyRef = async () => {
    try {
      await navigator.clipboard.writeText(booking.booking_ref);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — fail silently
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#007aff]/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-emerald-400/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        <div
          className={`transition-all duration-700 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Success / Status Banner */}
          <div className="text-center mb-10">
            {isSuccess ? (
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-50 flex items-center justify-center shadow-[0_0_0_8px_rgba(16,185,129,0.08)]">
                <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-50 flex items-center justify-center">
                <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
            <h1 className="text-[32px] font-semibold text-gray-900 tracking-tight mb-2">
              {isSuccess ? 'Booking Received!' : 'Booking Status'}
            </h1>
            <p className="text-[17px] text-gray-500 font-light">
              {isSuccess
                ? 'Your reservation is being processed. We will reach out to confirm.'
                : 'Here are the details for your booking.'}
            </p>
          </div>

          {/* Booking Reference Card */}
          <div className="bg-gray-900 rounded-[28px] p-8 mb-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
            <p className="text-[13px] text-gray-400 uppercase tracking-widest font-medium mb-3">Booking Reference</p>
            <div className="flex items-center justify-center gap-3">
              <p className="text-[36px] font-semibold text-white tracking-wider font-mono">{booking.booking_ref}</p>
              <button
                type="button"
                onClick={handleCopyRef}
                className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center transition-all"
                aria-label={copied ? 'Copied!' : 'Copy booking reference'}
              >
                {copied ? (
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
            {copied && (
              <p className="text-[12px] text-emerald-400 font-light mt-1">Copied to clipboard</p>
            )}
            <div className="mt-4">
              <span className={`inline-block px-4 py-1.5 rounded-full text-[13px] font-medium border ${STATUS_COLORS[booking.status] || STATUS_COLORS.pending}`}>
                {STATUS_LABELS[booking.status] || booking.status}
              </span>
            </div>
          </div>

          {/* Booking Details Card */}
          <div className="bg-white/70 backdrop-blur-2xl rounded-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/20 overflow-hidden mb-6">
            <div className="px-8 py-6 border-b border-gray-100/60">
              <h2 className="text-[20px] font-semibold text-gray-900 tracking-tight">Stay Details</h2>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-1">Check-in</p>
                  <p className="text-[17px] text-gray-900 font-medium">{format(checkInDate, 'EEE, MMM d, yyyy')}</p>
                  <p className="text-[13px] text-gray-500 font-light mt-0.5">from 12:00 PM</p>
                </div>
                <div>
                  <p className="text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-1">Check-out</p>
                  <p className="text-[17px] text-gray-900 font-medium">{format(checkOutDate, 'EEE, MMM d, yyyy')}</p>
                  <p className="text-[13px] text-gray-500 font-light mt-0.5">by 11:00 AM</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100/60">
                <div>
                  <p className="text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-1">Duration</p>
                  <p className="text-[17px] text-gray-900 font-medium">{nights} {nights === 1 ? 'night' : 'nights'}</p>
                </div>
                <div>
                  <p className="text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-1">Guests</p>
                  <p className="text-[17px] text-gray-900 font-medium">
                    {booking.number_of_adults ?? booking.number_of_guests} adult{(booking.number_of_adults ?? booking.number_of_guests) !== 1 ? 's' : ''}
                    {booking.number_of_children ? `, ${booking.number_of_children} child${booking.number_of_children !== 1 ? 'ren' : ''}` : ''}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100/60 space-y-2">
                {booking.tax_amount > 0 && (
                  <>
                    <div className="flex justify-between items-center">
                      <p className="text-[13px] text-gray-500 font-light">Pre-tax subtotal</p>
                      <p className="text-[15px] text-gray-700">₹{(booking.total_amount - booking.tax_amount).toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-[13px] text-gray-500 font-light">GST ({(booking.tax_rate * 100).toFixed(0)}%)</p>
                      <p className="text-[15px] text-gray-700">₹{booking.tax_amount.toLocaleString('en-IN')}</p>
                    </div>
                  </>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-gray-100/60">
                  <p className="text-[15px] text-gray-600 font-medium">Total (incl. GST)</p>
                  <div className="text-right">
                    <p className="text-[28px] font-semibold text-gray-900 tracking-tight">
                      ₹{booking.total_amount.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[13px] text-gray-500 font-light capitalize mt-0.5">
                      Payment: {booking.payment_status}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Guest Information Card */}
          <div className="bg-white/70 backdrop-blur-2xl rounded-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/20 overflow-hidden mb-8">
            <div className="px-8 py-6 border-b border-gray-100/60">
              <h2 className="text-[20px] font-semibold text-gray-900 tracking-tight">Guest Details</h2>
            </div>

            <div className="p-8 space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-[15px] text-gray-500 font-light">Name</p>
                <p className="text-[15px] text-gray-900 font-medium">{booking.guest_name}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-[15px] text-gray-500 font-light">Email</p>
                <p className="text-[15px] text-gray-900 font-medium">{booking.guest_email}</p>
              </div>
              {booking.guest_phone && (
                <div className="flex justify-between items-center">
                  <p className="text-[15px] text-gray-500 font-light">Phone</p>
                  <p className="text-[15px] text-gray-900 font-medium">{booking.guest_phone}</p>
                </div>
              )}
              {booking.special_requests && (
                <div className="pt-4 border-t border-gray-100/60">
                  <p className="text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-2">Special Requests</p>
                  <p className="text-[15px] text-gray-700 font-light leading-relaxed">{booking.special_requests}</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="text-center space-y-3">
            <p className="text-[13px] text-gray-500 font-light">
              Save your booking reference <span className="font-semibold text-gray-700">{booking.booking_ref}</span> for check-in.
            </p>
            <Link
              href="/"
              className="inline-block w-full px-6 py-4 bg-gray-900 text-white text-[17px] font-semibold rounded-2xl hover:bg-gray-800 active:scale-[0.98] transition-all duration-300 ease-out text-center shadow-lg shadow-black/10"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
