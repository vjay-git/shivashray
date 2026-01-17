'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { hotelContent } from '@/lib/content/hotel-content';

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
    
    // Intersection Observer for scroll animations
    const observers = sectionRefs.current.map((ref, index) => {
      if (!ref) return null;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleSections((prev) => new Set(prev).add(index));
            }
          });
        },
        { threshold: 0.15, rootMargin: '-100px' }
      );
      
      observer.observe(ref);
      return observer;
    });

    // Image hover parallax effect
    const imageObservers = imageRefs.current.map((ref) => {
      if (!ref) return null;
      
      const handleMouseMove = (e: MouseEvent) => {
        const rect = ref.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const moveX = (x - centerX) / 20;
        const moveY = (y - centerY) / 20;
        
        const img = ref.querySelector('img');
        if (img) {
          img.style.transform = `scale(1.05) translate(${moveX}px, ${moveY}px)`;
        }
      };

      const handleMouseLeave = () => {
        const img = ref.querySelector('img');
        if (img) {
          img.style.transform = 'scale(1) translate(0, 0)';
        }
      };

      ref.addEventListener('mousemove', handleMouseMove);
      ref.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        ref.removeEventListener('mousemove', handleMouseMove);
        ref.removeEventListener('mouseleave', handleMouseLeave);
      };
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Hero Section - Full Width Cinematic */}
      <section 
        className={`relative h-screen flex items-center justify-center transition-all duration-1500 ease-out ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="/lordshiva1.jpg"
            alt="Spiritual heritage"
            fill
            priority
            quality={95}
            className="object-cover"
            sizes="100vw"
            style={{
              filter: 'brightness(0.4) contrast(1.1)',
            }}
          />
          {/* Subtle Vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
          }}></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <h1 
            className={`text-[64px] md:text-[96px] lg:text-[120px] font-light text-white tracking-tight mb-8 leading-[0.95] transition-all duration-1500 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            About {hotelContent.name}
          </h1>
          <p 
            className={`text-[21px] md:text-[24px] text-white/90 font-light leading-relaxed max-w-2xl mx-auto transition-all duration-1500 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            {hotelContent.description}
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10">
          <div className="w-6 h-10 rounded-full border border-white/30 flex items-start justify-center p-2">
            <div className="w-1 h-3 rounded-full bg-white/50 animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Brand Story - Asymmetric Layout */}
      <section 
        ref={(el) => { sectionRefs.current[0] = el as HTMLDivElement | null; }}
        className="relative min-h-screen flex items-center"
      >
        <div className="w-full">
          <div className={`max-w-7xl mx-auto px-6 lg:px-12 py-32 transition-all duration-1500 ease-out ${
            visibleSections.has(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
          }`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              {/* Text Content - Left Side */}
              <div className="lg:col-span-5 space-y-8">
                <div className="space-y-6">
                  <p className="text-[24px] md:text-[28px] text-white/90 leading-relaxed font-light">
                    {hotelContent.marketing.about.story}
                  </p>
                  <p className="text-[24px] md:text-[28px] text-white/90 leading-relaxed font-light">
                    {hotelContent.location.proximity}
                  </p>
                </div>
              </div>

              {/* Image - Right Side, Larger */}
              <div 
                ref={(el) => { imageRefs.current[0] = el as HTMLDivElement | null; }}
                className="lg:col-span-7 relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10"></div>
                <Image
                  src="/lordshiva2.jpg"
                  alt="Spiritual journey"
                  fill
                  quality={95}
                  className="object-cover transition-transform duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - Centered with Breathing Space */}
      <section 
        ref={(el) => { sectionRefs.current[1] = el as HTMLDivElement | null; }}
        className="relative py-32"
      >
        <div className={`max-w-4xl mx-auto px-6 lg:px-8 transition-all duration-1500 ease-out ${
          visibleSections.has(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
        }`}>
          <div className="text-center mb-20">
            <h2 className="text-[56px] md:text-[72px] font-light text-white tracking-tight mb-6">
              Our Values
            </h2>
            <p className="text-[21px] md:text-[24px] text-white/70 font-light leading-relaxed max-w-2xl mx-auto">
              {hotelContent.marketing.about.mission}
            </p>
          </div>

          <div className="space-y-8">
            {hotelContent.marketing.about.values.map((value, index) => (
              <div
                key={index}
                className={`border-b border-white/10 pb-12 last:border-0 transition-all duration-1000 ease-out ${
                  visibleSections.has(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: `${index * 150}ms`,
                }}
              >
                <h3 className="text-[32px] md:text-[40px] font-light text-white tracking-tight mb-4">
                  {value.title}
                </h3>
                <p className="text-[19px] md:text-[21px] text-white/70 font-light leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Promise - Full Width Image Section */}
      <section 
        ref={(el) => { sectionRefs.current[2] = el as HTMLDivElement | null; }}
        className="relative min-h-screen flex items-center"
      >
        {/* Full Width Background Image */}
        <div 
          ref={(el) => { imageRefs.current[1] = el as HTMLDivElement | null; }}
          className="absolute inset-0 h-full overflow-hidden group"
        >
          <Image
            src="/lordshiva1.jpg"
            alt="Spiritual experience"
            fill
            quality={95}
            className="object-cover transition-transform duration-700 ease-out"
            sizes="100vw"
            style={{
              filter: 'brightness(0.5) contrast(1.1)',
            }}
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>
        </div>

        {/* Content Overlay */}
        <div className={`relative z-10 max-w-5xl mx-auto px-6 lg:px-8 py-32 transition-all duration-1500 ease-out ${
          visibleSections.has(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
        }`}>
          <h2 className="text-[56px] md:text-[72px] lg:text-[96px] font-light text-white tracking-tight mb-12 leading-[0.95]">
            What Makes Us Different
          </h2>
          <div className="space-y-8 max-w-3xl">
            <p className="text-[21px] md:text-[24px] text-white/90 leading-relaxed font-light">
              We believe hospitality is not about grand gestures, but about the quiet moments of care that make you feel at home.
            </p>
            <p className="text-[21px] md:text-[24px] text-white/90 leading-relaxed font-light">
              Every detail, from the warmth of our welcome to the comfort of your room, is crafted with intention. We understand that your journey to Varanasi is more than a trip—it's a spiritual experience, a pilgrimage, a moment of reflection.
            </p>
            <p className="text-[21px] md:text-[24px] text-white/90 leading-relaxed font-light">
              Our location near the Kashi Vishwanath Temple places you at the heart of this ancient city's spiritual energy, while our modern amenities ensure your comfort is never compromised.
            </p>
          </div>
        </div>
      </section>

      {/* Closing Statement - Minimal */}
      <section 
        ref={(el) => { sectionRefs.current[3] = el as HTMLDivElement | null; }}
        className="relative min-h-[60vh] flex items-center justify-center"
      >
        <div className={`max-w-4xl mx-auto px-6 lg:px-8 text-center transition-all duration-1500 ease-out ${
          visibleSections.has(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
        }`}>
          <p className="text-[32px] md:text-[40px] lg:text-[48px] text-white/90 font-light leading-relaxed">
            We invite you to experience a place where tradition meets tranquility, where every moment is designed to honor your journey.
          </p>
        </div>
      </section>

      {/* Subtle CTA */}
      <section className="relative py-24 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <Link
            href="/rooms"
            className="inline-block px-12 py-4 text-[17px] font-light text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-500 ease-out"
          >
            Explore Our Rooms
          </Link>
        </div>
      </section>
    </div>
  );
}
