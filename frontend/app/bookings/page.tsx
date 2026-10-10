'use client';

import Link from 'next/link';

export default function BookingsPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 bg-[#f5f5f7]">
      <div className="text-center max-w-lg space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div>
          <h1 className="text-[28px] font-semibold text-gray-900 tracking-tight mb-2">Your Bookings</h1>
          <p className="text-[16px] text-gray-500 font-light">
            Have a booking reference? Your confirmation was emailed to you after booking.
          </p>
        </div>
        <Link
          href="/rooms"
          className="inline-block px-8 py-3.5 bg-gray-900 text-white text-[15px] font-semibold rounded-2xl hover:bg-gray-800 transition-colors"
        >
          Browse Rooms
        </Link>
      </div>
    </div>
  );
}
