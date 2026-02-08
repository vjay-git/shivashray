'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore, useSidebarStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useRouter, usePathname } from 'next/navigation';
import { hotelContent } from '@/lib/content/hotel-content';

export function Navbar() {
  const { user, isAuthenticated, setUser, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    // Fetch current user on mount
    const fetchUser = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data);
        } catch (error) {
          logout();
        }
      }
    };
    fetchUser();
  }, [setUser, logout]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsUserMenuOpen(false);
  };

  const GOLD = '#D4AF37';
  const primaryNav = [
    { href: '/', label: 'Home' },
    { href: '/explore', label: 'Explore' },
    { href: '/rooms', label: 'Rooms' },
    { href: '/services', label: 'Experiences' },
    { href: '/#exclusive-deals', label: 'Exclusive Deals' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Messages' },
  ];
  const secondaryNav = [
    { href: '/contact', label: 'Settings' },
    { href: '/contact', label: 'Support' },
  ];

  const { isCollapsed: isSidebarCollapsed, toggleSidebar, setSidebarCollapsed } = useSidebarStore();

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarCollapsed');
      if (saved) {
        try {
          const isCollapsed = JSON.parse(saved);
          setSidebarCollapsed(isCollapsed);
        } catch (error) {
          console.error('Error parsing sidebar state:', error);
        }
      }
    }
  }, [setSidebarCollapsed]);

  return (
    <>
      {/* Mobile/Tablet: Sacred entrance bar – calm, minimal, layered */}
      <nav
        className={`lg:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
          isScrolled
            ? 'bg-[#F8F6F2]/95 dark:bg-[#0F1115]/95 shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)]'
            : 'bg-[#F8F6F2]/85 dark:bg-[#0F1115]/85'
        } backdrop-blur-md border-b border-slate-200/30 dark:border-slate-700/40`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center min-h-[68px] h-[68px] gap-4">
            {/* Left: Logo only */}
            <Link href="/" className="flex items-center flex-shrink-0 min-w-0" aria-label="Home">
              <Image
                src="/shivashray.png"
                alt=""
                width={160}
                height={42}
                className="h-10 w-auto object-contain object-left dark:invert dark:opacity-95"
                priority
              />
            </Link>

            {/* Right: Book (gold outline) + Menu */}
            <div className="flex flex-1 justify-end items-center gap-1 flex-shrink-0">
              <Link
                href="/rooms"
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-full text-[13px] font-medium text-slate-800 dark:text-slate-200 border border-[#D4AF37]/60 hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] transition-all duration-200"
                style={{ color: 'inherit' }}
              >
                Book
              </Link>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 -mr-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:opacity-80 transition-all duration-200"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                <svg
                  className="w-6 h-6 transition-transform duration-300 ease-out"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu: Full-screen sacred overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-[400ms] ease-out ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        {/* Backdrop: base + golden bloom */}
        <div className="absolute inset-0 bg-[#F8F6F2] dark:bg-[#0F1115]" />
        <div
          className="absolute inset-0 dark:hidden"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,175,55,0.06) 0%, transparent 50%)',
          }}
        />
        <div
          className="absolute inset-0 hidden dark:block"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 50%)',
          }}
        />
        {/* Sacred geometry watermark (1–2%) */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-32 h-32 pointer-events-none opacity-[0.02] dark:opacity-[0.025]">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-slate-800 dark:text-slate-200">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="0.5" />
            <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.5" />
            <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-4 right-4 p-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 z-10"
          aria-label="Close menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Menu items – centered, generous spacing, stagger */}
        <nav className="relative z-10 flex flex-col items-center justify-center min-h-screen py-24 px-6" aria-label="Mobile navigation">
          <div className="flex flex-col items-center gap-2 text-center">
            {primaryNav.map((link, index) => {
              const hrefNorm = link.href.replace(/#.*$/, '');
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : link.href.startsWith('/#')
                    ? false
                    : pathname === link.href || pathname.startsWith(hrefNorm + '/');
              return (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-3 px-4 text-[20px] font-light text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-300 ${
                    isActive ? 'border-b border-[#D4AF37]' : 'border-b border-transparent'
                  }`}
                  style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
                >
                  {link.label}
                </Link>
              );
            })}
            {isAuthenticated && (
              <>
                <Link
                  href="/bookings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-3 px-4 text-[20px] font-light border-b transition-all duration-300 ${
                    pathname.startsWith('/bookings')
                      ? 'border-[#D4AF37] text-slate-900 dark:text-slate-100'
                      : 'border-transparent text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                  style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
                >
                  My Bookings
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-3 px-4 text-[20px] font-light text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-slate-100 border-b border-transparent transition-all duration-300"
                    style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
            <Link
              href="/rooms"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-4 py-3 px-6 rounded-full text-[16px] font-medium transition-all duration-200 hover:opacity-90"
              style={{ background: GOLD, color: '#0F1115' }}
            >
              Book Now
            </Link>
            {isAuthenticated ? (
              <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-700/40 flex flex-col items-center gap-2">
                <p className="text-[14px] font-medium text-slate-700 dark:text-slate-300">{user?.full_name}</p>
                <button
                  type="button"
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="text-[14px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="mt-6 flex gap-4">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[15px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[15px] font-medium py-2 px-4 rounded-full border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Desktop: Sacred Sidebar – Temple corridor, ivory/charcoal, gold accent */}
      <aside
        className={`hidden lg:flex fixed left-0 top-0 bottom-0 z-50 flex-col transition-[width] duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-[88px]' : 'w-[296px]'
        } bg-[#F8F6F2] dark:bg-[#0F1115]`}
        style={{ boxShadow: '4px 0 32px rgba(0,0,0,0.06)' }}
      >
        {/* Light: warm ivory + subtle gradient; Dark: deep charcoal + amber bloom (via CSS var or class) */}
        <div
          className="absolute inset-0 pointer-events-none rounded-r-[2px] dark:hidden"
          style={{
            background: 'linear-gradient(180deg, #F8F6F2 0%, #F5F1E8 50%, #F2EEE6 100%)',
            boxShadow: 'inset -1px 0 0 rgba(0,0,0,0.04)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none rounded-r-[2px] hidden dark:block"
          style={{
            background: 'linear-gradient(180deg, rgba(212,175,55,0.04) 0%, transparent 20%, #0F1115 50%, #0C0A10 100%)',
            boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.03)',
          }}
        />
        {/* Sacred geometry watermark – 2% opacity */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-24 h-24 pointer-events-none opacity-[0.02] dark:opacity-[0.025]">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-slate-800 dark:text-slate-200">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="0.5" />
            <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.5" />
            <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="w-full h-full flex flex-col py-6 px-4 relative z-0">
          {/* A. Top Brand Zone */}
          <Link
            href="/"
            className={`flex items-center mb-5 ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}
          >
            {isSidebarCollapsed ? (
              <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-slate-200/60 dark:ring-slate-600/40">
                <Image src="/collapsedshiva.jpg" alt="" width={40} height={40} className="w-full h-full object-cover" priority />
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <Image
                  src="/shivashray.png"
                  alt=""
                  width={140}
                  height={36}
                  className="h-9 w-auto object-contain dark:invert dark:opacity-95"
                  priority
                />
              </div>
            )}
          </Link>
          {/* Thin gradient divider */}
          <div className="h-px w-full mb-5 flex-shrink-0 bg-gradient-to-r from-transparent via-slate-300/50 to-transparent dark:via-slate-600/40" />

          {/* B. Primary Navigation */}
          <nav className="flex-1 space-y-0.5 min-h-0 overflow-y-auto">
            {primaryNav.map((link) => {
              const hrefNorm = link.href.replace(/#.*$/, '');
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : link.href.startsWith('/#')
                    ? false
                    : pathname === link.href || pathname.startsWith(hrefNorm + '/');
              return (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  className={`group flex items-center gap-3 rounded-[16px] py-3 px-4 transition-all duration-200 ${
                    isSidebarCollapsed ? 'justify-center px-0' : ''
                  } ${isActive ? 'bg-slate-200/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 backdrop-blur-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 hover:text-slate-800 dark:hover:text-slate-200 hover:-translate-y-0.5'}`}
                  style={{
                    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                    borderLeft: isActive ? `3px solid ${GOLD}` : '3px solid transparent',
                    boxShadow: isActive ? '0 0 0 1px rgba(212,175,55,0.06)' : undefined,
                  }}
                >
                  <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5 [&>svg]:stroke-[1.5]">
                    {link.href === '/' && <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
                    {link.href === '/explore' && <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
                    {link.href === '/rooms' && <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
                    {(link.href === '/services' || link.label === 'Experiences') && <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>}
                    {(link.href === '/#exclusive-deals' || link.label === 'Exclusive Deals') && <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>}
                    {link.href === '/about' && <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    {link.href === '/contact' && <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                  </span>
                  {!isSidebarCollapsed && <span className="text-[15px] font-medium tracking-[0.02em] whitespace-nowrap">{link.label}</span>}
                </Link>
              );
            })}

            {isAuthenticated && (
              <>
                <div className="h-px w-full my-3 bg-gradient-to-r from-transparent via-slate-200/60 to-transparent dark:via-slate-700/50" />
                <Link
                  href="/bookings"
                  className={`group flex items-center gap-3 rounded-[16px] py-3 px-4 transition-all duration-200 ${isSidebarCollapsed ? 'justify-center px-0' : ''} ${
                    pathname.startsWith('/bookings') ? 'bg-slate-200/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 backdrop-blur-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 hover:text-slate-800 dark:hover:text-slate-200 hover:-translate-y-0.5'
                  }`}
                  style={{
                    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                    borderLeft: pathname.startsWith('/bookings') ? `3px solid ${GOLD}` : '3px solid transparent',
                  }}
                >
                  <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  </span>
                  {!isSidebarCollapsed && <span className="text-[15px] font-medium tracking-[0.02em] whitespace-nowrap">Bookings</span>}
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className={`group flex items-center gap-3 rounded-[16px] py-3 px-4 transition-all duration-200 ${isSidebarCollapsed ? 'justify-center px-0' : ''} ${
                      pathname.startsWith('/admin') ? 'bg-slate-200/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 hover:-translate-y-0.5'
                    }`}
                    style={{ borderLeft: pathname.startsWith('/admin') ? `3px solid ${GOLD}` : '3px solid transparent' }}
                  >
                    <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </span>
                    {!isSidebarCollapsed && <span className="text-[15px] font-medium tracking-[0.02em] whitespace-nowrap">Admin</span>}
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* C. Secondary – More: Settings, Support */}
          {!isSidebarCollapsed && (
            <>
              <div className="h-px w-full my-3 bg-gradient-to-r from-transparent via-slate-200/50 to-transparent dark:via-slate-700/40" />
              <p className="px-4 mb-2 text-[10px] font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500">More</p>
              <div className="space-y-0.5">
                {secondaryNav.map((link, i) => (
                  <Link
                    key={i}
                    href={link.href}
                    className="flex items-center gap-3 rounded-[14px] py-2.5 px-4 text-[14px] text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 hover:text-slate-700 dark:hover:text-slate-300 transition-all duration-200"
                  >
                    <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center [&>svg]:w-4 [&>svg]:h-4">
                      {link.label === 'Settings' && <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                      {link.label === 'Support' && <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    </span>
                    {link.label}
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* D. Bottom Profile Area + Collapse */}
          <div className="flex-shrink-0 pt-4 border-t border-slate-200/50 dark:border-slate-700/40">
            {isAuthenticated ? (
              <>
                <div className={`flex items-center gap-3 rounded-[16px] px-4 py-3 bg-slate-100/40 dark:bg-slate-800/30 backdrop-blur-sm ${isSidebarCollapsed ? 'justify-center' : ''} transition-all duration-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/50`}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-slate-800 dark:text-slate-100 text-[15px] font-medium flex-shrink-0 ring-1 ring-slate-200/60 dark:ring-slate-600/40" style={{ background: `linear-gradient(135deg, ${GOLD}22, ${GOLD}11)` }}>
                    {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  {!isSidebarCollapsed && (
                    <div className="min-w-0 flex-1">
                      <p className="text-slate-900 dark:text-slate-100 text-[14px] font-medium truncate">{user?.full_name}</p>
                      <span className="inline-block mt-0.5 text-[11px] font-medium tracking-wide" style={{ color: GOLD }}>Member</span>
                    </div>
                  )}
                </div>
                <div className={`mt-2 space-y-0.5 ${isSidebarCollapsed ? 'flex flex-col items-center' : ''}`}>
                  <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-3 rounded-[14px] py-2.5 text-[14px] text-slate-500 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 hover:text-slate-700 dark:hover:text-slate-300 transition-all duration-200 ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4'}`}
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    {!isSidebarCollapsed && <span>Logout</span>}
                  </button>
                </div>
              </>
            ) : (
              <div className={`space-y-1.5 ${isSidebarCollapsed ? 'flex flex-col items-center' : ''}`}>
                <Link
                  href="/login"
                  className={`flex items-center gap-3 rounded-[16px] py-3 px-4 transition-all duration-200 ${isSidebarCollapsed ? 'justify-center px-0' : ''} ${
                    pathname === '/login' ? 'bg-slate-200/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 hover:text-slate-800 dark:hover:text-slate-200 hover:-translate-y-0.5'
                  }`}
                  style={{ borderLeft: pathname === '/login' ? `3px solid ${GOLD}` : '3px solid transparent' }}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                  {!isSidebarCollapsed && <span className="text-[15px] font-medium">Login</span>}
                </Link>
                <Link
                  href="/register"
                  className={`flex items-center gap-3 rounded-[16px] py-3 px-4 font-medium text-[15px] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
                  style={{ background: GOLD, color: '#0F1115' }}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                  {!isSidebarCollapsed && <span>Sign Up</span>}
                </Link>
              </div>
            )}

            <button
              onClick={toggleSidebar}
              className={`mt-3 flex items-center gap-3 rounded-[14px] py-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 hover:text-slate-700 dark:hover:text-slate-300 transition-all duration-200 ${isSidebarCollapsed ? 'justify-center w-full px-0' : 'px-4 w-full'}`}
              aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <svg className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              {!isSidebarCollapsed && <span className="text-[14px] font-medium">Collapse</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

