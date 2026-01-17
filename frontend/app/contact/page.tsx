'use client';

import { useState, useEffect, useRef } from 'react';
import { hotelContent } from '@/lib/content/hotel-content';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const nameValue = watch('name');
  const emailValue = watch('email');
  const phoneValue = watch('phone');
  const messageValue = watch('message');

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = async (data: ContactFormData) => {
    // In a real app, this would send to an API endpoint
    console.log('Contact form submitted:', data);
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      title: 'Address',
      content: hotelContent.location.address,
      link: '#',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
      title: 'Phone',
      content: hotelContent.contact.phone,
      link: `tel:${hotelContent.contact.phone.replace(/\s/g, '')}`,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      title: 'Email',
      content: hotelContent.contact.reservationEmail,
      link: `mailto:${hotelContent.contact.reservationEmail}`,
    },
  ];

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
                Get in Touch
              </h1>
              <p className="text-[21px] text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
                We're here to help. Reach out and we'll respond as soon as possible.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-6xl mx-auto px-6 lg:px-8 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div
              className={`transition-all duration-1000 ease-out ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '100ms' }}
            >
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <a
                    key={index}
                    href={info.link}
                    className="group block bg-white/70 backdrop-blur-sm rounded-[24px] p-6 border border-gray-100/60 hover:border-gray-200/80 hover:bg-white/70 hover:shadow-lg transition-all duration-300 ease-out"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-100/50 flex items-center justify-center text-gray-600 group-hover:text-gray-900 transition-colors">
                        {info.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[17px] font-semibold text-gray-900 mb-1">
                          {info.title}
                        </h3>
                        <p className="text-[15px] text-gray-600 font-light leading-relaxed break-words">
                          {info.content}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div
              className={`transition-all duration-1000 ease-out ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] p-8 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/20">
                <div className="mb-8">
                  <h2 className="text-[32px] font-semibold text-gray-900 mb-2 tracking-tight">
                    Send a Message
                  </h2>
                  <p className="text-[17px] text-gray-600 font-light">
                    We'll get back to you soon
                  </p>
                </div>

                {submitted && (
                  <div className="mb-6 bg-emerald-50/80 backdrop-blur-sm border border-emerald-100 rounded-2xl px-5 py-4 animate-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-[15px] font-medium text-emerald-900">
                        Thank you! We'll get back to you soon.
                      </span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name Field */}
                  <div className="relative">
                    <input
                      type="text"
                      {...register('name')}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 pt-6 pb-2 bg-gray-50/50 border border-gray-200/60 rounded-2xl text-[17px] text-gray-900 placeholder-transparent focus:outline-none focus:ring-0 focus:border-[#007aff]/40 focus:bg-white transition-all duration-300 ease-out"
                      placeholder="Name"
                    />
                    <label
                      className={`absolute left-4 transition-all duration-300 ease-out pointer-events-none ${
                        nameValue || focusedField === 'name'
                          ? 'top-2 text-[13px] text-[#007aff] font-medium'
                          : 'top-4 text-[17px] text-gray-500'
                      }`}
                    >
                      Name
                    </label>
                    {errors.name && (
                      <p className="mt-2 text-[13px] text-red-600 font-medium px-1">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="relative">
                    <input
                      type="email"
                      {...register('email')}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 pt-6 pb-2 bg-gray-50/50 border border-gray-200/60 rounded-2xl text-[17px] text-gray-900 placeholder-transparent focus:outline-none focus:ring-0 focus:border-[#007aff]/40 focus:bg-white transition-all duration-300 ease-out"
                      placeholder="Email"
                    />
                    <label
                      className={`absolute left-4 transition-all duration-300 ease-out pointer-events-none ${
                        emailValue || focusedField === 'email'
                          ? 'top-2 text-[13px] text-[#007aff] font-medium'
                          : 'top-4 text-[17px] text-gray-500'
                      }`}
                    >
                      Email
                    </label>
                    {errors.email && (
                      <p className="mt-2 text-[13px] text-red-600 font-medium px-1">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div className="relative">
                    <input
                      type="tel"
                      {...register('phone')}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 pt-6 pb-2 bg-gray-50/50 border border-gray-200/60 rounded-2xl text-[17px] text-gray-900 placeholder-transparent focus:outline-none focus:ring-0 focus:border-[#007aff]/40 focus:bg-white transition-all duration-300 ease-out"
                      placeholder="Phone (Optional)"
                    />
                    <label
                      className={`absolute left-4 transition-all duration-300 ease-out pointer-events-none ${
                        phoneValue || focusedField === 'phone'
                          ? 'top-2 text-[13px] text-[#007aff] font-medium'
                          : 'top-4 text-[17px] text-gray-500'
                      }`}
                    >
                      Phone <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                  </div>

                  {/* Message Field */}
                  <div className="relative">
                    <textarea
                      {...register('message')}
                      rows={5}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 pt-6 pb-2 bg-gray-50/50 border border-gray-200/60 rounded-2xl text-[17px] text-gray-900 placeholder-transparent focus:outline-none focus:ring-0 focus:border-[#007aff]/40 focus:bg-white transition-all duration-300 ease-out resize-none"
                      placeholder="Message"
                    />
                    <label
                      className={`absolute left-4 transition-all duration-300 ease-out pointer-events-none ${
                        messageValue || focusedField === 'message'
                          ? 'top-2 text-[13px] text-[#007aff] font-medium'
                          : 'top-4 text-[17px] text-gray-500'
                      }`}
                    >
                      Message
                    </label>
                    {errors.message && (
                      <p className="mt-2 text-[13px] text-red-600 font-medium px-1">{errors.message.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-4 bg-gray-900 text-white text-[17px] font-semibold rounded-2xl hover:bg-gray-800 active:scale-[0.98] transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-lg shadow-black/10"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center space-x-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Sending...</span>
                      </span>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
