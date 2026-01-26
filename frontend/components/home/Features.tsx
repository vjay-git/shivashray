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
      className="relative py-24 md:py-32 lg:py-40"
      style={{
        background: 'linear-gradient(to bottom, #fefdfb 0%, #faf9f6 100%)',
      }}
    >
      {/* Very subtle gradient separation */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(250, 249, 246, 0.3) 50%, transparent 100%)',
        }}
      />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
        {/* Header - Simple, Clear Hierarchy */}
        <div
          className={`mb-16 md:mb-20 lg:mb-24 transition-opacity duration-1000 ease-out ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h2
            className="text-[40px] sm:text-[48px] md:text-[56px] lg:text-[64px] font-light text-[#1d1a16] leading-[1.1] tracking-[-0.015em] mb-4"
            style={{
              fontFamily: 'system-ui, -apple-system, "SF Pro Display", sans-serif',
              fontWeight: 300,
            }}
          >
            Our Spaces
          </h2>
          <p
            className="text-[18px] sm:text-[19px] md:text-[20px] text-[#5a5248] font-light leading-[1.6] max-w-[600px]"
            style={{ letterSpacing: '-0.01em' }}
          >
            Thoughtfully designed interiors that reflect the calm and elegance of Varanasi.
          </p>
        </div>

        {/* Desktop: Clean Horizontal Gallery */}
        <div className="hidden lg:block">
          <div
            ref={galleryRef}
            className="flex gap-8 overflow-x-auto scrollbar-hide"
            style={{
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[560px] transition-opacity duration-1000 ease-out group"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden shadow-[0_12px_48px_rgba(0,0,0,0.03)] group-hover:shadow-[0_16px_56px_rgba(0,0,0,0.05)] transition-shadow duration-500 ease-out">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    sizes="560px"
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
            style={{
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0 snap-center px-6 sm:px-8"
              >
                <div className="relative aspect-[4/3] rounded-[20px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
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

          {/* Minimal Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {galleryImages.map((_, index) => (
              <div
                key={index}
                className={`h-0.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-6 bg-[#1d1a16]'
                    : 'w-1.5 bg-[#c9c4bc]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
