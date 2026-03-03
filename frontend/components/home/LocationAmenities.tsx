'use client';

import { hotelContent } from '@/lib/content/hotel-content';

const AMENITY_ICONS: Record<string, string> = {
  'WiFi':                '📶',
  'Centralized AC':      '❄️',
  'Lift':                '🛗',
  '24-Hour Hot Water':   '🚿',
  'Power Backup':        '⚡',
  'Reception':           '🛎️',
  'Lobby':               '🏛️',
  'Smart Doors':         '🔐',
  'CCTV in Common Area': '📹',
  'Fire Safety':         '🧯',
  'Doctor on Call':      '🩺',
  'First Aid Kit':       '🩹',
};

const LANDMARKS = [
  { name: 'Kashi Vishwanath Temple', time: '2–5 min', icon: '🕌' },
  { name: 'Ganga Ghat',              time: '2–5 min', icon: '🌊' },
  { name: 'Kal Bhairav Temple',      time: '2–5 min', icon: '🛕' },
  { name: 'Chowk Street Food',       time: '40 m',    icon: '🥘' },
  { name: 'Godowliya Chauraha',      time: '8 min',   icon: '🛺' },
  { name: 'Dashashwamedh Ghat',      time: '10 min',  icon: '🔥' },
];

export function LocationAmenities() {
  const { amenities } = hotelContent;

  return (
    <section className="bg-gray-50 py-14 md:py-20 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-14 md:space-y-18">

        {/* ── Amenities ── */}
        <div>
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">What this place offers</h2>
            <p className="text-gray-500 text-sm mt-1">All amenities included at no extra cost</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {amenities.map((amenity) => (
              <div
                key={amenity.name}
                className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3.5 shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-200"
              >
                <span className="text-xl flex-shrink-0" aria-hidden>
                  {AMENITY_ICONS[amenity.name] ?? '✓'}
                </span>
                <span className="text-sm font-medium text-gray-800">{amenity.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Location ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* Left: walking distances */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Prime Location</h2>
              <p className="text-gray-500 text-sm mt-1">
                Kachaudi Gali, Lahori Tola, Varanasi — Old City centre
              </p>
            </div>

            <div className="space-y-3">
              {LANDMARKS.map((l) => (
                <div
                  key={l.name}
                  className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg" aria-hidden>{l.icon}</span>
                    <span className="text-sm font-medium text-gray-800">{l.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                    {l.time} walk
                  </span>
                </div>
              ))}
            </div>

            <a
              href="https://maps.app.goo.gl/nGkDab58p3uh257E9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-amber-700 hover:text-amber-800 underline underline-offset-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              View on Google Maps
            </a>
          </div>

          {/* Right: embedded map */}
          <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100 h-[300px] md:h-[360px]">
            <iframe
              title="Shiv Ashray Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3605.876744946246!2d82.97265!3d25.31047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e2e5d4b3f1f2f%3A0x1234567890abcdef!2sShiv%20Ashray!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
