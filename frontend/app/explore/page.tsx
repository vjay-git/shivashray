'use client';

import { useState, useEffect } from 'react';
import { Place, PlaceCategory } from '@/types';
import { places, getPlacesByCategory } from '@/lib/data/places';
import { ConstellationExploration } from '@/components/explore/ConstellationExploration';
import { categories } from '@/lib/data/places';
import { PremiumBackground } from '@/components/layout/PremiumBackground';

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | undefined>(undefined);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>(places);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setFilteredPlaces(getPlacesByCategory(selectedCategory));
  }, [selectedCategory]);

  return (
    <PremiumBackground variant="explore">
      {/* Opening Section - Mobile Optimized */}
      <section className="relative py-10 md:py-16 lg:py-20 px-4 md:px-8 lg:px-12 overflow-hidden">
        {/* Decorative design element - center mandala */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none opacity-[0.015] dark:opacity-[0.025] hidden md:block">
          <style jsx>{`
            @keyframes sacredRotate {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
            @keyframes sacredBreath {
              0%, 100% {
                opacity: 0.015;
                transform: scale(1);
              }
              50% {
                opacity: 0.025;
                transform: scale(1.05);
              }
            }
            .mandala-outer {
              animation: sacredRotate 120s linear infinite;
            }
            .mandala-inner {
              animation: sacredRotate 80s linear infinite reverse;
            }
            .mandala-container {
              animation: sacredBreath 15s ease-in-out infinite;
            }
          `}</style>
          <div className="mandala-container w-full h-full">
            <svg 
              viewBox="0 0 200 200" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <g className="mandala-outer">
                {/* Sacred lotus-inspired pattern - outer layer */}
                <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="0.5" className="text-slate-900 dark:text-slate-100" />
                <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="0.5" className="text-slate-900 dark:text-slate-100" />
                {/* Petals - outer */}
                <ellipse cx="100" cy="30" rx="8" ry="20" stroke="currentColor" strokeWidth="0.5" className="text-slate-900 dark:text-slate-100" />
                <ellipse cx="100" cy="170" rx="8" ry="20" stroke="currentColor" strokeWidth="0.5" className="text-slate-900 dark:text-slate-100" />
                <ellipse cx="30" cy="100" rx="20" ry="8" stroke="currentColor" strokeWidth="0.5" className="text-slate-900 dark:text-slate-100" />
                <ellipse cx="170" cy="100" rx="20" ry="8" stroke="currentColor" strokeWidth="0.5" className="text-slate-900 dark:text-slate-100" />
                <ellipse cx="55" cy="55" rx="8" ry="20" stroke="currentColor" strokeWidth="0.5" transform="rotate(-45 55 55)" className="text-slate-900 dark:text-slate-100" />
                <ellipse cx="145" cy="145" rx="8" ry="20" stroke="currentColor" strokeWidth="0.5" transform="rotate(-45 145 145)" className="text-slate-900 dark:text-slate-100" />
                <ellipse cx="145" cy="55" rx="8" ry="20" stroke="currentColor" strokeWidth="0.5" transform="rotate(45 145 55)" className="text-slate-900 dark:text-slate-100" />
                <ellipse cx="55" cy="145" rx="8" ry="20" stroke="currentColor" strokeWidth="0.5" transform="rotate(45 55 145)" className="text-slate-900 dark:text-slate-100" />
              </g>
              <g className="mandala-inner">
                {/* Inner layer - counter-rotating */}
                <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="0.5" className="text-slate-900 dark:text-slate-100" />
                <circle cx="100" cy="100" r="30" stroke="currentColor" strokeWidth="0.5" className="text-slate-900 dark:text-slate-100" />
              </g>
            </svg>
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div
            className={`text-center space-y-4 md:space-y-6 lg:space-y-8 transition-all duration-1000 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Decorative line - hidden on mobile */}
            <div className="hidden md:flex items-center justify-center gap-4 mb-2">
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-slate-300 to-slate-300" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400/40" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent via-slate-300 to-slate-300" />
            </div>
            
            {/* Main heading - Mobile optimized */}
            <div className="space-y-3 md:space-y-4 lg:space-y-6">
              <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-slate-900 dark:text-slate-100 leading-[1.1] tracking-[-0.02em] px-2">
                Explore Nearby
              </h1>
              
              {/* Subtitle - Mobile optimized */}
              <p className="text-base md:text-xl lg:text-2xl text-slate-500 dark:text-slate-400 font-light leading-relaxed max-w-3xl mx-auto px-2">
                Just beyond the hotel lies a landscape shaped by nature, history, and devotion.
              </p>
            </div>
            
            {/* Bottom decorative line - hidden on mobile */}
            <div className="hidden md:flex items-center justify-center gap-4 mt-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-slate-200 to-slate-200" />
              <div className="w-1 h-1 rounded-full bg-slate-300/30" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent via-slate-200 to-slate-200" />
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Category Filter - Mobile Optimized */}
      <section className="px-4 md:px-8 lg:px-12 pb-6 md:pb-8 lg:pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Mobile: Horizontal Scroll */}
          <div className="md:hidden overflow-x-auto -mx-4 px-4 pb-2 scrollbar-hide">
            <div 
              className={`flex gap-2 transition-all duration-700 ease-out ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <button
                onClick={() => setSelectedCategory(undefined)}
                className={`px-5 py-3 text-sm font-light transition-all duration-300 rounded-full whitespace-nowrap flex-shrink-0 ${
                  !selectedCategory
                    ? 'text-slate-900 dark:text-slate-100 bg-slate-100/80 dark:bg-slate-800/50 shadow-sm backdrop-blur-sm'
                    : 'text-slate-500 dark:text-slate-400 active:bg-slate-50 dark:active:bg-slate-800/30'
                }`}
                aria-label="Show all places"
              >
                All Places
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id as PlaceCategory)}
                  className={`px-5 py-3 text-sm font-light transition-all duration-300 rounded-full whitespace-nowrap flex-shrink-0 ${
                    selectedCategory === category.id
                      ? 'text-slate-900 dark:text-slate-100 bg-slate-100/80 dark:bg-slate-800/50 shadow-sm backdrop-blur-sm'
                      : 'text-slate-500 dark:text-slate-400 active:bg-slate-50 dark:active:bg-slate-800/30'
                  }`}
                  aria-label={`Filter by ${category.label}`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop: Centered */}
          <div 
            className={`hidden md:flex flex-wrap gap-2 md:gap-3 justify-center transition-all duration-700 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <button
              onClick={() => setSelectedCategory(undefined)}
              className={`px-6 py-3 md:px-8 md:py-3.5 text-sm md:text-base font-light transition-all duration-300 rounded-full ${
                !selectedCategory
                  ? 'text-slate-900 dark:text-slate-100 bg-slate-100/80 dark:bg-slate-800/50 shadow-sm backdrop-blur-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/30'
              }`}
              aria-label="Show all places"
            >
              All Places
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as PlaceCategory)}
                className={`px-6 py-3 md:px-8 md:py-3.5 text-sm md:text-base font-light transition-all duration-300 rounded-full ${
                  selectedCategory === category.id
                    ? 'text-slate-900 dark:text-slate-100 bg-slate-100/80 dark:bg-slate-800/50 shadow-sm backdrop-blur-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                }`}
                aria-label={`Filter by ${category.label}`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Constellation Exploration - Apple White Aesthetic */}
      <section className="relative w-full">
        {filteredPlaces.length > 0 ? (
          <ConstellationExploration places={filteredPlaces} />
        ) : (
          <div className="flex items-center justify-center min-h-[60vh] py-24">
            <div className="text-center">
              <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-light">
                No places found in this category.
              </p>
            </div>
          </div>
        )}
      </section>
    </PremiumBackground>
  );
}
