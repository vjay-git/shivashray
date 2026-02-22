'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';

// Curated gallery images - consistent sizing, Apple-style
const galleryImages = [
  {
    src: '/shivashray_images/Super Deluxe Room/66de74a8-c3ad-4a98-b49d-9e331e4eacfc.jpg',
    alt: 'Spacious suite with elegant furnishings',
  },
  {
    src: '/shivashray_images/Property Images/713583d6-b231-4eb5-82a8-4bbdcc4791fc.avif',
    alt: 'Luxurious interior with refined details',
  },
  {
    src: '/shivashray_images/Super Deluxe Room/63e98d7a-cc99-46c8-bf34-639f2e82cf22.jpg',
    alt: 'Elegant room with warm lighting',
  },
  {
    src: '/shivashray_images/Deluxe Room/5fd70227-d605-4c8a-a5b1-0b184bca0875.jpg',
    alt: 'Comfortable accommodation space',
  },
  {
    src: '/shivashray_images/Property Images/WhatsApp Image 2025-09-19 at 16.20.14_8319d8cc.jpg',
    alt: 'Sophisticated hotel interior design',
  },
  {
    src: '/shivashray_images/Super Deluxe Room/a0870948-f8d6-4c25-a834-a8d5615cee38.jpg',
    alt: 'Premium room with thoughtful amenities',
  },
  {
    src: '/shivashray_images/Deluxe Room/89ba8bcf-779c-4b64-99ee-5a85918d5a43.jpg',
    alt: 'Refined living space',
  },
];

export function Features() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  const sectionRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Touch/swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!galleryRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - galleryRef.current.offsetLeft);
    setScrollLeft(galleryRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !galleryRef.current) return;
    e.preventDefault();
    const x = e.touches[0].pageX - galleryRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    galleryRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Update current index on scroll (for mobile indicator)
  const handleScroll = useCallback(() => {
    if (!galleryRef.current || window.innerWidth >= 1024) return;
    
    const container = galleryRef.current;
    const scrollPosition = container.scrollLeft;
    const cardWidth = container.offsetWidth;
    const newIndex = Math.round(scrollPosition / cardWidth);
    
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < galleryImages.length) {
      setCurrentIndex(newIndex);
    }
  }, [currentIndex]);

  useEffect(() => {
    // Section visibility observer
    if (sectionRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => setIsVisible(true), 200);
            }
          });
        },
        { threshold: 0.1, rootMargin: '100px' }
      );
      observer.observe(sectionRef.current);

      return () => observer.disconnect();
    }
  }, []);

  useEffect(() => {
    // Scroll tracking for mobile
    const gallery = galleryRef.current;
    if (gallery && window.innerWidth < 1024) {
      gallery.addEventListener('scroll', handleScroll, { passive: true });
      
      return () => {
        gallery.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-28 lg:py-32"
      style={{ background: '#F8F6F2' }}
    >
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
        {/* Serif section title – luxury hierarchy */}
        <div
          className={`mb-14 md:mb-16 lg:mb-20 transition-opacity duration-1000 ease-out ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h2
            className="text-[36px] sm:text-[44px] md:text-[52px] font-normal text-[#0E1A2B] leading-[1.1] tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
          >
            A Glimpse Inside
          </h2>
          <p className="text-[17px] md:text-[18px] text-[#2F5D62] font-normal leading-[1.6] max-w-[560px]">
            Quiet, unhurried spaces — designed for pilgrims and travellers who value calm over clutter.
          </p>
        </div>

        {/* Desktop: Horizontal gallery with gold hover outline */}
        <div className="hidden lg:block">
          <div
            ref={galleryRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-2"
            style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
          >
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[520px] transition-opacity duration-1000 ease-out group"
                style={{ opacity: isVisible ? 1 : 0, transitionDelay: `${index * 80}ms` }}
              >
                <div className="relative aspect-[4/3] rounded-[14px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-500 ease-out group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] group-hover:ring-2 group-hover:ring-[#C6A75E]/40 group-hover:ring-offset-2 group-hover:ring-offset-[#F8F6F2]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    sizes="520px"
                    quality={100}
                    priority={index < 3}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: Swipeable Carousel */}
        <div className="lg:hidden">
          <div
            ref={galleryRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-6 sm:-mx-8"
            style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {galleryImages.map((image, index) => (
              <div key={index} className="w-full flex-shrink-0 snap-center px-6 sm:px-8">
                <div className="relative aspect-[4/3] rounded-[14px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    quality={100}
                    priority={index < 2}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {galleryImages.map((_, index) => (
              <div
                key={index}
                className={`h-0.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'w-6 bg-[#0E1A2B]' : 'w-1.5 bg-[#2F5D62]/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
