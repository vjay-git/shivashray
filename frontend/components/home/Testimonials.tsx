'use client';

const MMT_URL = 'https://www.makemytrip.com/hotels/shiv_ashray-details-varanasi.html';
const TA_URL  = 'https://www.tripadvisor.in/Hotel_Review-g297685-d33020015-Reviews-Shiv_Ashray-Varanasi_Varanasi_District_Uttar_Pradesh.html';

const REVIEWS = [
  {
    name: 'Verified Guest',
    location: 'MakeMyTrip',
    platformUrl: MMT_URL,
    rating: 5,
    title: 'Neat, clean & great staff',
    text: 'This hotel is neat and clean with great people taking care of your stay. Hotel owner Shalini and front desk staff are also very helpful. Rooms are a bit small still good enough for comfortable stay.',
    date: 'January 2025',
  },
  {
    name: 'Verified Guest',
    location: 'TripAdvisor',
    platformUrl: TA_URL,
    rating: 5,
    title: 'Best location in Kashi',
    text: 'The only modern, comfortable & best hotel in budget in one of the best locations in Kashi, at short walking distance from almost all the major temples & ghats.',
    date: 'December 2024',
  },
  {
    name: 'Verified Guest',
    location: 'MakeMyTrip',
    platformUrl: MMT_URL,
    rating: 5,
    title: 'Warmth of a lived-in home',
    text: 'A house turned into a hotel, radiating the warmth of a lived-in home, with simple but lovingly done décor. Spotlessly clean & very tastefully designed. Staff was friendly and accommodating throughout.',
    date: 'November 2024',
  },
];

const RATING_BREAKDOWN = [
  { label: 'Cleanliness', score: 4.8 },
  { label: 'Location',    score: 5.0 },
  { label: 'Staff',       score: 4.9 },
  { label: 'Value',       score: 4.7 },
];

export function Testimonials() {
  return (
    <section className="bg-gray-50 py-14 md:py-20 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="mb-10 md:mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full mb-3">
            Guest Reviews
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">What our guests say</h2>
        </div>

        {/* Overall score card + breakdown */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 mb-8 flex flex-col sm:flex-row items-center gap-8">
          {/* Big score */}
          <div className="text-center sm:border-r sm:border-gray-100 sm:pr-8 flex-shrink-0">
            <div className="text-6xl font-extrabold text-gray-900 leading-none">4.4</div>
            <div className="flex justify-center gap-0.5 mt-2">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-[13px] font-bold text-emerald-600 mt-1.5">Very Good</p>
            <a
              href={MMT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-blue-500 hover:underline mt-0.5 inline-block"
            >
              111 reviews · MakeMyTrip ↗
            </a>
          </div>

          {/* Breakdown bars */}
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3">
            {RATING_BREAKDOWN.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-[13px] text-gray-600 font-medium w-24 shrink-0">{item.label}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-400"
                    style={{ width: `${(item.score / 5) * 100}%` }}
                  />
                </div>
                <span className="text-[13px] font-semibold text-gray-800 w-8 text-right">{item.score.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {REVIEWS.map((review, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4"
            >
              {/* Stars + date */}
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-[11px] text-gray-400">{review.date}</span>
              </div>

              {/* Title + text */}
              <div>
                <h4 className="font-bold text-gray-900 text-[14px] mb-1">{review.title}</h4>
                <p className="text-gray-600 text-[13px] leading-relaxed">&ldquo;{review.text}&rdquo;</p>
              </div>

              {/* Reviewer */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100 mt-auto">
                <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-[13px] shrink-0">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-gray-900">{review.name}</p>
                  <a
                    href={review.platformUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-blue-500 hover:underline"
                  >
                    {review.location} ↗
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View all reviews links */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href={MMT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-white text-[13px] font-medium text-gray-700 hover:border-amber-400 hover:text-amber-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Read all reviews on MakeMyTrip
          </a>
          <a
            href={TA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-white text-[13px] font-medium text-gray-700 hover:border-amber-400 hover:text-amber-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Read all reviews on TripAdvisor
          </a>
        </div>

      </div>
    </section>
  );
}
