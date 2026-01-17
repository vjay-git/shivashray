'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import lordShivaImage from '@/public/lordshiva.jpg';
import { hotelContent } from '@/lib/content/hotel-content';

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/lordshiva.jpg"
          alt="Spiritual serenity in Varanasi"
          fill
          priority
          quality={90}
          className="object-cover"
          sizes="100vw"
        />
        {/* Subtle Dark Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 w-full">
        <div
          className={`text-center transition-all duration-1000 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Main Heading */}
          <h1 className="text-[56px] md:text-[72px] lg:text-[80px] font-semibold mb-6 leading-[1.1] text-white tracking-tight">
            {hotelContent.name}
          </h1>

          {/* Subheading */}
          <p className="text-[21px] md:text-[24px] mb-12 text-white/90 max-w-2xl mx-auto leading-relaxed font-light">
            {hotelContent.description}
          </p>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Link
              href="/rooms"
              className="px-8 py-4 bg-white text-gray-900 text-[17px] font-semibold rounded-2xl hover:bg-gray-50 active:scale-[0.98] transition-all duration-300 ease-out shadow-lg shadow-black/20"
            >
              {hotelContent.marketing.hero.cta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
