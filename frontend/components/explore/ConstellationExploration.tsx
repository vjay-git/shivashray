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

  // Calculate positions for places around center with organic spacing
  const getPlacePosition = (index: number, total: number) => {
    // Organic, uneven spacing - not perfectly mechanical
    const baseAngle = (index / total) * 2 * Math.PI - Math.PI / 2; // Start from top
    const angleVariation = (Math.sin(index * 1.3) * 0.12); // Organic variation (reduced)
    const angle = baseAngle + angleVariation;
    
    // Varying radius for organic feel - adjusted for better fit
    // Desktop: larger radius for better spacing
    const baseRadius = 280;
    const radiusVariation = 20 + (Math.cos(index * 0.7) * 15); // Reduced variation
    const radius = baseRadius + radiusVariation;
    
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    return {
      angle,
      x,
      y,
      radius,
    };
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
        @keyframes energyPulse {
          0%, 100% {
            opacity: 0.4;
            stroke-width: 1.2;
          }
          50% {
            opacity: 0.6;
            stroke-width: 1.5;
          }
        }
        @keyframes nodeGlow {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.7;
          }
        }
        @keyframes centerPulse {
          0%, 100% {
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.02);
          }
          50% {
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.03);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes sacredNeonSpread {
          0% {
            stroke-opacity: 0.4;
            stroke-width: 1.2;
          }
          100% {
            stroke-opacity: 0.9;
            stroke-width: 4;
          }
        }
        @keyframes sacredNeonTravel {
          0% {
            stroke-dashoffset: 0;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: -100%;
            opacity: 0;
          }
        }
        @keyframes sacredNodeGlow {
          0% {
            opacity: 1;
            transform: scale(1);
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
      `}</style>
      
      {/* Mobile: Vertical Scroll List */}
      <div className="md:hidden space-y-4 pb-8">
        {/* Center - Shivashray */}
        <div className="flex justify-center mb-8">
              <div
                className={`
                  relative
                  w-32 h-32
                  rounded-full
                  overflow-hidden
                  bg-white/95 dark:bg-slate-800/80
                  backdrop-blur-sm
                  border border-slate-200/60 dark:border-slate-700/40
                  flex items-center justify-center
                  shadow-[0_4px_20px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2),0_0_0_1px_rgba(255,255,255,0.05)]
                  transition-all duration-1000 ease-out
                  ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                `}
                role="img"
                aria-label="Shivashray, the center"
              >
            <div className="absolute inset-0">
              <Image
                src="/shivashray.png"
                alt="Shivashray - The Center"
                fill
                className="object-contain rounded-full p-3"
                priority
                sizes="128px"
              />
            </div>
          </div>
        </div>

        {/* Places List - Large Tap Targets */}
        {places.map((place, index) => (
            <Link
              key={place.id}
              href={`/explore/${place.slug}`}
              className={`
                block
                w-full
                px-6 py-5
                rounded-2xl
                bg-white/90 dark:bg-slate-800/60
                backdrop-blur-md
                border border-slate-200/60 dark:border-slate-700/40
                shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.15)]
                active:bg-slate-50 dark:active:bg-slate-800/40
                active:scale-[0.98]
                transition-all duration-200 ease-out
                focus:outline-none focus:ring-2 focus:ring-slate-400/40 dark:focus:ring-slate-600/40 focus:ring-offset-2
                ${mounted ? 'opacity-100' : 'opacity-0'}
              `}
              style={{
                animation: mounted ? `slideUp 0.5s ease-out ${index * 0.1}s both` : 'none'
              }}
              aria-label={`Explore ${place.name}`}
            >
              <h3 className="text-lg font-light text-slate-900 dark:text-slate-100 leading-tight">
                {place.name}
              </h3>
              {place.description && (
                <p className="text-sm text-slate-500 dark:text-slate-400 font-light mt-1.5 leading-relaxed line-clamp-2">
                  {place.description}
                </p>
              )}
              {place.distance && (
                <p className="text-xs text-slate-400 dark:text-slate-500 font-light mt-2">
                  {place.distance}
                </p>
              )}
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
              
              // Calculate approximate path length for animation
              const dx = placeX - centerX;
              const dy = placeY - centerY;
              const pathLength = Math.sqrt(dx * dx + dy * dy) * 1.1; // Approximate with curve factor
              
              return (
                <g key={`energy-${place.id}`}>
                  {/* Outer glow layer */}
                  <path
                    d={path}
                    fill="none"
                    stroke={isCenterHovered ? "url(#sacredNeonGradient)" : (isActive ? "url(#divineEnergy)" : "url(#dimmedEnergy)")}
                    strokeWidth={isCenterHovered ? 4 : (isActive ? 3 : 2)}
                    strokeOpacity={isCenterHovered ? 0.9 : (isActive ? 0.5 : 0.4)}
                    filter={isCenterHovered ? "url(#sacredNeonGlow)" : "url(#energyGlow)"}
                    className="transition-all duration-1000 ease-out"
                    style={isCenterHovered ? {
                      animation: `sacredNeonSpread ${1.5 + (index * 0.1)}s ease-out forwards`,
                      animationDelay: `${index * 0.05}s`
                    } : {}}
                    aria-hidden="true"
                  />
                  {/* Main connection line - always visible */}
                  <path
                    d={path}
                    fill="none"
                    stroke={isCenterHovered ? "url(#sacredNeonGradient)" : (isActive ? "url(#divineEnergy)" : "url(#dimmedEnergy)")}
                    strokeWidth={isCenterHovered ? 2.5 : (isActive ? 2 : 1.2)}
                    strokeOpacity={isCenterHovered ? 1 : (isActive ? 0.6 : 0.5)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                    style={isCenterHovered ? {
                      animation: `sacredNeonSpread ${1.5 + (index * 0.1)}s ease-out forwards`,
                      animationDelay: `${index * 0.05}s`
                    } : {}}
                    aria-hidden="true"
                  />
                  {/* Sacred red-yellow gradient traveling light effect */}
                  {isCenterHovered && (
                    <path
                      d={path}
                      fill="none"
                      stroke="url(#sacredNeonGradient)"
                      strokeWidth={3}
                      strokeOpacity={0.9}
                      strokeLinecap="round"
                      strokeDasharray={`${pathLength} ${pathLength}`}
                      className="transition-all duration-1000 ease-out"
                      style={{
                        animation: `sacredNeonTravel ${1.5 + (index * 0.1)}s ease-out forwards`,
                        animationDelay: `${index * 0.05}s`,
                        filter: "url(#sacredNeonGlow)"
                      }}
                      aria-hidden="true"
                    />
                  )}
                  {/* Inner highlight for active */}
                  {isActive && !isCenterHovered && (
                    <path
                      d={path}
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth={0.5}
                      strokeOpacity={0.3}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                      aria-hidden="true"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Shivashray - The Illuminated Center (Desktop) */}
          <div
            className={`
              relative z-30
              w-64 h-64 lg:w-80 lg:h-80
              transition-all duration-1500 ease-out
              ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
            `}
            onMouseEnter={() => setHoveredCenter(true)}
            onMouseLeave={() => setHoveredCenter(false)}
          >
            <div
              className={`
                absolute inset-0
                rounded-full
                overflow-hidden
                bg-white/95 dark:bg-slate-800/80
                backdrop-blur-sm
                border border-slate-200/60 dark:border-slate-700/40
                flex items-center justify-center
                transition-all duration-1000 ease-out
                cursor-pointer
                ${hoveredCenter ? 'shadow-[0_0_40px_rgba(239,68,68,0.5),0_0_80px_rgba(251,191,36,0.4),0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_0_40px_rgba(239,68,68,0.6),0_0_80px_rgba(251,191,36,0.5),0_4px_20px_rgba(0,0,0,0.2)] scale-105' : 'shadow-[0_4px_20px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2),0_0_0_1px_rgba(255,255,255,0.05)]'}
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
                    transform: 'translate(-50%, -50%)',
                    transition: mounted 
                      ? `all 1s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.15}s`
                      : 'none',
                    opacity: mounted ? (isActive || hoveredCenter ? 1 : 0.6) : 0,
                    scale: mounted ? (isActive || hoveredCenter ? 1.15 : 1) : 0.9,
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
                    {/* Floating Node */}
                    <div
                      className={`
                        relative
                        px-6 py-3 md:px-8 md:py-4
                        rounded-full
                        bg-white/90 dark:bg-slate-800/60
                        backdrop-blur-md
                        border border-slate-200/60 dark:border-slate-700/40
                        transition-all duration-700 ease-out
                        group
                        ${isActive 
                          ? 'border-slate-300 dark:border-slate-600 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] scale-105' 
                          : 'hover:border-slate-300/80 dark:hover:border-slate-600/60 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)]'
                        }
                        ${hoveredCenter 
                          ? 'border-orange-400/60 dark:border-orange-500/60 shadow-[0_0_20px_rgba(239,68,68,0.4),0_0_40px_rgba(251,191,36,0.3),0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_0_20px_rgba(239,68,68,0.5),0_0_40px_rgba(251,191,36,0.4),0_8px_30px_rgba(0,0,0,0.3)] scale-105' 
                          : 'shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.15)]'
                        }
                      `}
                      style={hoveredCenter ? {
                        animation: `sacredNodeGlow ${1.5 + (index * 0.1)}s ease-out forwards`,
                        animationDelay: `${index * 0.05}s`
                      } : {}}
                    >
                      {/* Place name */}
                      <h3 className={`
                        relative z-10
                        text-base md:text-lg lg:text-xl
                        font-light text-slate-900 dark:text-slate-100
                        leading-tight tracking-tight
                        transition-all duration-500 ease-out
                        ${isActive ? 'text-slate-950 dark:text-slate-50' : ''}
                      `}>
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
