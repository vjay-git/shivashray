'use client';

import Link from 'next/link';
import Image from 'next/image';
import { hotelContent } from '@/lib/content/hotel-content';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/kashi_temple.jpg"
          alt="Kashi Vishwanath Temple - Spiritual heritage of Varanasi"
          fill
          priority
          quality={100}
          className="object-cover"
          sizes="100vw"
        />
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Heading - Gradient Text */}
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 50%, #e8e8e8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {hotelContent.name}
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/95 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed font-normal">
            Thoughtfully designed rooms for comfortable stays in the heart of Varanasi
          </p>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Link
              href="/rooms"
              className="inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-4 min-h-[48px] bg-white text-gray-900 text-base sm:text-lg font-semibold rounded-lg sm:rounded-xl transition-colors duration-200 hover:bg-gray-50 active:bg-gray-100 shadow-lg"
            >
              Book Your Stay
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
