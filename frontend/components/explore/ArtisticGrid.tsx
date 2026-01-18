'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Place } from '@/types';

interface ArtisticGridProps {
  places: Place[];
}

// Rich color palette - earth + jewel tones (warm, alive, eternal)
const colorPalette = [
  { bg: 'from-amber-950 via-orange-900 to-amber-800', text: 'text-amber-50', accent: 'text-amber-100' },
  { bg: 'from-emerald-950 via-teal-900 to-emerald-800', text: 'text-emerald-50', accent: 'text-emerald-100' },
  { bg: 'from-rose-950 via-pink-900 to-rose-800', text: 'text-rose-50', accent: 'text-rose-100' },
  { bg: 'from-violet-950 via-purple-900 to-violet-800', text: 'text-violet-50', accent: 'text-violet-100' },
  { bg: 'from-indigo-950 via-blue-900 to-indigo-800', text: 'text-indigo-50', accent: 'text-indigo-100' },
  { bg: 'from-slate-900 via-gray-800 to-slate-700', text: 'text-slate-50', accent: 'text-slate-100' },
  { bg: 'from-amber-900 via-yellow-800 to-amber-700', text: 'text-amber-50', accent: 'text-amber-100' },
  { bg: 'from-emerald-900 via-green-800 to-emerald-700', text: 'text-emerald-50', accent: 'text-emerald-100' },
];

// Asymmetric tile configurations for visual rhythm
const tileConfigs = [
  { cols: 'col-span-12 md:col-span-6', aspect: 'aspect-[4/3]' },
  { cols: 'col-span-12 md:col-span-5', aspect: 'aspect-[5/4]' },
  { cols: 'col-span-12 md:col-span-4', aspect: 'aspect-[3/4]' },
  { cols: 'col-span-12 md:col-span-7', aspect: 'aspect-[7/5]' },
  { cols: 'col-span-12 md:col-span-5', aspect: 'aspect-[5/3]' },
  { cols: 'col-span-12 md:col-span-4', aspect: 'aspect-[4/5]' },
  { cols: 'col-span-12 md:col-span-6', aspect: 'aspect-[6/4]' },
  { cols: 'col-span-12 md:col-span-5', aspect: 'aspect-[5/4]' },
];

export function ArtisticGrid({ places }: ArtisticGridProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Assign colors to places
  const placesWithColors = places.map((place, index) => ({
    ...place,
    color: colorPalette[index % colorPalette.length],
  }));

  // Get tile configuration for visual rhythm
  const getTileConfig = (index: number) => {
    return tileConfigs[index % tileConfigs.length];
  };

  return (
    <div className="w-full min-h-screen bg-background py-8 md:py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* 12-column CSS Grid */}
        <div className="grid grid-cols-12 gap-3 md:gap-4 lg:gap-6">
          {/* Shivashray - The Central Anchor */}
          <div
            className={`
              col-span-12 md:col-span-10 md:col-start-2
              aspect-[16/9] md:aspect-[20/9]
              relative overflow-hidden
              transition-all duration-1000 ease-out
              ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-98'}
            `}
          >
            <div
              className={`
                absolute inset-0
                bg-gradient-to-br from-amber-950 via-orange-900 to-amber-800
                flex items-center justify-center
                group
                transition-all duration-700 ease-out
                hover:scale-[1.005] hover:brightness-[1.08]
                cursor-default
              `}
            >
              <div className="text-center px-6 md:px-12 space-y-3 md:space-y-4">
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-amber-50 leading-[1.1] tracking-tight">
                  Shivashray
                </h2>
                <p className="text-xl md:text-2xl text-amber-100/90 font-light tracking-wide">
                  The Center
                </p>
              </div>
              
              {/* Rich texture overlays */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.15)_100%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.03)_50%,transparent_100%)]" />
            </div>
          </div>

          {/* Place Tiles - Artistic Composition */}
          {placesWithColors.map((place, index) => {
            const config = getTileConfig(index);
            
            return (
              <Link
                key={place.id}
                href={`/explore/${place.slug}`}
                className={`
                  ${config.cols}
                  ${config.aspect}
                  relative overflow-hidden
                  group
                  transition-all duration-700 ease-out
                  ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                  focus:outline-none focus:ring-2 focus:ring-foreground/40 focus:ring-offset-2 focus:ring-offset-background
                `}
                style={{ transitionDelay: `${(index + 1) * 80}ms` }}
                aria-label={`Explore ${place.name}`}
                tabIndex={0}
              >
                {/* Rich Colorful Gradient Background */}
                <div
                  className={`
                    absolute inset-0
                    bg-gradient-to-br ${place.color.bg}
                    transition-all duration-700 ease-out
                    group-hover:scale-[1.03] group-hover:brightness-[1.12]
                    group-focus:scale-[1.02] group-focus:brightness-[1.08]
                  `}
                >
                  {/* Artistic texture overlays */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(255,255,255,0.12)_0%,transparent_60%)]" />
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(0,0,0,0.08)_50%,transparent_100%)]" />
                </div>

                {/* Text Content - Minimal, Poetic */}
                <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6 lg:p-8">
                  <div className="space-y-2 md:space-y-3">
                    <h3 className={`
                      text-2xl md:text-3xl lg:text-4xl 
                      font-light ${place.color.text} 
                      leading-[1.1] tracking-tight
                      transition-all duration-500 ease-out
                      group-hover:translate-y-[-3px]
                    `}>
                      {place.name}
                    </h3>
                    {/* Optional poetic hint - first few words of description */}
                    <p className={`
                      text-sm md:text-base lg:text-lg
                      ${place.color.accent}/70
                      font-light leading-relaxed
                      max-w-md
                      transition-all duration-500
                      group-hover:opacity-100 group-hover:translate-y-[-2px]
                    `}>
                      {place.description.split(',').slice(0, 1).join('')}
                    </p>
                  </div>
                </div>

                {/* Subtle depth enhancement on interaction */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-700 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
