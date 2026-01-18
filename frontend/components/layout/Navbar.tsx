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

  const navLinks = [
    { href: '/rooms', label: 'Rooms' },
    { href: '/explore', label: 'Explore' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
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
      {/* Mobile/Tablet: Floating Navbar */}
      <nav
        className={`lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 transition-all duration-300 ${
          isScrolled ? 'shadow-sm' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center"
            >
              <Image
                src="/shivashray.png"
                alt={hotelContent.name}
                width={180}
                height={40}
                className="h-8 w-auto object-contain"
                priority
              />
            </Link>


            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className={`w-6 h-6 transition-transform duration-200 ${
                  isMobileMenuOpen ? 'rotate-90' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-200 ${
              isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="py-4 space-y-1 border-t border-gray-200">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'text-gray-900 bg-gray-100'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              {isAuthenticated ? (
                <>
                  <Link
                    href="/bookings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      pathname.startsWith('/bookings')
                        ? 'text-gray-900 bg-gray-100'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    My Bookings
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                        pathname.startsWith('/admin')
                          ? 'text-gray-900 bg-gray-100'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                  <div className="px-4 py-3 border-t border-gray-200 mt-2">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-medium">
                        {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-sm text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors text-left"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      pathname === '/login'
                        ? 'text-gray-900 bg-gray-100'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm font-medium rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Desktop: Sidebar Navigation */}
      <aside className={`hidden lg:flex fixed left-0 top-0 bottom-0 z-50 flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}>
        {/* Sidebar Content */}
        <div className="w-full h-full flex flex-col py-6 px-4">
          {/* Logo Section */}
          <Link
            href="/"
            className="mb-8 flex items-center justify-center"
          >
            {isSidebarCollapsed ? (
              <div className="relative w-14 h-11 rounded-full overflow-hidden ring-2 ring-gray-200 bg-white shadow-sm">
                <Image
                  src="/collapsedshiva.jpg"
                  alt={hotelContent.name}
                  width={56}
                  height={56}
                  className="absolute inset-0 w-full h-full object-cover"
                  priority
                  quality={100}
                  unoptimized={false}
                />
              </div>
            ) : (
              <Image
                src="/shivashray.png"
                alt={hotelContent.name}
                width={2000}
                height={510}
                className="h-19 w-auto object-contain"
                priority
              />
            )}
          </Link>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="w-5 h-5 flex-shrink-0">
                    {link.href === '/rooms' && (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    )}
                    {link.href === '/explore' && (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    )}
                    {link.href === '/services' && (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {link.href === '/about' && (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {link.href === '/contact' && (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  {!isSidebarCollapsed && (
                    <span className="text-sm font-medium whitespace-nowrap">
                      {link.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Auth Section */}
          <div className="mt-auto space-y-1 border-t border-gray-200 pt-4">
            {isAuthenticated ? (
              <>
                <Link
                  href="/bookings"
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                    pathname.startsWith('/bookings')
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {!isSidebarCollapsed && (
                    <span className="text-sm font-medium whitespace-nowrap">
                      My Bookings
                    </span>
                  )}
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                      pathname.startsWith('/admin')
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {!isSidebarCollapsed && (
                      <span className="text-sm font-medium whitespace-nowrap">
                        Admin
                      </span>
                    )}
                  </Link>
                )}
                <div className="px-3 py-3">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-medium flex-shrink-0">
                      {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    {!isSidebarCollapsed && (
                      <div>
                        <p className="text-sm font-medium text-gray-900 whitespace-nowrap">{user?.full_name}</p>
                        <p className="text-xs text-gray-500 whitespace-nowrap truncate">{user?.email}</p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {!isSidebarCollapsed && (
                      <span className="whitespace-nowrap">
                        Logout
                      </span>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                    pathname === '/login'
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  {!isSidebarCollapsed && (
                    <span className="text-sm font-medium whitespace-nowrap">
                      Login
                    </span>
                  )}
                </Link>
                <Link
                  href="/register"
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  {!isSidebarCollapsed && (
                    <span className="text-sm whitespace-nowrap">
                      Sign Up
                    </span>
                  )}
                </Link>
              </>
            )}
            
            {/* Toggle Button */}
            <button
              onClick={toggleSidebar}
              className="mt-4 flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full"
              aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <svg
                className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {!isSidebarCollapsed && (
                <span className="text-sm font-medium whitespace-nowrap">
                  Collapse
                </span>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

