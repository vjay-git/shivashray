'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { hotelContent } from '@/lib/content/hotel-content';

export function CTA() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="py-24 md:py-32 bg-[#f5f5f7] relative overflow-hidden">
      {/* Subtle Background Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#007aff]/2 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#5856d6]/2 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <div
          className={`transition-all duration-1000 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-[28px] md:text-[32px] text-gray-900 font-light leading-relaxed mb-8">
            We invite you to experience a place where tradition meets tranquility, where every moment is designed to honor your journey.
          </p>
          <Link
            href="/rooms"
            className="inline-block px-8 py-4 bg-gray-900 text-white text-[17px] font-semibold rounded-2xl hover:bg-gray-800 active:scale-[0.98] transition-all duration-300 ease-out shadow-lg shadow-black/10"
          >
            Begin Your Journey
          </Link>
        </div>
      </div>
    </section>
  );
}
