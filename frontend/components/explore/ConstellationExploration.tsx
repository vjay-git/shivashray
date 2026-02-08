'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Place } from '@/types';

interface ConstellationExplorationProps {
  places: Place[];
}

export function ConstellationExploration({ places }: ConstellationExplorationProps) {
  const [mounted, setMounted] = useState(false);
  const [hoveredPlace, setHoveredPlace] = useState<string | null>(null);
  const [focusedPlace, setFocusedPlace] = useState<string | null>(null);
  const [hoveredCenter, setHoveredCenter] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Organic positioning: radial clusters + asymmetry (subtle imperfection)
  const getPlacePosition = (index: number, total: number) => {
    const baseAngle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const angleVariation = Math.sin(index * 1.3) * 0.18 + Math.cos(index * 0.5) * 0.08;
    const angle = baseAngle + angleVariation;

    const baseRadius = 280;
    const cluster = Math.floor(index / 2) * 8;
    const asymmetry = 25 + Math.cos(index * 0.7) * 18 + Math.sin(index * 1.1) * 10;
    const radius = baseRadius + cluster + asymmetry;

    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { angle, x, y, radius };
  };

  // Generate curved path for energy connection
  const getCurvedPath = (x1: number, y1: number, x2: number, y2: number) => {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Gentle curve - perpendicular offset
    const offset = distance * 0.1;
    const perpX = -dy / distance;
    const perpY = dx / distance;
    
    const controlX = midX + perpX * offset;
    const controlY = midY + perpY * offset;
    
    return `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`;
  };

  return (
    <div className="w-full min-h-screen py-8 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8 relative">
      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes centerPulse {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.08; }
        }
        @keyframes particleTravel {
          0% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: -1; opacity: 0.3; }
        }
      `}</style>

      {/* Mobile: vertical sacred thread + list */}
      <div className="md:hidden relative space-y-4 pb-8">
        {/* Vertical sacred thread – connects cards */}
        <div
          className="absolute left-6 top-[5.5rem] bottom-8 w-px pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(148,163,184,0.25) 0%, rgba(148,163,184,0.12) 50%, transparent 100%)',
          }}
        />
        <div className="flex justify-center mb-8 relative z-10">
          <div
            className={`relative w-32 h-32 rounded-full overflow-hidden bg-white/95 dark:bg-slate-800/80 backdrop-blur-sm flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all duration-500 ease-out ${
              mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)' }}
            role="img"
            aria-label="Shivashray, the center"
          >
            <div className="absolute inset-0">
              <Image src="/shivashray.png" alt="Shivashray - The Center" fill className="object-contain rounded-full p-3" priority sizes="128px" />
            </div>
          </div>
        </div>

        {places.map((place, index) => (
          <Link
            key={place.id}
            href={`/explore/${place.slug}`}
            className={`relative z-10 block w-full px-6 py-5 rounded-2xl backdrop-blur-md active:scale-[0.98] transition-all duration-[250ms] ease-out focus:outline-none focus:ring-2 focus:ring-slate-400/40 focus:ring-offset-2 bg-gradient-to-b from-white/95 to-white/88 dark:from-slate-800/90 dark:to-slate-800/70 shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.5)] dark:[box-shadow:0_2px_12px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)] ${
              mounted ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ animation: mounted ? `slideUp 0.5s ease-out ${index * 0.08}s both` : 'none' }}
            aria-label={`Explore ${place.name}`}
          >
            <h3 className="text-lg font-light text-slate-900 dark:text-slate-100 leading-tight">{place.name}</h3>
            {place.description && (
              <p className="text-sm text-slate-500 dark:text-slate-400 font-light mt-1.5 leading-relaxed line-clamp-2">{place.description}</p>
            )}
            {place.distance && <p className="text-xs text-slate-400 dark:text-slate-500 font-light mt-2">{place.distance}</p>}
          </Link>
        ))}
      </div>

      {/* Desktop: Constellation Layout */}
      <div className="hidden md:block max-w-7xl mx-auto relative">
        {/* Container for constellation */}
        <div className="relative min-h-[85vh] flex items-center justify-center py-8 md:py-12">
          
          {/* SVG for divine energy connections */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 1200 800"
            preserveAspectRatio="xMidYMid meet"
            style={{ minHeight: '700px' }}
          >
            <defs>
              {/* Glow filter for energy lines */}
              <filter id="energyGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              
              {/* Sacred neon glow filter */}
              <filter id="sacredNeonGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              
              {/* Subtle gradient for active connection */}
              <linearGradient id="divineEnergy" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#64748b" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.6" />
              </linearGradient>
              
              {/* Visible gradient for inactive - always visible */}
              <linearGradient id="dimmedEnergy" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#94a3b8" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.5" />
              </linearGradient>
              
              {/* Sacred red-yellow gradient for center hover */}
              <linearGradient id="sacredNeonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
                <stop offset="30%" stopColor="#f97316" stopOpacity="1" />
                <stop offset="60%" stopColor="#fbbf24" stopOpacity="1" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            
            {places.map((place, index) => {
              const pos = getPlacePosition(index, places.length);
              const isActive = hoveredPlace === place.id || focusedPlace === place.id;
              const isCenterHovered = hoveredCenter;
              
              // Convert to SVG coordinates
              const centerX = 600;
              const centerY = 400;
              const placeX = centerX + (pos.x * 1.0); // Reduced scale for better fit
              const placeY = centerY + (pos.y * 1.0);
              
              // Curved path
              const path = getCurvedPath(centerX, centerY, placeX, placeY);
              
              return (
                <g key={`energy-${place.id}`}>
                  {/* Idle: static thin line. Hover: gradient transitions in 300ms */}
                  <path
                    d={path}
                    fill="none"
                    stroke={isCenterHovered ? 'url(#sacredNeonGradient)' : (isActive ? 'url(#divineEnergy)' : 'url(#dimmedEnergy)')}
                    strokeWidth={isCenterHovered ? 2 : (isActive ? 1.8 : 1)}
                    strokeOpacity={isCenterHovered ? 0.7 : (isActive ? 0.55 : 0.45)}
                    strokeLinecap="round"
                    style={{ transition: 'stroke 300ms ease-out, stroke-width 300ms ease-out, stroke-opacity 300ms ease-out' }}
                    aria-hidden="true"
                  />
                  {/* Single-pass particle on center hover – runs once then stops */}
                  {isCenterHovered && (
                    <path
                      d={path}
                      fill="none"
                      stroke="url(#sacredNeonGradient)"
                      strokeWidth={2}
                      strokeOpacity={0.9}
                      strokeLinecap="round"
                      pathLength={1}
                      strokeDasharray="0.06 0.94"
                      style={{
                        animation: `particleTravel 1.2s ease-out ${index * 0.06}s forwards`,
                        filter: 'url(#sacredNeonGlow)',
                      }}
                      aria-hidden="true"
                    />
                  )}
                  {isActive && !isCenterHovered && (
                    <path d={path} fill="none" stroke="#94a3b8" strokeWidth={0.5} strokeOpacity={0.25} strokeLinecap="round" aria-hidden="true" />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Halo layer (Layer 1) – always present, 5–8% opacity */}
          <div
            className="absolute z-10 w-96 h-96 lg:w-[28rem] lg:h-[28rem] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(148,163,184,0.06) 0%, rgba(148,163,184,0.02) 50%, transparent 70%)',
              filter: 'blur(24px)',
            }}
          />
          <div
            className="absolute z-10 w-96 h-96 lg:w-[28rem] lg:h-[28rem] rounded-full pointer-events-none dark:opacity-80"
            style={{
              background: 'radial-gradient(circle, rgba(251,191,36,0.04) 0%, transparent 60%)',
              filter: 'blur(32px)',
              animation: 'centerPulse 7s ease-in-out infinite',
            }}
          />

          {/* Center node (Layer 3) – 300ms hover transition, glow expands */}
          <div
            className={`relative z-30 w-64 h-64 lg:w-80 lg:h-80 transition-all duration-300 ease-out ${
              mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            onMouseEnter={() => setHoveredCenter(true)}
            onMouseLeave={() => setHoveredCenter(false)}
          >
            <div
              className={`
                absolute inset-0 rounded-full overflow-hidden bg-white/95 dark:bg-slate-800/80 backdrop-blur-sm
                flex items-center justify-center cursor-pointer
                transition-all duration-300 ease-out
                ${hoveredCenter ? 'shadow-[0_0_32px_rgba(198,167,94,0.25),0_0_64px_rgba(198,167,94,0.15),0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_0_32px_rgba(198,167,94,0.3),0_0_64px_rgba(198,167,94,0.2),0_4px_20px_rgba(0,0,0,0.2)] scale-[1.03]' : 'shadow-[0_4px_20px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.5)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)]'}
              `}
              role="img"
              aria-label="Shivashray, the center of the constellation"
            >
              {/* Shivashray Logo Image */}
              <div className="absolute inset-0">
                <Image
                  src="/shivashray.png"
                  alt="Shivashray - The Center"
                  fill
                  className="object-contain rounded-full p-4"
                  priority
                  sizes="(max-width: 768px) 192px, (max-width: 1024px) 256px, 320px"
                />
              </div>
            </div>
          </div>

          {/* Floating Place Nodes */}
          <div className="absolute inset-0 flex items-center justify-center">
            {places.map((place, index) => {
              const pos = getPlacePosition(index, places.length);
              const isHovered = hoveredPlace === place.id;
              const isFocused = focusedPlace === place.id;
              const isActive = isHovered || isFocused;
              
              return (
                <div
                  key={place.id}
                  className="absolute z-20"
                  style={{
                    left: `calc(50% + ${pos.x}px)`,
                    top: `calc(50% + ${pos.y}px)`,
                    transform: `translate(-50%, -50%) scale(${mounted ? (isActive || hoveredCenter ? 1.08 : 1) : 0.95})`,
                    transition: mounted ? 'opacity 300ms ease-out, transform 300ms ease-out' : 'none',
                    transitionDelay: mounted ? `${index * 0.05}s` : '0ms',
                    opacity: mounted ? (isActive || hoveredCenter ? 1 : 0.65) : 0,
                  }}
                >
                  <Link
                    href={`/explore/${place.slug}`}
                    className="block focus:outline-none focus:ring-2 focus:ring-slate-400/40 focus:ring-offset-2 focus:ring-offset-white rounded-full"
                    onMouseEnter={() => setHoveredPlace(place.id)}
                    onMouseLeave={() => setHoveredPlace(null)}
                    onFocus={() => setFocusedPlace(place.id)}
                    onBlur={() => setFocusedPlace(null)}
                    aria-label={`Explore ${place.name}`}
                    tabIndex={0}
                  >
                    <div
                      className={`
                        relative px-6 py-3 md:px-8 md:py-4 rounded-full backdrop-blur-md
                        bg-gradient-to-b from-white/95 to-white/85 dark:from-slate-800/80 dark:to-slate-800/60
                        transition-all duration-300 ease-out
                        shadow-[0_2px_16px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)]
                        [box-shadow:0_2px_16px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.6)] dark:[box-shadow:0_2px_16px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.08)]
                        ${isActive ? 'shadow-[0_8px_28px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_28px_rgba(0,0,0,0.35)] scale-105' : ''}
                        ${hoveredCenter ? 'shadow-[0_0_20px_rgba(198,167,94,0.2),0_8px_28px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(198,167,94,0.25),0_8px_28px_rgba(0,0,0,0.3)] scale-105' : ''}
                      `}
                    >
                      <h3 className={`relative z-10 text-base md:text-lg lg:text-xl font-light text-slate-900 dark:text-slate-100 leading-tight tracking-tight transition-colors duration-200 ${isActive ? 'text-slate-950 dark:text-slate-50' : ''}`}>
                        {place.name}
                      </h3>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
