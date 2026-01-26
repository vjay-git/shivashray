'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useMemo, useRef } from 'react';
import { hotelContent } from '@/lib/content/hotel-content';

export function Hero() {
  const [mounted, setMounted] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollProgress = Math.max(0, Math.min(1, -rect.top / (rect.height * 0.8)));
      
      // Very subtle opacity reduction on scroll
      setScrollOpacity(1 - scrollProgress * 0.3);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Generate fixed particle positions on mount
  const particles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${(i * 7.5 + 5) % 95}%`,
      top: `${(i * 11 + 10) % 90}%`,
      delay: `${i * 0.4}s`,
      duration: `${15 + (i % 5) * 2}s`,
    }));
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/kashi_temple.jpg"
          alt="Kashi Vishwanath Temple - Spiritual heritage of Varanasi"
          fill
          priority
          quality={100}
          className="object-cover"
          sizes="100vw"
        />
        {/* Minimal overlay - only for image tone adjustment */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/10 to-black/20"></div>
      </div>

      {/* Sacred Light Rays Animation */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"
            style={{
              left: `${20 + i * 20}%`,
              height: '100%',
              animation: `sacredRay ${8 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 1.5}s`,
              transform: `rotate(${-15 + i * 7}deg)`,
              transformOrigin: 'bottom center',
            }}
          />
        ))}
      </div>

      {/* Floating Sacred Particles */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 rounded-full bg-white/30"
            style={{
              left: particle.left,
              top: particle.top,
              animation: `floatParticle ${particle.duration} ease-in-out infinite`,
              animationDelay: particle.delay,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 w-full">
        <div
          className={`text-center transition-all duration-1000 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Main Heading - Clear, direct, instantly readable */}
          <div className="relative mb-6">
            {/* Smart adaptive gradient behind text only - 10-20% strength */}
            <div 
              className="absolute inset-0 pointer-events-none -z-10"
              style={{
                background: 'radial-gradient(ellipse 120% 70% at 50% 50%, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.08) 50%, transparent 80%)',
                maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
              }}
            />
            
            <h1 
              className="text-[48px] sm:text-[56px] md:text-[64px] lg:text-[72px] font-bold leading-[1.1] tracking-[-0.01em] relative z-10 mb-3"
              style={{
                color: '#FFFFFF',
                opacity: mounted ? Math.max(0.85, scrollOpacity) : 1,
                transform: mounted 
                  ? `translateY(0)` 
                  : `translateY(6px)`,
                transition: 'transform 500ms ease-out, opacity 200ms ease-out',
                textShadow: '0 2px 24px rgba(0, 0, 0, 0.5), 0 1px 4px rgba(0, 0, 0, 0.4)',
              }}
            >
              {hotelContent.name}
            </h1>
            
            {/* Subtitle - Clear description of what this place is */}
            <p 
              className="text-[18px] sm:text-[20px] md:text-[22px] font-normal leading-relaxed relative z-10 max-w-2xl mx-auto"
              style={{
                color: '#F5F5F5',
                opacity: mounted ? Math.max(0.8, scrollOpacity * 0.95) : 1,
                transform: mounted 
                  ? `translateY(0)` 
                  : `translateY(4px)`,
                transition: 'transform 500ms ease-out, opacity 200ms ease-out',
                transitionDelay: mounted ? '100ms' : '0ms',
                textShadow: '0 1px 16px rgba(0, 0, 0, 0.45), 0 1px 3px rgba(0, 0, 0, 0.35)',
              }}
            >
              Thoughtfully designed rooms for comfortable stays in the heart of Varanasi
            </p>
          </div>


          {/* Primary CTA - Book to Stay */}
          <div 
            className="flex justify-center mt-10"
            style={{
              opacity: mounted ? Math.max(0.7, scrollOpacity * 0.85) : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(4px)',
              transition: 'opacity 500ms ease-out, transform 500ms ease-out',
              transitionDelay: mounted ? '250ms' : '0ms',
            }}
          >
            <Link
              href="/rooms"
              className="inline-flex items-center justify-center px-10 py-4 min-h-[48px] bg-white text-gray-900 text-[17px] font-semibold rounded-xl transition-all duration-200 ease-out shadow-lg shadow-black/25 hover:bg-gray-50 hover:shadow-xl hover:shadow-black/30 active:scale-[0.98]"
            >
              Book Your Stay
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
