'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Place } from '@/types';

interface CenteredExplorationProps {
  places: Place[];
}

// Apple-like subtle palette - refined, minimal, elegant
const colorPalette = [
  { bg: 'bg-slate-50', border: 'border-slate-200/60', text: 'text-slate-900', accent: 'text-slate-600' },
  { bg: 'bg-neutral-50', border: 'border-neutral-200/60', text: 'text-neutral-900', accent: 'text-neutral-600' },
  { bg: 'bg-stone-50', border: 'border-stone-200/60', text: 'text-stone-900', accent: 'text-stone-600' },
  { bg: 'bg-zinc-50', border: 'border-zinc-200/60', text: 'text-zinc-900', accent: 'text-zinc-600' },
  { bg: 'bg-gray-50', border: 'border-gray-200/60', text: 'text-gray-900', accent: 'text-gray-600' },
  { bg: 'bg-slate-50', border: 'border-slate-200/60', text: 'text-slate-900', accent: 'text-slate-600' },
  { bg: 'bg-neutral-50', border: 'border-neutral-200/60', text: 'text-neutral-900', accent: 'text-neutral-600' },
  { bg: 'bg-stone-50', border: 'border-stone-200/60', text: 'text-stone-900', accent: 'text-stone-600' },
];

export function CenteredExploration({ places }: CenteredExplorationProps) {
  const [mounted, setMounted] = useState(false);
  const [hoveredPlace, setHoveredPlace] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Assign colors to places
  const placesWithColors = places.map((place, index) => ({
    ...place,
    color: colorPalette[index % colorPalette.length],
  }));

  // Calculate positions for places around center
  const getPlacePosition = (index: number, total: number) => {
    // Arrange places in a circle around center
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // Start from top
    const radius = 320; // Distance from center in pixels (responsive)
    
    // Calculate relative positions
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    return {
      angle,
      x,
      y,
    };
  };

  return (
    <div className="w-full min-h-screen bg-white py-16 md:py-20 px-4 md:px-6 lg:px-8 relative overflow-hidden">
      <style jsx>{`
        @keyframes wirePulse {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }
        @keyframes wireGlow {
          0%, 100% {
            filter: drop-shadow(0 0 2px rgba(148, 163, 184, 0.3));
          }
          50% {
            filter: drop-shadow(0 0 4px rgba(148, 163, 184, 0.5));
          }
        }
      `}</style>
      <div className="max-w-7xl mx-auto relative">
        {/* Container for centered layout */}
        <div className="relative min-h-[85vh] flex items-center justify-center">
          
          {/* SVG for divinity wire connections */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 1200 800"
            preserveAspectRatio="xMidYMid meet"
            style={{ minHeight: '600px' }}
          >
            <defs>
              {/* Glow filter for divinity wires */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              
              {/* Gradient for active wire */}
              <linearGradient id="activeWire" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#94a3b8" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.4" />
              </linearGradient>
              
              {/* Gradient for inactive wire */}
              <linearGradient id="inactiveWire" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.15" />
                <stop offset="50%" stopColor="#cbd5e1" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.15" />
              </linearGradient>
            </defs>
            
            {placesWithColors.map((place, index) => {
              const pos = getPlacePosition(index, places.length);
              const isActive = hoveredPlace === place.id;
              
              // Calculate line from center to place (in viewBox coordinates)
              const centerX = 600; // Center of 1200px viewBox
              const centerY = 400; // Center of 800px viewBox
              const placeX = centerX + (pos.x * 1.5); // Scale for viewBox
              const placeY = centerY + (pos.y * 1.5);
              
              return (
                <g key={`wire-group-${place.id}`}>
                  {/* Outer glow layer */}
                  <line
                    x1={centerX}
                    y1={centerY}
                    x2={placeX}
                    y2={placeY}
                    stroke={isActive ? "url(#activeWire)" : "url(#inactiveWire)"}
                    strokeWidth={isActive ? 4 : 2}
                    strokeOpacity={isActive ? 0.3 : 0.1}
                    filter="url(#glow)"
                    className={`transition-all duration-700 ease-out ${!isActive ? 'animate-pulse' : ''}`}
                    style={{ 
                      animation: !isActive ? 'wirePulse 3s ease-in-out infinite' : 'none',
                      animationDelay: `${index * 0.2}s`
                    }}
                    aria-hidden="true"
                  />
                  {/* Main wire */}
                  <line
                    x1={centerX}
                    y1={centerY}
                    x2={placeX}
                    y2={placeY}
                    stroke={isActive ? "url(#activeWire)" : "#cbd5e1"}
                    strokeWidth={isActive ? 1.5 : 0.8}
                    strokeOpacity={isActive ? 0.5 : 0.2}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                    aria-hidden="true"
                  />
                  {/* Inner highlight - divine glow */}
                  {isActive && (
                    <line
                      x1={centerX}
                      y1={centerY}
                      x2={placeX}
                      y2={placeY}
                      stroke="#ffffff"
                      strokeWidth={0.5}
                      strokeOpacity={0.4}
                      strokeLinecap="round"
                      className="transition-all duration-700 ease-out"
                      style={{
                        filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.6))'
                      }}
                      aria-hidden="true"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Shivashray - The Center */}
          <div
            className={`
              relative z-20
              w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96
              transition-all duration-1000 ease-out
              ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
            `}
          >
            <div
              className={`
                absolute inset-0
                rounded-full
                bg-gradient-to-br from-amber-950 via-orange-900 to-amber-800
                flex items-center justify-center
                shadow-2xl
                transition-all duration-700 ease-out
                hover:scale-[1.02] hover:brightness-[1.05]
                cursor-default
              `}
            >
              <div className="text-center px-8 space-y-2 md:space-y-3">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-amber-50 leading-[1.1] tracking-tight">
                  Shivashray
                </h2>
                <p className="text-lg md:text-xl text-amber-100/90 font-light">
                  The Center
                </p>
              </div>
              
              {/* Rich texture overlays */}
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.2)_100%)]" />
              <div className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)]" />
            </div>
          </div>

          {/* Places arranged around center */}
          <div className="absolute inset-0 flex items-center justify-center">
            {placesWithColors.map((place, index) => {
              const pos = getPlacePosition(index, places.length);
              const isHovered = hoveredPlace === place.id;
              
              return (
                <div
                  key={place.id}
                  className="absolute z-10"
                  style={{
                    left: `calc(50% + ${pos.x}px)`,
                    top: `calc(50% + ${pos.y}px)`,
                    transform: 'translate(-50%, -50%)',
                    transition: mounted 
                      ? `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`
                      : 'none',
                    opacity: mounted ? 1 : 0,
                    scale: mounted ? (isHovered ? 1.05 : 1) : 0.95,
                  }}
                >
                  <Link
                    href={`/explore/${place.slug}`}
                    className="block focus:outline-none focus:ring-2 focus:ring-foreground/40 focus:ring-offset-2 focus:ring-offset-background rounded-lg"
                    onMouseEnter={() => setHoveredPlace(place.id)}
                    onMouseLeave={() => setHoveredPlace(null)}
                    aria-label={`Explore ${place.name}`}
                    tabIndex={0}
                  >
                    {/* Place Tile */}
                    <div
                      className={`
                        w-48 md:w-56 lg:w-64
                        aspect-square
                        rounded-2xl
                        relative overflow-hidden
                        group
                        transition-all duration-500 ease-out
                        ${place.color.bg}
                        border ${place.color.border}
                        ${isHovered 
                          ? 'shadow-[0_12px_40px_rgb(0,0,0,0.08)] scale-105' 
                          : 'shadow-[0_4px_20px_rgb(0,0,0,0.04)]'
                        }
                      `}
                    >
                      {/* Text Content */}
                      <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6 lg:p-7">
                        <div className="space-y-1.5 md:space-y-2">
                          <h3 className={`
                            text-lg md:text-xl lg:text-2xl
                            font-light ${place.color.text}
                            leading-tight tracking-tight
                            transition-all duration-500 ease-out
                            group-hover:translate-y-[-1px]
                          `}>
                            {place.name}
                          </h3>
                          {/* Subtle hint */}
                          <p className={`
                            text-xs md:text-sm
                            ${place.color.accent}
                            font-light leading-relaxed
                            transition-all duration-500
                            group-hover:opacity-100
                          `}>
                            {place.description.split(',').slice(0, 1).join('')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: Stacked layout */}
        <div className="md:hidden mt-12 space-y-4">
          {placesWithColors.map((place, index) => (
            <Link
              key={place.id}
              href={`/explore/${place.slug}`}
              className="block focus:outline-none focus:ring-2 focus:ring-foreground/40 focus:ring-offset-2"
              aria-label={`Explore ${place.name}`}
            >
              <div
                className={`
                  w-full aspect-[4/3]
                  rounded-2xl
                  relative overflow-hidden
                  group
                  transition-all duration-500 ease-out
                  ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                  ${place.color.bg}
                  border ${place.color.border}
                  shadow-[0_4px_20px_rgb(0,0,0,0.04)]
                  group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]
                `}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="space-y-2">
                    <h3 className={`text-2xl font-light ${place.color.text} leading-tight`}>
                      {place.name}
                    </h3>
                    <p className={`text-sm ${place.color.accent} font-light`}>
                      {place.description.split(',').slice(0, 1).join('')}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
