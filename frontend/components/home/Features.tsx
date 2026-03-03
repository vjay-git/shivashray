'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const PHOTOS = [
  { src: '/kashi_temple.jpg',                                                                      alt: 'Kashi Vishwanath Temple – 2 min walk' },
  { src: '/shivashray_images/Super Deluxe Room/a0870948-f8d6-4c25-a834-a8d5615cee38.jpg',         alt: 'Super Deluxe Room' },
  { src: '/shivashray_images/Deluxe Room/bdc6f12d-a7d6-49a2-8e3c-2fdb2621f5c2.jpg',              alt: 'Deluxe Room' },
  { src: '/shivashray_images/Super Deluxe Room/63e98d7a-cc99-46c8-bf34-639f2e82cf22.jpg',         alt: 'Super Deluxe Room – Mirror View' },
  { src: '/shivashray_images/Family Room/e87a107d-3ead-4bca-b6a5-c6eec45e912f.jpg',              alt: 'Family Room' },
];

export function Features() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <section className="bg-white py-12 md:py-16 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Photos
            </h2>
            <p className="text-gray-500 text-sm mt-1">Rooms, surroundings &amp; iconic Varanasi</p>
          </div>
          <Link
            href="/rooms"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:text-amber-800 underline underline-offset-2"
          >
            View all rooms
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Airbnb-style 5-photo grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 rounded-2xl overflow-hidden h-[340px] sm:h-[420px] md:h-[480px]">

          {/* Large photo – left half */}
          <div
            className="col-span-2 row-span-2 relative cursor-pointer group"
            onClick={() => setLightbox(0)}
          >
            <Image
              src={PHOTOS[0].src}
              alt={PHOTOS[0].alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 50vw, 40vw"
              priority
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            {/* Caption */}
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium">
              {PHOTOS[0].alt}
            </div>
          </div>

          {/* 4 smaller photos – right half (2×2) */}
          {PHOTOS.slice(1).map((photo, i) => (
            <div
              key={i}
              className="relative cursor-pointer group overflow-hidden"
              onClick={() => setLightbox(i + 1)}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
              {/* "Show all" button on last photo */}
              {i === 3 && (
                <div className="absolute inset-0 flex items-end justify-end p-3">
                  <button className="bg-white text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md hover:bg-gray-50 transition-colors">
                    Show all photos
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile "view all" link */}
        <div className="sm:hidden mt-4 text-center">
          <Link href="/rooms" className="text-sm font-semibold text-amber-700 underline underline-offset-2">
            View all rooms →
          </Link>
        </div>
      </div>

      {/* Simple lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[999] bg-black/92 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white"
            onClick={() => setLightbox(null)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative w-full max-w-4xl aspect-[4/3]" onClick={e => e.stopPropagation()}>
            <Image
              src={PHOTOS[lightbox].src}
              alt={PHOTOS[lightbox].alt}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          {/* Prev / Next */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white"
            onClick={e => { e.stopPropagation(); setLightbox((lightbox - 1 + PHOTOS.length) % PHOTOS.length); }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white"
            onClick={e => { e.stopPropagation(); setLightbox((lightbox + 1) % PHOTOS.length); }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      )}
    </section>
  );
}
