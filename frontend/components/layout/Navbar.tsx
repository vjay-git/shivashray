'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';

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
  const router = useRouter();
  const { user, isAuthenticated, setUser, logout } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const isHero        = pathname === '/';
  const isTransparent = isHero && !isScrolled;

  // Hydrate auth state from localStorage on first mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token && !isAuthenticated) {
      api.get('/auth/me')
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        });
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

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

          {/* Right: auth + Book Now + hamburger */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {hydrated && (
              <>
                {isAuthenticated ? (
                  <div className="hidden sm:flex items-center gap-2">
                    {/* Admin link */}
                    {user?.role === 'admin' && (
                      <Link
                        href="/admin"
                        className={`px-3 py-1.5 rounded-lg text-[12.5px] font-semibold tracking-wide transition-all duration-200 ${
                          isTransparent
                            ? 'text-amber-300 hover:bg-white/10'
                            : 'text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200'
                        }`}
                      >
                        Admin
                      </Link>
                    )}

                    {/* User avatar + name */}
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[13px] font-medium ${
                        isTransparent ? 'text-white/80' : 'text-slate-700'
                      }`}
                    >
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-gray-900 shrink-0"
                        style={{ background: GOLD }}
                      >
                        {initials}
                      </span>
                      <span className="hidden xl:block max-w-[120px] truncate">{user?.full_name}</span>
                    </div>

                    {/* Sign out */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                        isTransparent
                          ? 'text-white/60 hover:text-white hover:bg-white/10'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'
                      }`}
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className={`hidden sm:inline-flex items-center px-4 py-2 rounded-xl text-[13.5px] font-medium transition-all duration-200 ${
                      isTransparent
                        ? 'text-white/80 hover:text-white hover:bg-white/10'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    Sign in
                  </Link>
                )}
              </>
            )}

            {/* Book Now */}
            <Link
              href="/rooms"
              className={`hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.97] ${
                isTransparent
                  ? 'hover:shadow-[0_4px_20px_rgba(212,175,55,0.4)]'
                  : 'hover:shadow-[0_4px_20px_rgba(212,175,55,0.3)]'
              }`}
              style={{ background: GOLD, color: '#0F1115' }}
            >
              Book Now
            </Link>

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
        <div className="absolute inset-0 bg-[#FAF8F4]" />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 90% 55% at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 60%)',
          }}
        />

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

        <nav
          className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 gap-0"
          aria-label="Mobile navigation"
        >
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

          {/* Mobile auth links */}
          {hydrated && (
            <div className="mt-6 w-full max-w-[260px] flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  {user?.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center py-3 rounded-2xl text-[15px] font-semibold border-2 transition-all duration-200"
                      style={{ borderColor: GOLD, color: GOLD }}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <div className="flex items-center justify-center gap-2 py-2 text-slate-500 text-[14px]">
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-gray-900"
                      style={{ background: GOLD }}
                    >
                      {initials}
                    </span>
                    <span className="truncate max-w-[160px]">{user?.full_name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                    className="w-full flex items-center justify-center py-3 rounded-2xl text-[15px] font-medium text-slate-600 border border-slate-200 hover:border-slate-400 transition-all duration-200"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center py-3 rounded-2xl text-[15px] font-medium text-slate-600 border border-slate-200 hover:border-slate-400 transition-all duration-200"
                >
                  Sign in
                </Link>
              )}
            </div>
          )}

          <Link
            href="/rooms"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-4 w-full max-w-[260px] flex items-center justify-center gap-2 py-4 rounded-2xl text-[16px] font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
            style={{ background: GOLD, color: '#0F1115' }}
          >
            Book Now
          </Link>
        </nav>
      </div>
    </>
  );
}
