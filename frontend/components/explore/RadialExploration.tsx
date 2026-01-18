'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Place } from '@/types';
import { useRouter } from 'next/navigation';

interface RadialExplorationProps {
  places: Place[];
}

interface NodePosition {
  x: number;
  y: number;
  angle: number;
}

export function RadialExploration({ places }: RadialExplorationProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [hoveredPlace, setHoveredPlace] = useState<string | null>(null);
  const [focusedPlace, setFocusedPlace] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Calculate positions for radial layout
  const calculatePositions = useCallback((): {
    center: { x: number; y: number };
    nodes: Map<string, NodePosition>;
  } => {
    const width = dimensions.width || (typeof window !== 'undefined' ? window.innerWidth : 1200);
    const height = dimensions.height || (typeof window !== 'undefined' ? window.innerHeight : 800);
    
    if (width === 0 || height === 0) {
      return { center: { x: 0, y: 0 }, nodes: new Map() };
    }

    const centerX = width / 2;
    const centerY = height / 2;
    
    // Base radius - responsive to viewport
    const baseRadius = Math.min(width, height) * 0.25;
    const minRadius = Math.max(120, baseRadius);
    const maxRadius = Math.min(width * 0.35, height * 0.35);
    
    // Calculate radius with scroll-reactive behavior on mobile
    const isMobile = dimensions.width < 768;
    const radius = isMobile 
      ? minRadius + (maxRadius - minRadius) * scrollProgress
      : maxRadius * 0.7;

    const nodes = new Map<string, NodePosition>();
    const angleStep = places.length > 0 ? (2 * Math.PI) / places.length : 0;

    places.forEach((place, index) => {
      // Offset angle slightly for visual balance (start from top, slightly rotated)
      const angle = index * angleStep - Math.PI / 2 + (places.length % 2 === 0 ? angleStep / 2 : 0);
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      nodes.set(place.id, { x, y, angle });
    });

    return { center: { x: centerX, y: centerY }, nodes };
  }, [dimensions, places.length, scrollProgress]);

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const width = rect.width || window.innerWidth;
        const height = rect.height || window.innerHeight;
        
        if (width > 0 && height > 0) {
          setDimensions({ width, height });
          setMounted(true);
        } else {
          // Fallback to window dimensions
          setDimensions({ 
            width: window.innerWidth, 
            height: window.innerHeight 
          });
          setMounted(true);
        }
      } else {
        // If ref not ready, use window dimensions
        setDimensions({ 
          width: window.innerWidth, 
          height: window.innerHeight 
        });
        setMounted(true);
      }
    };

    // Use requestAnimationFrame to ensure DOM is ready
    const rafId = requestAnimationFrame(() => {
      updateDimensions();
    });

    // Also set up resize listener
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Handle scroll for mobile reactivity
  useEffect(() => {
    if (dimensions.width >= 768) {
      setScrollProgress(1); // Desktop shows full flower immediately
      return;
    }

    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const elementTop = rect.top;
      const elementHeight = rect.height;
      
      // Calculate progress based on scroll position
      // Start expanding when element is 40% into viewport
      // Fully expanded when element center reaches 60% of viewport
      const triggerPoint = viewportHeight * 0.4;
      const fullPoint = viewportHeight * 0.6;
      const scrollY = window.scrollY;
      const elementCenterY = elementTop + elementHeight / 2;
      const viewportCenter = scrollY + viewportHeight * 0.5;
      
      const distance = elementCenterY - viewportCenter;
      const progress = Math.max(0, Math.min(1, 
        1 - (distance / (fullPoint - triggerPoint))
      ));
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dimensions.width]);

  const { center, nodes } = calculatePositions();

  const handlePlaceClick = (place: Place) => {
    router.push(`/explore/${place.slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent, place: Place) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePlaceClick(place);
    }
  };

  // Use fallback dimensions if not yet calculated
  const displayWidth = dimensions.width || (typeof window !== 'undefined' ? window.innerWidth : 1200);
  const displayHeight = dimensions.height || (typeof window !== 'undefined' ? window.innerHeight : 800);

  if (!mounted || (dimensions.width === 0 && dimensions.height === 0)) {
    return (
      <div 
        ref={containerRef}
        className="w-full h-screen flex items-center justify-center bg-background"
        style={{ minHeight: '100vh' }}
      >
        <div className="w-12 h-12 border-2 border-muted-foreground/20 border-t-foreground rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-background"
      style={{ 
        height: '100vh',
        minHeight: '100vh',
        width: '100%'
      }}
      role="region"
      aria-label="Radial exploration of nearby places. Shivashray Hotel is at the center, with nearby destinations arranged around it."
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${displayWidth} ${displayHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Connecting lines - drawn first so they appear behind nodes */}
        {Array.from(nodes.entries()).map(([placeId, node]) => {
          const place = places.find(p => p.id === placeId);
          const isActive = hoveredPlace === placeId || focusedPlace === placeId;
          
          return (
            <line
              key={`line-${placeId}`}
              x1={center.x}
              y1={center.y}
              x2={node.x}
              y2={node.y}
              stroke="currentColor"
              strokeWidth={isActive ? 1.5 : 0.5}
              strokeOpacity={isActive ? 0.4 : 0.15}
              className="transition-all duration-500 ease-out"
              aria-hidden="true"
            />
          );
        })}
      </svg>

      {/* Center Node - Shivashray */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
        style={{
          left: `${center.x}px`,
          top: `${center.y}px`,
        }}
      >
        <div
          className={`
            relative w-28 h-28 md:w-36 md:h-36 rounded-full
            bg-background border-2 border-foreground/15
            flex items-center justify-center
            transition-all duration-1000 ease-out
            ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
            shadow-sm
          `}
          role="img"
          aria-label="Shivashray Hotel, the center point of exploration"
        >
          <div className="text-center">
            <div className="text-sm md:text-base font-light text-foreground leading-tight px-3">
              Shivashray
            </div>
          </div>
          
          {/* Subtle inner circle - mandala-like */}
          <div className="absolute inset-3 rounded-full border border-foreground/8" />
          <div className="absolute inset-5 rounded-full border border-foreground/5" />
        </div>
      </div>

      {/* Place Nodes (Petals) */}
      {places.map((place, index) => {
        const node = nodes.get(place.id);
        if (!node) return null;

        const isHovered = hoveredPlace === place.id;
        const isFocused = focusedPlace === place.id;
        const isActive = isHovered || isFocused;

        return (
          <div
            key={place.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{
              left: `${node.x}px`,
              top: `${node.y}px`,
              transition: mounted ? `all 0.7s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s` : 'none',
              opacity: mounted ? 1 : 0,
              transform: mounted 
                ? `translate(-50%, -50%) scale(${isActive ? 1.1 : 1})`
                : 'translate(-50%, -50%) scale(0.8)',
            }}
          >
            <Link
              href={`/explore/${place.slug}`}
              className="block focus:outline-none focus:ring-2 focus:ring-foreground/40 focus:ring-offset-2 focus:ring-offset-background rounded-full transition-all"
              onMouseEnter={() => setHoveredPlace(place.id)}
              onMouseLeave={() => setHoveredPlace(null)}
              onFocus={() => setFocusedPlace(place.id)}
              onBlur={() => setFocusedPlace(null)}
              onKeyDown={(e) => handleKeyDown(e, place)}
              aria-label={`${place.name}. ${place.description}. Tap to learn more.`}
              tabIndex={0}
            >
              {/* Node Circle */}
              <div
                className={`
                  relative rounded-full
                  bg-background border border-foreground/15
                  flex items-center justify-center
                  transition-all duration-500 ease-out
                  ${isActive 
                    ? 'border-foreground/35 shadow-md shadow-foreground/8 scale-110' 
                    : 'hover:border-foreground/25'
                  }
                `}
                style={{ width: '4.5rem', height: '4.5rem' }}
              >
                {/* Subtle inner glow when active */}
                {isActive && (
                  <div className="absolute inset-0 rounded-full bg-foreground/4" />
                )}
                
                {/* Place name - abbreviated for space */}
                <div className="text-center px-2">
                  <div className="text-[11px] md:text-xs font-light text-foreground leading-tight">
                    {place.name.split(' ').slice(0, 2).join(' ')}
                  </div>
                </div>
              </div>

              {/* Expanded description on hover/focus (desktop only) */}
              {isActive && dimensions.width >= 768 && (
                <div
                  className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 w-56 md:w-64 z-30 pointer-events-none"
                  style={{
                    animation: 'fadeInUp 0.4s ease-out',
                  }}
                >
                  <div className="bg-background/98 backdrop-blur-md border border-foreground/12 rounded-lg p-4 shadow-xl">
                    <div className="text-sm md:text-base font-light text-foreground mb-2">
                      {place.name}
                    </div>
                    <div className="text-xs md:text-sm font-light text-muted-foreground leading-relaxed">
                      {place.description}
                    </div>
                  </div>
                </div>
              )}
            </Link>
          </div>
        );
      })}

      {/* Mobile scroll indicator - subtle hint */}
      {dimensions.width < 768 && scrollProgress < 0.8 && (
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10">
          <div className="text-xs text-muted-foreground/70 font-light text-center animate-pulse">
            Scroll to reveal
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate(-50%, -10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </div>
  );
}
