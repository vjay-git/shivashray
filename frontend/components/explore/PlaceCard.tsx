'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Place } from '@/types';
import { useState } from 'react';

interface PlaceCardProps {
  place: Place;
}

export function PlaceCard({ place }: PlaceCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      href={`/explore/${place.slug}`}
      className="group block w-full"
      aria-label={`Learn more about ${place.name}`}
    >
      <article className="relative overflow-hidden transition-all duration-500 ease-out hover:opacity-95">
        {/* Image Container */}
        {place.imageUrl && !imageError ? (
          <div className="relative w-full aspect-[4/3] overflow-hidden bg-muted">
            <Image
              src={place.imageUrl}
              alt={place.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent dark:from-black/70 dark:via-black/30" />
          </div>
        ) : (
          <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center">
            <div className="text-muted-foreground text-4xl">⛰️</div>
          </div>
        )}

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 lg:p-10">
          <div className="space-y-3">
            {/* Place Name */}
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-light text-white leading-tight tracking-tight">
              {place.name}
            </h3>

            {/* Description */}
            <p className="text-base md:text-lg text-white/90 font-light leading-relaxed max-w-2xl">
              {place.description}
            </p>

            {/* Distance/Travel Hint */}
            {(place.distance || place.travelHint) && (
              <div className="flex items-center gap-4 pt-2 text-sm md:text-base text-white/80 font-light">
                {place.distance && (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {place.distance}
                  </span>
                )}
                {place.travelHint && (
                  <span className="hidden sm:inline">{place.travelHint}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
