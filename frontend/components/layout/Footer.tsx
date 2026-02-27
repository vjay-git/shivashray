'use client';

import Link from 'next/link';
import Image from 'next/image';
import { hotelContent } from '@/lib/content/hotel-content';

const GOLD = '#C6A75E';

const navLinks = [
  { href: '/rooms',    label: 'Rooms' },
  { href: '/services', label: 'Services' },
  { href: '/explore',  label: 'Explore Varanasi' },
  { href: '/about',    label: 'About' },
  { href: '/contact',  label: 'Contact' },
];

const landmarks = [
  { name: 'Ganga Ghat',       time: '2 min walk' },
  { name: 'Kal Bhairav',      time: '3 min walk' },
  { name: 'Vishwanath Mandir', time: '5 min walk' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const phoneClean = hotelContent.contact.phone.replace(/\s/g, '');

  return (
    <footer style={{ background: '#0B1520' }}>

      {/* ── Top decorative rule ── */}
      <div
        className="h-px w-full"
        style={{ background: `linear-gradient(90deg, transparent, ${GOLD}40, transparent)` }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-14 pb-10">

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 mb-12">

          {/* Column 1 — Brand */}
          <div>
            <Link href="/" className="inline-block mb-5">
              <Image
                src="/shivashray.png"
                alt={hotelContent.name}
                width={160}
                height={52}
                className="h-11 w-auto object-contain brightness-0 invert opacity-90"
                priority
              />
            </Link>
            <p className="text-sm text-[#F8F6F2]/60 leading-relaxed mb-5">
              Premier lodging in the spiritual heart of Varanasi — steps from the Ghats, Kashi Vishwanath &amp; Kal Bhairav.
            </p>
            <a
              href={hotelContent.location.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2.5 text-[13px] text-[#F8F6F2]/50 hover:text-[#C6A75E] transition-colors leading-relaxed group"
            >
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0 group-hover:text-[#C6A75E] transition-colors" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              25/14, Kachaudi Gali, Lahori Tola,<br />Varanasi, UP — 221001
            </a>
          </div>

          {/* Column 2 — Pages */}
          <div>
            <h3 className="text-[11px] font-semibold text-[#F8F6F2]/35 uppercase tracking-[0.18em] mb-5">Pages</h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#F8F6F2]/65 hover:text-[#C6A75E] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Stay info */}
          <div>
            <h3 className="text-[11px] font-semibold text-[#F8F6F2]/35 uppercase tracking-[0.18em] mb-5">Your Stay</h3>

            {/* Check-in / Check-out */}
            <div className="flex gap-6 mb-6">
              <div>
                <p className="text-[11px] text-[#F8F6F2]/35 uppercase tracking-wider mb-1">Check-in</p>
                <p className="text-sm text-[#F8F6F2]/70 font-light">{hotelContent.policies.checkIn.time}</p>
              </div>
              <div className="w-px bg-[#F8F6F2]/10" />
              <div>
                <p className="text-[11px] text-[#F8F6F2]/35 uppercase tracking-wider mb-1">Check-out</p>
                <p className="text-sm text-[#F8F6F2]/70 font-light">{hotelContent.policies.checkOut.time}</p>
              </div>
            </div>

            {/* Walkable landmarks */}
            <p className="text-[11px] text-[#F8F6F2]/35 uppercase tracking-wider mb-3">Nearby</p>
            <ul className="space-y-2 mb-6">
              {landmarks.map((l) => (
                <li key={l.name} className="flex items-center justify-between text-sm">
                  <span className="text-[#F8F6F2]/60">{l.name}</span>
                  <span
                    className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                    style={{ background: `${GOLD}18`, color: `${GOLD}CC` }}
                  >
                    {l.time}
                  </span>
                </li>
              ))}
            </ul>

            {/* Quick contact */}
            <a
              href={`tel:${phoneClean}`}
              className="text-sm text-[#F8F6F2]/60 hover:text-[#C6A75E] transition-colors flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              {hotelContent.contact.phone}
            </a>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-[#F8F6F2]/8 pt-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <p className="text-[13px] text-[#F8F6F2]/45">
              &copy; {currentYear} {hotelContent.name}. All rights reserved.
            </p>
            <p className="text-[11px] text-[#F8F6F2]/25">
              GSTIN: {hotelContent.property.gstin} &nbsp;·&nbsp; {hotelContent.property.totalRooms} Rooms &nbsp;·&nbsp; Est. {hotelContent.property.builtYear}
            </p>
          </div>

          <div className="flex items-center gap-5">
            <Link href="/terms" className="text-[13px] text-[#F8F6F2]/45 hover:text-[#C6A75E] transition-colors">
              Terms
            </Link>
            <span className="text-[#F8F6F2]/15 text-xs">·</span>
            <p className="text-[13px] text-[#F8F6F2]/30">
              Built by{' '}
              <a
                href="https://workwithvijay.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C6A75E]/60 hover:text-[#C6A75E] transition-colors"
              >
                workwithvijay
              </a>
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}