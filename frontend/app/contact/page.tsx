'use client';

import { useState, useEffect } from 'react';
import { hotelContent } from '@/lib/content/hotel-content';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PremiumBackground } from '@/components/layout/PremiumBackground';

const GOLD = '#D4AF37';

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Please choose or enter a subject'),
  message: z.string().min(10, 'Please write at least a few words'),
});

type ContactFormData = z.infer<typeof contactSchema>;

function SacredDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-8 md:py-10" aria-hidden>
      <div className="h-px w-20 bg-gradient-to-r from-transparent via-slate-300/60 to-slate-300/60 dark:via-slate-500/40 dark:to-slate-500/40" />
      <div className="w-1.5 h-1.5 rounded-full bg-slate-400/50 dark:bg-slate-500/40" />
      <div className="h-px w-20 bg-gradient-to-l from-transparent via-slate-300/60 to-slate-300/60 dark:via-slate-500/40 dark:to-slate-500/40" />
    </div>
  );
}

const SUBJECT_OPTIONS = [
  'Reservation enquiry',
  'Experiences & services',
  'General question',
  'Feedback',
  'Other',
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { subject: '' },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = async (data: ContactFormData) => {
    // In a real app, POST to an API or use mailto
    console.log('Contact form submitted:', data);
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 6000);
  };

  const phoneClean = hotelContent.contact.phone.replace(/\s/g, '').replace('+', '');
  const whatsappUrl = `https://wa.me/${phoneClean}`;
  const checkIn = hotelContent.policies?.checkIn?.time ?? '12:00 PM';
  const checkOut = hotelContent.policies?.checkOut?.time ?? '11:00 AM';

  const inputBase =
    'w-full px-4 py-3.5 rounded-[14px] text-[16px] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-white/90 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/40 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]/50 transition-all duration-200 leading-relaxed';

  return (
    <PremiumBackground variant="rooms">
      <div className="fixed inset-0 pointer-events-none z-[1]" style={{ boxShadow: 'inset 0 0 120px rgba(0,0,0,0.04)' }} />
      <div className="fixed inset-0 pointer-events-none z-[1] hidden dark:block" style={{ boxShadow: 'inset 0 0 140px rgba(0,0,0,0.2)' }} />

      <div className="relative z-0">
        {/* A. Opening Invitation */}
        <section className="pt-24 pb-12 md:pt-28 md:pb-16">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div
              className={`text-center transition-all duration-[600ms] ease-out ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <h1
                className="text-4xl md:text-5xl font-light text-slate-900 dark:text-slate-100 mb-6 tracking-tight leading-[1.1]"
                style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
              >
                We Welcome Your Message
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
                Whether you seek guidance, reservations, or simply wish to connect—we are here.
              </p>
            </div>
            <SacredDivider />
          </div>
        </section>

        {/* B. Contact Layout: Form (left) + Details (right) */}
        <section className="max-w-6xl mx-auto px-6 lg:px-8 pb-20 md:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
            {/* C. Contact Form */}
            <div
              className={`transition-all duration-[600ms] ease-out order-2 lg:order-1 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: '80ms' }}
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label htmlFor="contact-name" className="block text-[13px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    {...register('name')}
                    className={inputBase}
                    placeholder="Your name"
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1.5 text-[13px] text-rose-600/90 dark:text-rose-400/90 font-light">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-[13px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    {...register('email')}
                    className={inputBase}
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1.5 text-[13px] text-rose-600/90 dark:text-rose-400/90 font-light">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-phone" className="block text-[13px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                    Phone <span className="font-normal text-slate-400 dark:text-slate-500">(optional)</span>
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    {...register('phone')}
                    className={inputBase}
                    placeholder="+91 …"
                    autoComplete="tel"
                  />
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-[13px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                    Subject
                  </label>
                  <select
                    id="contact-subject"
                    {...register('subject')}
                    className={inputBase}
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? 'subject-error' : undefined}
                  >
                    <option value="">Choose one…</option>
                    {SUBJECT_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.subject && (
                    <p id="subject-error" className="mt-1.5 text-[13px] text-rose-600/90 dark:text-rose-400/90 font-light">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-[13px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    {...register('message')}
                    rows={5}
                    className={`${inputBase} resize-y min-h-[140px]`}
                    placeholder="Your message…"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-1.5 text-[13px] text-rose-600/90 dark:text-rose-400/90 font-light">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {submitted && (
                  <div className="rounded-[14px] px-4 py-3 bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-emerald-800 dark:text-emerald-200 text-[15px] font-light">
                    Thank you. We will be in touch soon.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-[14px] text-[16px] font-medium text-slate-900 dark:text-slate-100 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  style={{
                    background: GOLD,
                    color: '#0F1115',
                  }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden>
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending…
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>

            {/* D. Contact Information Panel */}
            <div
              className={`transition-all duration-[600ms] ease-out order-1 lg:order-2 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: '120ms' }}
            >
              <div className="lg:sticky lg:top-24 rounded-[18px] p-8 md:p-10 bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
                <h2
                  className="text-2xl font-light text-slate-900 dark:text-slate-100 mb-8 tracking-tight"
                  style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
                >
                  Reach us
                </h2>

                <div className="space-y-6">
                  <a
                    href={hotelContent.location.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-4 text-slate-700 dark:text-slate-300 font-light leading-relaxed hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-200 group"
                  >
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-[#D4AF37] transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </span>
                    <span className="text-[15px]">{hotelContent.location.address}</span>
                  </a>

                  <a
                    href={`tel:${phoneClean}`}
                    className="flex gap-4 text-slate-700 dark:text-slate-300 font-light leading-relaxed hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-200 group"
                  >
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-[#D4AF37] transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    </span>
                    <span className="text-[15px]">{hotelContent.contact.phone}</span>
                  </a>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-4 text-slate-700 dark:text-slate-300 font-light leading-relaxed hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-200 group"
                  >
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-[#D4AF37] transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </span>
                    <span className="text-[15px]">WhatsApp</span>
                  </a>

                  <a
                    href={`mailto:${hotelContent.contact.email}`}
                    className="flex gap-4 text-slate-700 dark:text-slate-300 font-light leading-relaxed hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-200 group"
                  >
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-[#D4AF37] transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </span>
                    <span className="text-[15px] break-all">{hotelContent.contact.email}</span>
                  </a>

                  <div className="pt-4 border-t border-slate-200/50 dark:border-slate-700/40">
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 font-light mb-1">Check-in / Check-out</p>
                    <p className="text-[15px] text-slate-700 dark:text-slate-300 font-light">
                      {checkIn} / {checkOut}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* E. Map */}
        <section className="max-w-6xl mx-auto px-6 lg:px-8 pb-16 md:pb-24">
          <div className="rounded-[20px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-slate-200/50 dark:border-slate-700/40">
            <div className="relative w-full aspect-[21/9] md:aspect-[3/1] bg-slate-100 dark:bg-slate-800/50">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3609.1234567890123!2d83.0104!3d25.3176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e2db76febcf4d%3A0x68131710853ff0b5!2sKashi%20Vishwanath%20Temple!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(20%) contrast(1.02)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
                title="Shivashray location on map"
              />
            </div>
            <a
              href={hotelContent.location.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block py-4 px-6 text-center text-[14px] font-medium text-slate-600 dark:text-slate-400 hover:text-[#D4AF37] transition-colors duration-200"
            >
              Open in Google Maps
            </a>
          </div>
        </section>

        <SacredDivider />

        {/* F. Closing Line */}
        <section className="max-w-4xl mx-auto px-6 lg:px-8 pb-24 md:pb-32">
          <div className="text-center">
            <p
              className="text-xl md:text-2xl font-light text-slate-700 dark:text-slate-300 leading-relaxed mb-8"
              style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
            >
              We look forward to welcoming you.
            </p>
            <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-slate-300/60 to-transparent dark:via-slate-500/40" />
          </div>
        </section>
      </div>
    </PremiumBackground>
  );
}
