'use client';

import { useEffect, useState, useRef } from 'react';
import { hotelContent } from '@/lib/content/hotel-content';

const locationIcon = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const walkIcon = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const amenityIcon = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

export function LocationAmenities() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { location, propertyHighlights } = hotelContent;
  const walkable = 'walkable' in location && typeof location.walkable === 'object' ? location.walkable : null;
  const highlights = 'highlights' in location ? location.highlights : [];

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setTimeout(() => setIsVisible(true), 150);
        });
      },
      { threshold: 0.1, rootMargin: '80px' }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-28"
      style={{ background: '#F5F1E8' }}
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
        {/* Why Choose Us – serif title, clean grid */}
        <div
          className={`mb-14 md:mb-16 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          <h2
            className="text-[36px] sm:text-[44px] md:text-[52px] font-normal text-[#0E1A2B] leading-[1.1] tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
          >
            Why Choose Us
          </h2>
          <p className="text-[17px] md:text-[18px] text-[#2F5D62] font-normal leading-[1.6] max-w-[640px]">
            City center hotel — iconic destinations, street food and saree wholesale market very near. No vehicle needed; everything is walkable.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* City center */}
          <div
            className={`bg-[#F8F6F2] rounded-[14px] p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-[#C6A75E]/10 transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <div className="flex items-center gap-3 mb-5 text-[#0E1A2B]">
              <span className="text-[#C6A75E]">{locationIcon}</span>
              <h3 className="text-[20px] font-semibold tracking-tight">City Center</h3>
            </div>
            <p className="text-[15px] text-[#2F5D62] leading-relaxed mb-4">
              Iconic tourist destinations, famous street food and the saree wholesale market are all very near.
            </p>
            {highlights.length > 0 && (
              <ul className="space-y-2 text-[15px] text-[#0E1A2B] font-normal">
                {highlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#C6A75E] mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Walkable landmarks */}
          <div
            className={`bg-[#F8F6F2] rounded-[14px] p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-[#C6A75E]/10 transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="flex items-center gap-3 mb-5 text-[#0E1A2B]">
              <span className="text-[#C6A75E]">{walkIcon}</span>
              <h3 className="text-[20px] font-semibold tracking-tight">Walkable Distance</h3>
            </div>
            {walkable?.description && (
              <p className="text-[15px] text-[#2F5D62] leading-relaxed mb-4">
                {walkable.description}
              </p>
            )}
            {walkable?.landmarks && walkable.landmarks.length > 0 && (
              <ul className="space-y-3">
                {walkable.landmarks.map((landmark, i) => (
                  <li key={i} className="flex items-center justify-between text-[15px]">
                    <span className="text-[#0E1A2B] font-medium">{landmark.name}</span>
                    <span className="text-[#2F5D62] font-normal">{landmark.time} walk</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Amenities */}
          <div
            className={`bg-[#F8F6F2] rounded-[14px] p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-[#C6A75E]/10 transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <div className="flex items-center gap-3 mb-5 text-[#0E1A2B]">
              <span className="text-[#C6A75E]">{amenityIcon}</span>
              <h3 className="text-[20px] font-semibold tracking-tight">Latest Amenities</h3>
            </div>
            <p className="text-[15px] text-[#2F5D62] leading-relaxed mb-4">
              Lift, 24-hour hot water, centralized AC and smart doors — all the latest amenities for a comfortable stay.
            </p>
            {propertyHighlights && propertyHighlights.length > 0 && (
              <ul className="space-y-2 text-[15px] text-[#0E1A2B] font-normal">
                {propertyHighlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#0F3D3E] mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
