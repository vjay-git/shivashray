'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Place, PlaceCategory } from '@/types';
import { places, getPlacesByCategory } from '@/lib/data/places';
import { ConstellationExploration } from '@/components/explore/ConstellationExploration';
import { categories } from '@/lib/data/places';
import { PremiumBackground } from '@/components/layout/PremiumBackground';

const IDLE_MS = 5000;
const PILL_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | undefined>(undefined);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>(places);
  const [mounted, setMounted] = useState(false);
  const [constellationInView, setConstellationInView] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const constellationRef = useRef<HTMLElement>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setFilteredPlaces(getPlacesByCategory(selectedCategory));
  }, [selectedCategory]);

  // Rotation only when constellation scrolls into view
  useEffect(() => {
    const el = constellationRef.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      ([e]) => setConstellationInView(e.isIntersecting),
      { threshold: 0.2, rootMargin: '0px' }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  // Breathing only when page idle
  const resetIdle = useCallback(() => {
    setIsIdle(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => setIsIdle(true), IDLE_MS);
  }, []);

  useEffect(() => {
    resetIdle();
    window.addEventListener('scroll', resetIdle, { passive: true });
    window.addEventListener('mousemove', resetIdle, { passive: true });
    window.addEventListener('keydown', resetIdle);
    return () => {
      window.removeEventListener('scroll', resetIdle);
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [resetIdle]);

  return (
    <PremiumBackground variant="explore">
      {/* Opening Section – structural transition 450–600ms */}
      <section className="relative py-10 md:py-16 lg:py-20 px-4 md:px-8 lg:px-12 overflow-hidden">
        {/* Vertical light beam behind headline (extremely subtle) */}
        <div
          className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px max-w-px hidden md:block pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 15%, rgba(255,255,255,0.4) 45%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.4) 55%, transparent 85%)',
          }}
        />
        <div
          className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px max-w-px hidden dark:md:block pointer-events-none opacity-60"
          style={{
            background: 'linear-gradient(to bottom, transparent 15%, rgba(255,255,255,0.06) 45%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.06) 55%, transparent 85%)',
          }}
        />

        {/* Mandala – rotation only when constellation in view; breath when idle */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none opacity-[0.012] dark:opacity-[0.02] hidden md:block transition-opacity duration-1000 ${
            constellationInView ? 'mandala-rotate' : ''
          }`}
          style={{ willChange: constellationInView || isIdle ? 'transform' : 'auto' }}
        >
          <style jsx>{`
            @keyframes sacredRotate {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes sacredBreath {
              0%, 100% { opacity: 0.012; transform: scale(1); }
              50% { opacity: 0.02; transform: scale(1.03); }
            }
            :global(.mandala-rotate) .mandala-outer { animation: sacredRotate 140s linear infinite; }
            :global(.mandala-rotate) .mandala-inner { animation: sacredRotate 100s linear infinite reverse; }
            .mandala-breathe { animation: sacredBreath 8s ease-in-out infinite; }
          `}</style>
          <div className={`w-full h-full ${isIdle ? 'mandala-breathe' : ''}`}>
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <g className="mandala-outer">
                <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="0.5" className="text-slate-900 dark:text-slate-100" />
                <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="0.5" className="text-slate-900 dark:text-slate-100" />
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
                <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="0.5" className="text-slate-900 dark:text-slate-100" />
                <circle cx="100" cy="100" r="30" stroke="currentColor" strokeWidth="0.5" className="text-slate-900 dark:text-slate-100" />
              </g>
            </svg>
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div
            className={`text-center space-y-4 md:space-y-6 lg:space-y-8 transition-all duration-500 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="hidden md:flex items-center justify-center gap-4 mb-2">
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-slate-300 to-slate-300" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400/40" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent via-slate-300 to-slate-300" />
            </div>

            <div className="space-y-3 md:space-y-4 lg:space-y-6">
              <h1
                className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-slate-900 dark:text-slate-100 leading-[1.1] px-2 tracking-[-0.02em] lg:tracking-[-0.03em] xl:tracking-[-0.035em]"
                style={{ fontOpticalSizing: 'auto' }}
              >
                Explore Nearby
              </h1>
              <p className="text-base md:text-xl lg:text-2xl font-light leading-relaxed max-w-3xl mx-auto px-2 text-slate-500/90 dark:text-slate-400/90">
                Just beyond the hotel lies a landscape shaped by nature, history, and devotion.
              </p>
            </div>

            <div className="hidden md:flex items-center justify-center gap-4 mt-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-slate-200 to-slate-200" />
              <div className="w-1 h-1 rounded-full bg-slate-300/30" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent via-slate-200 to-slate-200" />
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills – 150ms cubic-bezier; hover lift; selected: translucent + gold underline */}
      <section className="px-4 md:px-8 lg:px-12 pb-6 md:pb-8 lg:pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="md:hidden overflow-x-auto -mx-4 px-4 pb-2 scrollbar-hide">
            <div
              className={`flex gap-2 transition-all duration-500 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '150ms' }}
            >
              <button
                onClick={() => setSelectedCategory(undefined)}
                className={`px-5 py-3 text-sm font-medium rounded-full whitespace-nowrap flex-shrink-0 border-b-2 border-transparent transition-all duration-[150ms] ${PILL_EASING} hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 ${
                  !selectedCategory
                    ? 'text-slate-900 dark:text-slate-100 bg-white/70 dark:bg-slate-800/50 shadow-sm backdrop-blur-sm border-[#C6A75E] box-shadow-[inset_0_0_20px_rgba(198,167,94,0.06)]'
                    : 'text-slate-500 dark:text-slate-400 active:bg-slate-50 dark:active:bg-slate-800/30'
                }`}
                style={{ transitionTimingFunction: PILL_EASING }}
                aria-label="Show all places"
              >
                All Places
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id as PlaceCategory)}
                  className={`px-5 py-3 text-sm font-medium rounded-full whitespace-nowrap flex-shrink-0 border-b-2 border-transparent transition-all duration-[150ms] active:translate-y-0 ${
                    selectedCategory === category.id
                      ? 'text-slate-900 dark:text-slate-100 bg-white/70 dark:bg-slate-800/50 shadow-sm backdrop-blur-sm border-[#C6A75E]'
                      : 'text-slate-500 dark:text-slate-400 active:bg-slate-50 dark:active:bg-slate-800/30 hover:-translate-y-0.5 hover:shadow-md'
                  }`}
                  style={{ transitionTimingFunction: PILL_EASING }}
                  aria-label={`Filter by ${category.label}`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <div
            className={`hidden md:flex flex-wrap gap-2 md:gap-3 justify-center transition-all duration-500 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '150ms' }}
          >
            {[
              { id: undefined, label: 'All Places' },
              ...categories.map((c) => ({ id: c.id as PlaceCategory, label: c.label })),
            ].map((item) => {
              const isSelected = selectedCategory === item.id;
              return (
                <button
                  key={item.id ?? 'all'}
                  onClick={() => setSelectedCategory(item.id)}
                  className={`
                    relative px-6 py-3 md:px-8 md:py-3.5 text-sm md:text-base font-medium rounded-full
                    transition-all duration-[150ms] border-b-2 border-transparent
                    hover:-translate-y-0.5 hover:shadow-md active:translate-y-0
                    ${isSelected
                      ? 'text-slate-900 dark:text-slate-100 bg-white/70 dark:bg-slate-800/50 shadow-sm backdrop-blur-sm border-[#C6A75E]'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-800/40'
                    }
                  `}
                  style={{
                    transitionTimingFunction: PILL_EASING,
                    boxShadow: isSelected ? 'inset 0 0 24px rgba(198,167,94,0.06)' : undefined,
                  }}
                  aria-label={item.id === undefined ? 'Show all places' : `Filter by ${item.label}`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section ref={constellationRef} className="relative w-full">
        {filteredPlaces.length > 0 ? (
          <ConstellationExploration places={filteredPlaces} />
        ) : (
          <div className="flex items-center justify-center min-h-[60vh] py-24">
            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-light">
              No places found in this category.
            </p>
          </div>
        )}
      </section>
    </PremiumBackground>
  );
}
