'use client';

import { useEffect, useState, useRef } from 'react';
import { hotelContent } from '@/lib/content/hotel-content';

const experiences = [
  {
    title: 'Spiritual Connection',
    description: 'Located near sacred sites, we help you connect with Varanasi\'s rich spiritual heritage.',
    icon: '🕉️',
  },
  {
    title: 'Personalized Service',
    description: 'Our dedicated team ensures every guest receives personalized attention and care.',
    icon: '✨',
  },
  {
    title: 'Traditional Hospitality',
    description: 'Experience authentic Indian hospitality blended with modern comfort and convenience.',
    icon: '🏛️',
  },
];

export function Features() {
  const [mounted, setMounted] = useState(false);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
    
    const observers = itemRefs.current.map((ref, index) => {
      if (!ref) return null;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleItems((prev) => new Set(prev).add(index));
            }
          });
        },
        { threshold: 0.2, rootMargin: '-50px' }
      );
      
      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  return (
    <section className="py-24 md:py-32 bg-[#f5f5f7] relative overflow-hidden">
      {/* Subtle Background Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#007aff]/2 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#5856d6]/2 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div 
          className={`text-center mb-16 transition-all duration-1000 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-[48px] md:text-[56px] font-semibold text-gray-900 mb-4 tracking-tight">
            Our Experience
          </h2>
          <p className="text-[21px] text-gray-600 font-light max-w-2xl mx-auto">
            What makes {hotelContent.name} different
          </p>
        </div>

        {/* Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {experiences.map((experience, index) => (
            <div
              key={index}
              ref={(el) => { itemRefs.current[index] = el as HTMLDivElement | null; }}
              className={`bg-white/70 backdrop-blur-2xl rounded-[28px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/20 hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-500 ease-out ${
                visibleItems.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <div className="text-5xl mb-6">{experience.icon}</div>
              <h3 className="text-[24px] font-semibold text-gray-900 mb-3 tracking-tight">
                {experience.title}
              </h3>
              <p className="text-[17px] text-gray-600 font-light leading-relaxed">
                {experience.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
