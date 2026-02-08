'use client';

import { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';
import { Service } from '@/types';
import Link from 'next/link';

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
    fetchServices();
  }, []);

  useEffect(() => {
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
  }, [services]);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data.slice(0, 6)); // Show first 6 services
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  if (services.length === 0) {
    return null;
  }

  return (
    <section className="py-20 md:py-28 bg-[#F5F1E8] relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div
          className={`text-center mb-14 md:mb-16 transition-all duration-1000 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2
            className="text-[36px] sm:text-[44px] md:text-[52px] font-normal text-[#0E1A2B] mb-4 tracking-tight"
            style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
          >
            Our Services
          </h2>
          <p className="text-[17px] md:text-[18px] text-[#2F5D62] font-normal max-w-2xl mx-auto">
            Everything you need for a perfect stay
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={service.id}
              ref={(el) => { itemRefs.current[index] = el as HTMLDivElement | null; }}
              className={`bg-[#F8F6F2] rounded-[14px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-[#C6A75E]/10 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-500 ease-out ${
                visibleItems.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="text-3xl mb-4 text-[#2F5D62]">{service.icon || '✨'}</div>
              <h3 className="text-[20px] font-semibold text-[#0E1A2B] mb-2 tracking-tight">
                {service.name}
              </h3>
              {service.description && (
                <p className="text-[15px] text-[#2F5D62] font-normal leading-relaxed line-clamp-2">
                  {service.description}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/services"
            className="inline-flex items-center space-x-2 text-[17px] font-medium text-[#0E1A2B] hover:text-[#C6A75E] transition-colors duration-300"
          >
            <span>View all services</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
