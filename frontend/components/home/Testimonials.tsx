'use client';

import { useEffect, useState, useRef } from 'react';
import { hotelContent } from '@/lib/content/hotel-content';

const testimonials = [
  {
    name: 'Rajesh Kumar',
    location: 'Delhi, India',
    text: 'An absolutely wonderful experience! The staff was incredibly welcoming and the rooms were spotless. The location is perfect for exploring Varanasi.',
  },
  {
    name: 'Sarah Johnson',
    location: 'London, UK',
    text: `${hotelContent.name} exceeded all our expectations. The blend of traditional hospitality and modern amenities made our stay unforgettable.`,
  },
  {
    name: 'Amit Patel',
    location: 'Mumbai, India',
    text: 'Best hotel experience in Varanasi! The service is exceptional, and the rooms are luxurious. Highly recommend to anyone visiting the city.',
  },
];

export function Testimonials() {
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
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div 
          className={`text-center mb-16 transition-all duration-1000 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-[48px] md:text-[56px] font-semibold text-gray-900 mb-4 tracking-tight">
            Guest Stories
          </h2>
          <p className="text-[21px] text-gray-600 font-light max-w-2xl mx-auto">
            Experiences from our guests
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              ref={(el) => { itemRefs.current[index] = el as HTMLDivElement | null; }}
              className={`bg-white/70 backdrop-blur-sm rounded-[24px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-gray-100/60 hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)] transition-all duration-500 ease-out ${
                visibleItems.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              {/* Quote */}
              <div className="mb-6">
                <svg className="w-8 h-8 text-gray-300 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 9.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 10-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-[17px] text-gray-700 font-light leading-relaxed">
                  {testimonial.text}
                </p>
              </div>

              {/* Author */}
              <div className="pt-6 border-t border-gray-100/60">
                <p className="text-[15px] font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-[13px] text-gray-600 font-light mt-1">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
