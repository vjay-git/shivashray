'use client';

import { useEffect } from 'react';
import { getBookingEngineUrl } from '@/lib/booking-engine';

export default function LoginPage() {
  const bookingEngineUrl = getBookingEngineUrl();

  useEffect(() => {
    window.location.href = bookingEngineUrl;
  }, [bookingEngineUrl]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <p className="text-[18px] text-slate-700 dark:text-slate-300 font-light mb-4">
          Redirecting you to our booking engine…
        </p>
        <a
          href={bookingEngineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 py-3 rounded-2xl font-semibold text-[15px] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: '#D4AF37', color: '#0F1115' }}
        >
          Open Stayflexi
        </a>
        </div>
      </div>
  );
}


