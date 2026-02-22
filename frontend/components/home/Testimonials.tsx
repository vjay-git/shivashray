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
    <section className="py-20 md:py-28 bg-[#F8F6F2] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div
          className={`text-center mb-14 md:mb-16 transition-all duration-1000 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2
            className="text-[36px] sm:text-[44px] md:text-[52px] font-normal text-[#0E1A2B] mb-4 tracking-tight"
            style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
          >
            Guest Stories
          </h2>
          <p className="text-[17px] md:text-[18px] text-[#2F5D62] font-normal max-w-2xl mx-auto">
            Experiences from our guests
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              ref={(el) => { itemRefs.current[index] = el as HTMLDivElement | null; }}
              className={`bg-[#F5F1E8] rounded-[14px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-[#C6A75E]/10 transition-all duration-500 ease-out ${
                visibleItems.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="mb-6">
                {/* Star rating */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="15" height="15" viewBox="0 0 15 15" fill="#C6A75E">
                      <path d="M7.5 1l1.69 3.427 3.78.549-2.735 2.666.645 3.763L7.5 9.625l-3.38 1.78.645-3.763L1.03 4.976l3.78-.549z" />
                    </svg>
                  ))}
                </div>
                <p
                  className="text-[17px] text-[#0E1A2B] font-normal leading-relaxed"
                  style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
                >
                  &ldquo;{testimonial.text}&rdquo;
                </p>
              </div>
              <div className="pt-6 border-t border-[#C6A75E]/15 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#2F5D62]/20 flex items-center justify-center text-[#0E1A2B] font-semibold text-[14px]">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#0E1A2B]">{testimonial.name}</p>
                    <p className="text-[12px] text-[#2F5D62] font-normal mt-0.5">{testimonial.location}</p>
                  </div>
                </div>
                <span className="text-[10px] text-[#2F5D62]/50 font-medium uppercase tracking-wider">Google</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
