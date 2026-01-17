'use client';

import { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';
import { Service } from '@/types';
import { hotelContent } from '@/lib/content/hotel-content';
import Link from 'next/link';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [visibleServices, setVisibleServices] = useState<Set<number>>(new Set());
  const serviceRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
    fetchServices();
  }, []);

  useEffect(() => {
    const observers = serviceRefs.current.map((ref, index) => {
      if (!ref) return null;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleServices((prev) => new Set(prev).add(index));
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
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
          <p className="text-[15px] text-gray-600 font-light">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] relative overflow-hidden">
      {/* Subtle Background Mesh */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#007aff]/2 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#5856d6]/2 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-24 pb-16 md:pt-32 md:pb-24">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div
              className={`text-center transition-all duration-1000 ease-out ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <h1 className="text-[56px] md:text-[72px] font-semibold text-gray-900 mb-6 tracking-tight">
                {hotelContent.marketing.services.headline}
              </h1>
              <p className="text-[21px] text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
                {hotelContent.marketing.services.description}
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
          {services.length === 0 ? (
            <div
              className={`text-center py-32 transition-all duration-1000 ease-out ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-gray-100/50 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-[24px] font-semibold text-gray-900 mb-2">No Services Available</h3>
              <p className="text-[17px] text-gray-600 font-light">Check back later for our amazing services.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {services.map((service, index) => (
                  <div
                    key={service.id}
                    ref={(el) => { serviceRefs.current[index] = el as HTMLDivElement | null; }}
                    className={`bg-white/70 backdrop-blur-2xl rounded-[24px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/20 hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-500 ease-out ${
                      visibleServices.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{
                      transitionDelay: `${index * 50}ms`,
                    }}
                  >
                    <div className="text-5xl mb-6">{service.icon || '✨'}</div>
                    <h3 className="text-[24px] font-semibold text-gray-900 mb-3 tracking-tight">
                      {service.name}
                    </h3>
                    {service.description && (
                      <p className="text-[17px] text-gray-600 font-light leading-relaxed">
                        {service.description}
                      </p>
                    )}
          </div>
        ))}
              </div>

              {/* Call to Action Section */}
              <div
                className={`text-center transition-all duration-1000 ease-out ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '200ms' }}
              >
                <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] p-12 md:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/20 max-w-4xl mx-auto">
                  <h2 className="text-[40px] md:text-[48px] font-semibold text-gray-900 mb-4 tracking-tight">
                    Ready to Experience Luxury?
                  </h2>
                  <p className="text-[19px] text-gray-600 font-light mb-8 max-w-2xl mx-auto leading-relaxed">
                    Book your stay with us and enjoy all these premium services during your visit
                  </p>
                  <Link
                    href="/rooms"
                    className="inline-block px-8 py-4 bg-gray-900 text-white text-[17px] font-semibold rounded-2xl hover:bg-gray-800 active:scale-[0.98] transition-all duration-300 ease-out shadow-lg shadow-black/10"
                  >
                    Explore Our Rooms
                  </Link>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
