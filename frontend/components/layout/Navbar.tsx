'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getBookingEngineUrl } from '@/lib/booking-engine';

const GOLD = '#D4AF37';

const navLinks = [
  { href: '/',          label: 'Home' },
  { href: '/explore',   label: 'Explore' },
  { href: '/rooms',     label: 'Rooms' },
  { href: '/services',  label: 'Experiences' },
  { href: '/about',     label: 'About' },
  { href: '/contact',   label: 'Contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const bookingEngineUrl = getBookingEngineUrl();
  const [isScrolled, setIsScrolled]       = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isHero        = pathname === '/';
  const isTransparent = isHero && !isScrolled;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);

  return (
    <>
      {/* ── TOP NAVBAR ─────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out"
        style={{
          height: 72,
          background: isTransparent ? 'transparent' : 'rgba(248,246,242,0.97)',
          backdropFilter: isTransparent ? 'none' : 'blur(18px)',
          WebkitBackdropFilter: isTransparent ? 'none' : 'blur(18px)',
          borderBottom: isTransparent ? 'none' : '1px solid rgba(0,0,0,0.06)',
          boxShadow: isTransparent ? 'none' : '0 2px 20px rgba(0,0,0,0.05)',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 h-full flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0" aria-label="Shiv Ashray">
            <Image
              src="/shivashray.png"
              alt="Shiv Ashray"
              width={200}
              height={52}
              className={`h-12 w-auto object-contain transition-all duration-500 ${
                isTransparent ? 'brightness-0 invert' : ''
              }`}
              priority
            />
          </Link>

          {/* Desktop nav links — centered */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-lg text-[14px] font-medium tracking-[0.015em] transition-all duration-200 ${
                    isTransparent
                      ? isActive
                        ? 'text-white'
                        : 'text-white/65 hover:text-white hover:bg-white/10'
                      : isActive
                        ? 'text-slate-900'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: GOLD }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Book Now CTA + mobile hamburger */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={bookingEngineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.97] ${
                isTransparent
                  ? 'text-[#0F1115] hover:shadow-[0_4px_20px_rgba(212,175,55,0.4)]'
                  : 'hover:shadow-[0_4px_20px_rgba(212,175,55,0.3)]'
              }`}
              style={{ background: GOLD, color: '#0F1115' }}
            >
              Book Now
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M2 10L10 2M10 2H5M10 2V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

            {/* Hamburger — mobile only */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2.5 -mr-1 rounded-lg transition-all duration-200 ${
                isTransparent
                  ? 'text-white hover:bg-white/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                {isMobileMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
                }
              </svg>
            </button>
          </div>

        </div>
      </nav>

      {/* ── MOBILE FULL-SCREEN MENU ─────────────────────────────────── */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-[380ms] ease-out ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-[#FAF8F4]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 90% 55% at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 60%)',
          }}
        />

        {/* Close */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-[18px] right-5 p-2.5 text-slate-500 hover:text-slate-900 transition-colors z-10"
          aria-label="Close menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Nav items — vertically centered */}
        <nav
          className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 gap-0"
          aria-label="Mobile navigation"
        >
          {/* Om watermark */}
          <span
            className="absolute top-24 left-1/2 -translate-x-1/2 text-[6rem] leading-none select-none pointer-events-none"
            style={{ color: `${GOLD}08`, fontFamily: 'serif' }}
          >
            ॐ
          </span>

          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`relative py-3.5 text-[24px] font-light tracking-tight transition-all duration-200 ${
                  isActive ? 'text-slate-900' : 'text-slate-400 hover:text-slate-700'
                }`}
                style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
              >
                {link.label}
                {isActive && (
                  <span
                    className="absolute -bottom-0 left-0 right-0 h-px"
                    style={{ background: `linear-gradient(90deg, ${GOLD}90, transparent)` }}
                  />
                )}
              </Link>
            );
          })}

          <a
            href={bookingEngineUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-8 w-full max-w-[260px] flex items-center justify-center gap-2 py-4 rounded-2xl text-[16px] font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
            style={{ background: GOLD, color: '#0F1115' }}
          >
            Book Now
          </a>
        </nav>
      </div>
    </>
  );
}
