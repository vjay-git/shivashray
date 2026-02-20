'use client';

import { useState, useEffect } from 'react';
import { PlaceCategory } from '@/types';
import { places, getPlacesByCategory, categories } from '@/lib/data/places';
import { MapExploration } from '@/components/explore/MapExploration';
import { PremiumBackground } from '@/components/layout/PremiumBackground';

const PILL_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

/* ── Category meta ─────────────────────────────────────────────── */
const CAT_META: Record<string, { icon: string; light: string; dark: string }> = {
  'sacred-temples':     { icon: '◈', light: '#ea580c', dark: '#fb923c' },
  'nature-scenic':      { icon: '◉', light: '#0369a1', dark: '#38bdf8' },
  'cultural-landmarks': { icon: '◆', light: '#6d28d9', dark: '#a78bfa' },
  'short-excursions':   { icon: '◎', light: '#0f766e', dark: '#2dd4bf' },
};

const categoryCounts = categories.reduce((acc, cat) => {
  acc[cat.id] = places.filter(p => p.category === cat.id).length;
  return acc;
}, {} as Record<string, number>);

const ALL_FILTERS = [
  {
    id: undefined as PlaceCategory | undefined,
    label: 'All Places',
    icon: null,
    count: places.length,
    light: '#92400e',
    dark: '#fbbf24',
  },
  ...categories.map(c => ({
    id: c.id as PlaceCategory,
    label: c.label,
    icon: CAT_META[c.id]?.icon ?? null,
    count: categoryCounts[c.id] ?? 0,
    light: CAT_META[c.id]?.light ?? '#64748b',
    dark: CAT_META[c.id]?.dark ?? '#94a3b8',
  })),
];

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | undefined>(undefined);
  const [filteredPlaces, setFilteredPlaces] = useState(places);
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsDark(document.documentElement.classList.contains('dark'));
    check();
    const ob = new MutationObserver(check);
    ob.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => ob.disconnect();
  }, []);

  useEffect(() => {
    setFilteredPlaces(getPlacesByCategory(selectedCategory));
  }, [selectedCategory]);

  return (
    <PremiumBackground variant="explore">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <section className="pt-14 pb-8 md:pt-20 md:pb-10 px-4 md:px-8 lg:px-12">
        <div
          className={`max-w-4xl mx-auto text-center transition-all duration-700 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Decorative OM ornament */}
          <div className="flex items-center justify-center gap-3 mb-7">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400/50 dark:to-amber-500/40" />
            <div className="relative w-9 h-9 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full animate-spin"
                style={{
                  borderStyle: 'dashed',
                  borderWidth: '1px',
                  borderColor: 'rgba(196,167,94,0.4)',
                  animationDuration: '28s',
                }}
              />
              <span
                className="relative z-10 text-amber-600/80 dark:text-amber-400/70 select-none"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '16px', lineHeight: 1 }}
              >
                ॐ
              </span>
            </div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400/50 dark:to-amber-500/40" />
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-[3.75rem] lg:text-7xl font-light tracking-[-0.025em] leading-[1.06]">
            <span className="text-slate-900 dark:text-slate-100">Explore </span>
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: isDark
                  ? 'linear-gradient(135deg, #fbbf24 0%, #fcd34d 40%, #f59e0b 70%, #fbbf24 100%)'
                  : 'linear-gradient(135deg, #92400e 0%, #b45309 35%, #C6A75E 65%, #78350f 100%)',
              }}
            >
              Varanasi
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 md:mt-5 text-base md:text-lg font-light text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Sacred temples, ancient ghats & vibrant street food — all within moments of Shiv Ashray
          </p>

          {/* Location badge + stats */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border"
              style={{
                background: isDark ? 'rgba(120,53,15,0.18)' : 'rgba(254,243,199,0.8)',
                borderColor: isDark ? 'rgba(217,119,6,0.25)' : 'rgba(252,211,77,0.5)',
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 flex-shrink-0" />
              <span className="text-xs font-medium text-amber-700 dark:text-amber-400 tracking-wide">
                Kachourigali, Old City
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[11px] font-light text-slate-400 dark:text-slate-600">
              <span className="tabular-nums">{places.length}+ Places</span>
              <span className="opacity-40">·</span>
              <span>4 Categories</span>
              <span className="opacity-40">·</span>
              <span>40 m to 35 km</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category filter ─────────────────────────────────────────── */}
      <section className="px-4 md:px-8 lg:px-12 pb-7 md:pb-9">
        <div
          className={`max-w-7xl mx-auto transition-all duration-700 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '100ms' }}
        >
          {/* Mobile: horizontal scroll */}
          <div className="md:hidden overflow-x-auto -mx-4 px-4 pb-1 scrollbar-hide">
            <div className="flex gap-2 w-max">
              {ALL_FILTERS.map(item => {
                const active = selectedCategory === item.id;
                const col = isDark ? item.dark : item.light;
                return (
                  <button
                    key={item.id ?? 'all'}
                    onClick={() => setSelectedCategory(item.id)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full whitespace-nowrap border transition-all duration-200"
                    style={{
                      transitionTimingFunction: PILL_EASING,
                      background: active ? `${col}14` : 'transparent',
                      borderColor: active ? `${col}50` : 'transparent',
                      color: active ? col : isDark ? '#64748b' : '#94a3b8',
                      boxShadow: active ? `0 2px 12px ${col}20` : 'none',
                    }}
                  >
                    {item.icon && (
                      <span className="text-[10px] leading-none">{item.icon}</span>
                    )}
                    <span className="text-[13px] font-medium">{item.label}</span>
                    <span className="text-[10px] opacity-55 font-normal tabular-nums">{item.count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop: centered row */}
          <div className="hidden md:flex flex-wrap gap-2.5 justify-center">
            {ALL_FILTERS.map(item => {
              const active = selectedCategory === item.id;
              const col = isDark ? item.dark : item.light;
              return (
                <button
                  key={item.id ?? 'all'}
                  onClick={() => setSelectedCategory(item.id)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                  style={{
                    transitionTimingFunction: PILL_EASING,
                    background: active ? `${col}10` : 'transparent',
                    borderColor: active ? `${col}45` : 'transparent',
                    color: active ? col : isDark ? '#64748b' : '#94a3b8',
                    boxShadow: active ? `0 4px 18px ${col}18` : 'none',
                  }}
                >
                  {item.icon && (
                    <span className="text-[12px] leading-none">{item.icon}</span>
                  )}
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-[11px] opacity-50 tabular-nums">{item.count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Map ─────────────────────────────────────────────────────── */}
      <section className="pb-16 md:pb-24">
        {filteredPlaces.length > 0 ? (
          <MapExploration places={filteredPlaces} />
        ) : (
          <div className="flex items-center justify-center min-h-[40vh]">
            <p className="text-base text-slate-400 dark:text-slate-600 font-light">
              No places in this category.
            </p>
          </div>
        )}
      </section>

    </PremiumBackground>
  );
}
