'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Place } from '@/types';
import { getPlaceBySlug } from '@/lib/data/places';

export default function PlaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [place, setPlace] = useState<Place | null>(null);
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setMounted(true);
    const slug = params.slug as string;
    const foundPlace = getPlaceBySlug(slug);
    
    if (!foundPlace) {
      router.push('/explore');
      return;
    }
    
    setPlace(foundPlace);
  }, [params.slug, router]);

  if (!place) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-2 border-muted-foreground/20 border-t-foreground rounded-full animate-spin"></div>
          <p className="text-base text-muted-foreground font-light">Loading place details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image Section */}
      <section className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
        {place.imageUrl && !imageError ? (
          <>
            <Image
              src={place.imageUrl}
              alt={place.name}
              fill
              className="object-cover"
              priority
              sizes="100vw"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent dark:via-background/80" />
          </>
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <div className="text-muted-foreground text-6xl">⛰️</div>
          </div>
        )}

        {/* Back Button */}
        <div className="absolute top-6 left-6 md:top-8 md:left-8 z-10">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm text-foreground rounded-lg hover:bg-background/90 transition-all duration-300 font-light text-sm md:text-base"
            aria-label="Back to explore"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Explore
          </Link>
        </div>

        {/* Place Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-12">
          <div
            className={`transition-all duration-1000 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground leading-tight tracking-tight mb-4">
              {place.name}
            </h1>
            {place.distance && (
              <div className="flex items-center gap-2 text-base md:text-lg text-muted-foreground font-light">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {place.distance} from the hotel
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-6 md:px-8 lg:px-12 py-12 md:py-16 lg:py-24">
        <div className="max-w-4xl mx-auto space-y-8 md:space-y-12">
          {/* Introduction */}
          <div
            className={`transition-all duration-1000 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <p className="text-lg md:text-xl lg:text-2xl text-foreground font-light leading-relaxed">
              {place.content.introduction}
            </p>
          </div>

          {/* Cultural Context */}
          {place.content.culturalContext && (
            <div
              className={`transition-all duration-1000 ease-out ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              <h2 className="text-2xl md:text-3xl font-light text-foreground mb-4 md:mb-6 tracking-tight">
                Cultural Significance
              </h2>
              <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed">
                {place.content.culturalContext}
              </p>
            </div>
          )}

          {/* Spiritual Context */}
          {place.content.spiritualContext && (
            <div
              className={`transition-all duration-1000 ease-out ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              <h2 className="text-2xl md:text-3xl font-light text-foreground mb-4 md:mb-6 tracking-tight">
                Spiritual Significance
              </h2>
              <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed">
                {place.content.spiritualContext}
              </p>
            </div>
          )}

          {/* Context (General) */}
          {place.content.context && (
            <div
              className={`transition-all duration-1000 ease-out ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed">
                {place.content.context}
              </p>
            </div>
          )}

          {/* How to Reach */}
          {place.content.howToReach && (
            <div
              className={`pt-8 md:pt-12 border-t border-border transition-all duration-1000 ease-out ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '800ms' }}
            >
              <h2 className="text-2xl md:text-3xl font-light text-foreground mb-4 md:mb-6 tracking-tight">
                How to Reach
              </h2>
              <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed">
                {place.content.howToReach}
              </p>
            </div>
          )}

          {/* Travel Hint */}
          {place.travelHint && (
            <div className="pt-8 md:pt-12">
              <div className="bg-muted/50 rounded-lg p-6 md:p-8">
                <p className="text-base md:text-lg text-foreground font-light leading-relaxed">
                  <span className="font-normal">Travel Tip:</span> {place.travelHint}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Navigation Footer */}
      <section className="px-6 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-24">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-base md:text-lg text-muted-foreground hover:text-foreground transition-colors duration-300 font-light"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Discover more places
          </Link>
        </div>
      </section>
    </div>
  );
}
