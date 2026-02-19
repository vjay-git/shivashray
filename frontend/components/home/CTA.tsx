'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { hotelContent } from '@/lib/content/hotel-content';
import { getBookingEngineUrl } from '@/lib/booking-engine';

export function CTA() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="py-16 md:py-20 bg-[#F5F1E8] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <div
          className={`transition-all duration-1000 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-[20px] md:text-[22px] text-[#0E1A2B] font-normal leading-relaxed mb-8 max-w-2xl mx-auto">
            Ready to book? We look forward to welcoming you.
          </p>
          <a
            href={getBookingEngineUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 min-h-[52px] bg-[#C6A75E] text-[#0E1A2B] text-base font-semibold rounded-[12px] transition-all duration-300 hover:bg-[#D4AF37] hover:shadow-[0_12px_40px_rgba(198,167,94,0.3)] active:scale-[0.98]"
          >
            Book on Stayflexi
          </a>
        </div>
      </div>
    </section>
  );
}
