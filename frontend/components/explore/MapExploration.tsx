'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Place } from '@/types';

interface MapExplorationProps {
  places: Place[];
}

/* ── Category config ─────────────────────────────────────────────────── */
const CAT = {
  'sacred-temples':     { color: '#ea580c', dark: '#fb923c', label: 'Temple',    icon: '◈' },
  'nature-scenic':      { color: '#0369a1', dark: '#38bdf8', label: 'Ghat',      icon: '◉' },
  'cultural-landmarks': { color: '#6d28d9', dark: '#a78bfa', label: 'Landmark',  icon: '◆' },
  'short-excursions':   { color: '#0f766e', dark: '#2dd4bf', label: 'Excursion', icon: '◎' },
} as const;

/* ── Distance groups ─────────────────────────────────────────────────── */
const GROUPS = [
  { key: 'walk', label: 'Walking',       sub: 'under 500 m',  min: 0,   max: 0.5  },
  { key: 'near', label: 'Short walk',    sub: '500 m – 2 km', min: 0.5, max: 2    },
  { key: 'auto', label: 'Auto-rickshaw', sub: '2 – 10 km',    min: 2,   max: 10   },
  { key: 'trip', label: 'Day trip',      sub: '10 km+',       min: 10,  max: 9999 },
];

/* ── Map geometry ────────────────────────────────────────────────────── */
const SVG_W = 740, SVG_H = 660;
const CX = 370, CY = 315; // hotel center

function pinRadius(km: number) {
  return Math.min(258, 48 + 52 * Math.log2(km * 3 + 1));
}
function toXY(angle: number, km: number) {
  const r = pinRadius(km);
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: r * Math.cos(rad), y: r * Math.sin(rad) };
}
function pinSize(km: number) {
  if (km < 0.5)  return { outer: 8.5, inner: 3.5 };
  if (km < 2)    return { outer: 7,   inner: 3   };
  if (km < 10)   return { outer: 5.5, inner: 2.2 };
  return                 { outer: 4.5, inner: 1.8 };
}

/* ── Label helpers ───────────────────────────────────────────────────── */

/** Shorten a place name to fit as a map label */
function shortMapName(name: string): string {
  const s = name
    .replace(/\s*\(.*?\)\s*/g, '')   // remove "(BSB Cant)" etc.
    .replace(/\s*[–—].*$/, '')        // remove "– something"
    .trim();
  if (s.length <= 18) return s;
  // keep as many whole words as fit in 18 chars
  const words = s.split(' ');
  let result = words[0];
  for (let i = 1; i < words.length; i++) {
    const next = result + ' ' + words[i];
    if (next.length <= 18) result = next;
    else break;
  }
  return result;
}

/** Compute where to place the label text relative to its pin */
function labelPos(
  px: number, py: number,
  angle: number, pinR: number,
): { lx: number; ly: number; anchor: 'start' | 'end' | 'middle' } {
  const a   = ((angle % 360) + 360) % 360;
  const rad = ((a - 90) * Math.PI) / 180;
  const nx  = Math.cos(rad);
  const ny  = Math.sin(rad);
  const PAD = pinR + 7;
  const lx  = px + nx * PAD;
  const ly  = py + ny * PAD;

  // Use a tight threshold so labels spread left/right even for nearly-vertical angles
  const anchor: 'start' | 'end' | 'middle' = nx > 0.08 ? 'start' : nx < -0.08 ? 'end' : 'middle';

  // Shift baseline so text sits correctly against the pin
  const baselineY =
    ny > 0.35 ? ly + 7        // below pin → text descends
  : ny < -0.35 ? ly           // above pin → text ascends
  : ly + 3;                   // beside pin → mid-height

  return { lx, ly: baselineY, anchor };
}

/* ── River & road paths ──────────────────────────────────────────────── */
const GANGES_LEFT  = 'M 118 0 C 132 110, 162 215, 166 315 C 170 400, 156 490, 141 660';
const GANGES_RIGHT = 'M 207 0 C 220 110, 250 215, 253 315 C 256 400, 243 490, 226 660';
const GANGES_AREA  =
  'M 118 0 C 132 110, 162 215, 166 315 C 170 400, 156 490, 141 660 ' +
  'L 226 660 C 243 490, 256 400, 253 315 C 250 215, 220 110, 207 0 Z';
const ROADS = [
  `M ${CX} ${CY} C ${CX - 60} ${CY - 5}, ${CX - 110} ${CY - 10}, 253 315`,
  `M ${CX} ${CY} C ${CX + 10} ${CY - 65}, ${CX + 20} ${CY - 125}, ${CX + 30} ${CY - 205}`,
  `M ${CX} ${CY} C ${CX + 50} ${CY - 50}, ${CX + 120} ${CY - 100}, ${CX + 200} ${CY - 175}`,
  `M ${CX} ${CY} C ${CX - 30} ${CY + 70}, ${CX - 60} ${CY + 150}, ${CX - 90} ${CY + 265}`,
  `M ${CX} ${CY} C ${CX - 50} ${CY + 40}, ${CX - 100} ${CY + 80}, ${CX - 138} ${CY + 90}`,
];

export function MapExploration({ places }: MapExplorationProps) {
  const [hovered, setHovered]   = useState<string | null>(null);
  const [isDark,  setIsDark]    = useState(false);
  const [mounted, setMounted]   = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const check = () => setIsDark(document.documentElement.classList.contains('dark'));
    check();
    const ob = new MutationObserver(check);
    ob.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => ob.disconnect();
  }, []);

  const hoveredPlace = places.find(p => p.id === hovered) ?? null;

  /* theme */
  const T = isDark ? {
    bg: '#13121b', river: '#0d1e31', riverEdge: '#183049',
    road: '#1d1b2a', roadCenter: '#222032',
    ring: 'rgba(180,165,200,0.06)', ringLabel: 'rgba(180,165,200,0.2)',
    compass: 'rgba(198,167,94,0.45)',
    neighLabel: 'rgba(180,165,200,0.08)',
    riverLabel: 'rgba(96,165,250,0.5)', grid: 'rgba(255,255,255,0.012)',
    frame: 'rgba(198,167,94,0.28)',
    halo: '#13121b',
  } : {
    bg: '#f9f5ef', river: '#dbeafe', riverEdge: '#bfdbfe',
    road: '#ece3d6', roadCenter: '#f5ede2',
    ring: 'rgba(110,85,55,0.1)', ringLabel: 'rgba(110,85,55,0.35)',
    compass: 'rgba(110,85,55,0.55)',
    neighLabel: 'rgba(110,85,55,0.11)',
    riverLabel: 'rgba(30,90,200,0.4)', grid: 'rgba(0,0,0,0.016)',
    frame: 'rgba(139,109,75,0.35)',
    halo: '#f9f5ef',
  };

  /* distance groups for list panel */
  const groups = GROUPS.map(g => ({
    ...g,
    items: places
      .filter(p => (p.mapDistanceKm ?? 0) >= g.min && (p.mapDistanceKm ?? 0) < g.max)
      .sort((a, b) => (a.mapDistanceKm ?? 0) - (b.mapDistanceKm ?? 0)),
  })).filter(g => g.items.length > 0);

  /* tooltip anchor */
  const tooltipData = (() => {
    if (!hoveredPlace?.mapAngle || !hoveredPlace.mapDistanceKm) return null;
    const { x, y } = toXY(hoveredPlace.mapAngle, hoveredPlace.mapDistanceKm);
    const px = CX + x, py = CY + y;
    return {
      leftPct:   (px / SVG_W) * 100,
      topPct:    (py / SVG_H) * 100,
      above:     py > SVG_H * 0.62,
      shiftLeft: px > SVG_W * 0.72,
    };
  })();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">

      {/* ══ MOBILE ═══════════════════════════════════════════════════════ */}
      <div className="md:hidden pb-12 space-y-10">
        {groups.map(g => (
          <div key={g.key}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-slate-200/60 dark:via-slate-700/50 dark:to-slate-700/20" />
              <div className="text-center px-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">{g.label}</p>
                <p className="text-[9px] font-light text-slate-300 dark:text-slate-700 mt-0.5">{g.sub}</p>
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-slate-200 to-slate-200/60 dark:via-slate-700/50 dark:to-slate-700/20" />
            </div>
            <div className="space-y-2.5">
              {g.items.map(place => {
                const c   = CAT[place.category as keyof typeof CAT] ?? CAT['sacred-temples'];
                const col = isDark ? c.dark : c.color;
                const km = place.mapDistanceKm ?? 0;
                const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.name + ', Varanasi, India')}&travelmode=${km < 2 ? 'walking' : km < 10 ? 'transit' : 'driving'}`;
                return (
                  <div
                    key={place.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => router.push(`/explore/${place.slug}`)}
                    onKeyDown={e => e.key === 'Enter' && router.push(`/explore/${place.slug}`)}
                    className="w-full flex items-stretch rounded-xl overflow-hidden text-left group active:scale-[0.982] transition-all duration-150 cursor-pointer"
                    style={{
                      background: isDark
                        ? 'linear-gradient(135deg,rgba(30,27,42,.9) 0%,rgba(22,20,34,.95) 100%)'
                        : 'linear-gradient(135deg,rgba(255,255,255,.98) 0%,rgba(250,248,244,.95) 100%)',
                      boxShadow: isDark
                        ? '0 2px 12px rgba(0,0,0,.28),inset 0 0 0 1px rgba(255,255,255,.04)'
                        : '0 2px 12px rgba(0,0,0,.06),inset 0 0 0 1px rgba(255,255,255,.8)',
                    }}
                  >
                    <div className="w-[3.5px] flex-shrink-0" style={{ background: `linear-gradient(to bottom,${col},${col}70)` }} />
                    <div className="flex-1 flex items-center gap-3.5 px-4 py-3.5">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-150 group-active:scale-95"
                        style={{ background: `${col}18` }}>
                        <span className="text-[15px] leading-none" style={{ color: col }}>{c.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{place.name}</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">{place.travelHint ?? c.label}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap tabular-nums"
                          style={{ background: `${col}18`, color: col }}>{place.distance}</span>
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="p-1 rounded-md opacity-35 hover:opacity-80 transition-opacity duration-150"
                          style={{ color: col }}
                          aria-label={`Navigate to ${place.name} in Google Maps`}
                        >
                          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                            <path d="M2 9L9 2M9 2H4.5M9 2V6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ══ DESKTOP ══════════════════════════════════════════════════════ */}
      <div className="hidden md:flex h-[700px] rounded-2xl overflow-hidden
        shadow-[0_6px_48px_rgba(0,0,0,0.13)] dark:shadow-[0_6px_48px_rgba(0,0,0,0.5)]
        border border-slate-200/80 dark:border-slate-800">

        {/* ── Left panel ── */}
        <div className="w-[280px] lg:w-[300px] flex-shrink-0 flex flex-col
          bg-white dark:bg-[#1c1b28]
          border-r border-slate-100 dark:border-slate-800/80">

          <div className="flex-shrink-0 px-5 py-4 border-b border-slate-100 dark:border-slate-800/80"
            style={{ background: isDark
              ? 'linear-gradient(to bottom,rgba(30,27,42,.8),transparent)'
              : 'linear-gradient(to bottom,rgba(255,253,249,.9),transparent)' }}>
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/shivashray.png" alt="Shiv Ashray" className="w-7 h-7 object-contain"/>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">Shiv Ashray</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-0.5">Kachourigali, Varanasi</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-[10px] font-semibold tabular-nums text-slate-400 dark:text-slate-600">{places.length}</p>
                <p className="text-[9px] text-slate-300 dark:text-slate-700">places</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain">
            {groups.map(g => (
              <div key={g.key}>
                <div className="px-5 pt-4 pb-1.5">
                  <div className="flex items-center gap-2">
                    <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-600">{g.label}</p>
                    <span className="text-[9px] font-light text-slate-300 dark:text-slate-700">{g.sub}</span>
                    <span className="ml-auto text-[9px] font-bold tabular-nums text-slate-300 dark:text-slate-700">{g.items.length}</span>
                  </div>
                </div>
                {g.items.map(place => {
                  const c = CAT[place.category as keyof typeof CAT] ?? CAT['sacred-temples'];
                  const col = isDark ? c.dark : c.color;
                  const isActive = hovered === place.id;
                  return (
                    <button key={place.id}
                      onMouseEnter={() => setHovered(place.id)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => router.push(`/explore/${place.slug}`)}
                      className={`w-full flex items-center gap-2.5 pl-5 pr-4 py-2.5 text-left
                        transition-all duration-100 relative
                        ${isActive ? 'bg-slate-50 dark:bg-slate-800/60' : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/35'}`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full"
                          style={{ background: `linear-gradient(to bottom,${col},${col}70)` }}/>
                      )}
                      <span className="text-[11px] leading-none flex-shrink-0 transition-all duration-150"
                        style={{ color: col, opacity: isActive ? 1 : 0.55, transform: isActive ? 'scale(1.25)' : 'scale(1)' }}>
                        {c.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[13px] leading-snug truncate transition-colors duration-100 ${
                          isActive ? 'font-semibold text-slate-900 dark:text-slate-50' : 'font-normal text-slate-700 dark:text-slate-300'
                        }`}>{place.name}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-600 leading-none mt-0.5">{place.distance}</p>
                      </div>
                      <svg width="6" height="10" viewBox="0 0 6 10" fill="none"
                        className={`flex-shrink-0 transition-colors ${isActive ? 'text-slate-400 dark:text-slate-500' : 'text-slate-200 dark:text-slate-700'}`}>
                        <path d="M1 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  );
                })}
              </div>
            ))}
            <div className="h-4"/>
          </div>

          {/* Legend */}
          <div className="flex-shrink-0 px-5 py-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {(Object.entries(CAT) as [string, typeof CAT[keyof typeof CAT]][]).map(([key, val]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span className="text-[9px] leading-none" style={{ color: isDark ? val.dark : val.color }}>{val.icon}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{val.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ MAP POSTER PANEL ═════════════════════════════════════════════ */}
        <div className="flex-1 relative overflow-hidden" style={{ background: T.bg }}>
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="w-full h-full"
            style={{ display: 'block' }}
            aria-label="Illustrated map of places near Shiv Ashray, Varanasi"
          >
            <defs>
              <filter id="paper" x="-5%" y="-5%" width="110%" height="110%">
                <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4" stitchTiles="stitch" result="noise"/>
                <feColorMatrix type="saturate" values="0" in="noise" result="gray"/>
                <feBlend in="SourceGraphic" in2="gray" mode="multiply" result="blend"/>
                <feComponentTransfer in="blend"><feFuncA type="linear" slope="1"/></feComponentTransfer>
              </filter>
              <filter id="pinShadow" x="-60%" y="-60%" width="220%" height="220%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodOpacity="0.28"/>
              </filter>
              <filter id="hotelGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="5" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="labelGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={T.river}/>
                <stop offset="100%" stopColor={T.riverEdge}/>
              </linearGradient>
              <path id="gangesTextPath"
                d="M 143 110 C 155 195, 178 265, 181 330 C 184 395, 175 455, 163 530"
                fill="none"/>
            </defs>

            {/* ── Background ── */}
            <rect width={SVG_W} height={SVG_H} fill={T.bg} filter="url(#paper)"/>

            {/* ── Grid ── */}
            {Array.from({ length: 15 }, (_, i) => (
              <line key={`v${i}`} x1={i * 52} y1={0} x2={i * 52} y2={SVG_H} stroke={T.grid} strokeWidth="1"/>
            ))}
            {Array.from({ length: 14 }, (_, i) => (
              <line key={`h${i}`} x1={0} y1={i * 52} x2={SVG_W} y2={i * 52} stroke={T.grid} strokeWidth="1"/>
            ))}

            {/* ══ POSTER FRAME ══════════════════════════════════════════ */}
            {/* Outer border */}
            <rect x={5} y={5} width={SVG_W - 10} height={SVG_H - 10}
              fill="none" stroke={T.frame} strokeWidth="1.5" rx="2"/>
            {/* Inner hairline */}
            <rect x={10} y={10} width={SVG_W - 20} height={SVG_H - 20}
              fill="none" stroke={T.frame} strokeWidth="0.4" rx="1"/>

            {/* Corner ornaments */}
            {([
              [13, 13,  1,  1],
              [SVG_W - 13, 13,  -1,  1],
              [13, SVG_H - 13,  1, -1],
              [SVG_W - 13, SVG_H - 13, -1, -1],
            ] as [number, number, number, number][]).map(([cx, cy, dx, dy], i) => (
              <g key={`c${i}`}>
                <line x1={cx} y1={cy} x2={cx + dx * 20} y2={cy} stroke={T.frame} strokeWidth="1"/>
                <line x1={cx} y1={cy} x2={cx} y2={cy + dy * 20} stroke={T.frame} strokeWidth="1"/>
                <circle cx={cx} cy={cy} r="1.8" fill={T.frame}/>
              </g>
            ))}

            {/* Poster title – bottom center watermark */}
            <text
              x={SVG_W / 2} y={SVG_H - 14} textAnchor="middle"
              fontFamily="Georgia,'Times New Roman',serif" fontStyle="italic"
              fontSize="8.5" letterSpacing="3" fill={T.frame}
            >
              KASHI · VARANASI · SACRED CITY OF LIGHT
            </text>

            {/* ── Ganges River ── */}
            <path d={GANGES_AREA} fill="url(#riverGrad)" opacity={isDark ? 0.6 : 0.65}/>
            <path d={GANGES_LEFT}  fill="none" stroke={T.riverEdge} strokeWidth="1.5" opacity={0.55}/>
            <path d={GANGES_RIGHT} fill="none" stroke={T.riverEdge} strokeWidth="1.5" opacity={0.55}/>
            <text fontSize="10" fill={T.riverLabel} fontFamily="Georgia,serif" fontStyle="italic" letterSpacing="2">
              <textPath href="#gangesTextPath" startOffset="12%">Ganges · Ganga</textPath>
            </text>

            {/* ── Roads ── */}
            {ROADS.map((d, i) => (
              <g key={i}>
                <path d={d} fill="none" stroke={T.road}       strokeWidth={i === 0 ? 13 : 10} strokeLinecap="round"/>
                <path d={d} fill="none" stroke={T.roadCenter} strokeWidth={i === 0 ? 7  : 5.5} strokeLinecap="round"/>
              </g>
            ))}

            {/* ── Distance rings ── */}
            {[0.5, 1, 2, 5, 10].map(km => {
              const r     = pinRadius(km);
              const label = km < 1 ? `${Math.round(km * 1000)} m` : `${km} km`;
              return (
                <g key={km}>
                  <circle cx={CX} cy={CY} r={r} fill="none" stroke={T.ring} strokeWidth="1" strokeDasharray="3 7"/>
                  <text x={CX + r + 4} y={CY - 4} fontSize="7.5" fill={T.ringLabel} fontFamily="system-ui,sans-serif">{label}</text>
                </g>
              );
            })}

            {/* ══ DECORATIVE COMPASS ROSE ═══════════════════════════════ */}
            {(() => {
              const ccx = SVG_W - 44, ccy = 48;
              return (
                <g style={{ pointerEvents: 'none' }}>
                  {/* Outer decorative ring */}
                  <circle cx={ccx} cy={ccy} r={26} fill="none" stroke={T.frame} strokeWidth="0.6" strokeDasharray="2 3"/>
                  {/* Cross lines */}
                  <line x1={ccx} y1={ccy - 24} x2={ccx} y2={ccy + 24} stroke={T.compass} strokeWidth="0.6"/>
                  <line x1={ccx - 24} y1={ccy} x2={ccx + 24} y2={ccy} stroke={T.compass} strokeWidth="0.6"/>
                  {/* Diagonal spokes */}
                  <line x1={ccx - 15} y1={ccy - 15} x2={ccx + 15} y2={ccy + 15} stroke={T.compass} strokeWidth="0.35" strokeDasharray="1.5 2.5"/>
                  <line x1={ccx + 15} y1={ccy - 15} x2={ccx - 15} y2={ccy + 15} stroke={T.compass} strokeWidth="0.35" strokeDasharray="1.5 2.5"/>
                  {/* N arrow (solid, prominent) */}
                  <polygon points={`${ccx},${ccy - 21} ${ccx - 5},${ccy - 3} ${ccx + 5},${ccy - 3}`} fill={T.compass}/>
                  {/* S arrow (outline) */}
                  <polygon points={`${ccx},${ccy + 21} ${ccx - 4.5},${ccy + 3} ${ccx + 4.5},${ccy + 3}`} fill="none" stroke={T.compass} strokeWidth="0.8"/>
                  {/* E arrow */}
                  <polygon points={`${ccx + 21},${ccy} ${ccx + 3},${ccy - 4.5} ${ccx + 3},${ccy + 4.5}`} fill="none" stroke={T.compass} strokeWidth="0.8"/>
                  {/* W arrow */}
                  <polygon points={`${ccx - 21},${ccy} ${ccx - 3},${ccy - 4.5} ${ccx - 3},${ccy + 4.5}`} fill="none" stroke={T.compass} strokeWidth="0.8"/>
                  {/* Center dot */}
                  <circle cx={ccx} cy={ccy} r="2.5" fill={T.compass}/>
                  <circle cx={ccx} cy={ccy} r="5.5" fill="none" stroke={T.compass} strokeWidth="0.5"/>
                  {/* N label */}
                  <text x={ccx} y={ccy - 25} textAnchor="middle" fontSize="9"
                    fontFamily="system-ui,sans-serif" fontWeight="800" fill={T.compass}>N</text>
                </g>
              );
            })()}

            {/* ── Neighbourhood area labels ── */}
            <text x={CX - 20} y={CY - 32} fontSize="9" fill={T.neighLabel}
              fontFamily="Georgia,serif" fontStyle="italic" textAnchor="middle">Old City</text>
            <text x={178} y={CY + 10} fontSize="8" fill={T.neighLabel}
              fontFamily="Georgia,serif" fontStyle="italic" textAnchor="middle">Ghats Area</text>
            <text x={CX - 58} y={CY + 248} fontSize="8" fill={T.neighLabel}
              fontFamily="Georgia,serif" fontStyle="italic" textAnchor="middle">BHU Area</text>
            <text x={CX + 188} y={CY - 158} fontSize="8" fill={T.neighLabel}
              fontFamily="Georgia,serif" fontStyle="italic" textAnchor="middle">Railway</text>

            {/* ══ LAYER 1 – LEADER LINES (below pins, dashed) ══════════ */}
            {places.map(place => {
              if (!place.mapAngle || !place.mapDistanceKm) return null;
              const { x, y } = toXY(place.mapAngle, place.mapDistanceKm);
              const px = CX + x, py = CY + y;
              const c = CAT[place.category as keyof typeof CAT] ?? CAT['sacred-temples'];
              const col = isDark ? c.dark : c.color;
              const sz = pinSize(place.mapDistanceKm);
              const { lx, ly } = labelPos(px, py, place.mapAngle, sz.outer);
              const dist = Math.hypot(lx - px, ly - py);
              if (dist < 10) return null;
              const ux = (lx - px) / dist;
              const uy = (ly - py) / dist;
              return (
                <line key={`ln-${place.id}`}
                  x1={px + ux * (sz.outer + 1.5)}
                  y1={py + uy * (sz.outer + 1.5)}
                  x2={lx - ux * 4}
                  y2={ly - uy * 9}
                  stroke={col}
                  strokeWidth="0.55"
                  strokeDasharray="2 2.5"
                  opacity={mounted ? 0.4 : 0}
                  style={{ transition: 'opacity 500ms ease-out' }}
                />
              );
            })}

            {/* ══ LAYER 2 – PLACE PINS ═════════════════════════════════ */}
            {places.map((place, idx) => {
              if (!place.mapAngle || !place.mapDistanceKm) return null;
              const { x, y } = toXY(place.mapAngle, place.mapDistanceKm);
              const px = CX + x, py = CY + y;
              const c = CAT[place.category as keyof typeof CAT] ?? CAT['sacred-temples'];
              const col = isDark ? c.dark : c.color;
              const isActive = hovered === place.id;
              const sz = pinSize(place.mapDistanceKm);
              const outerR = isActive ? sz.outer + 3 : sz.outer;
              const innerR = isActive ? sz.inner + 1.2 : sz.inner;

              return (
                <g key={`pin-${place.id}`}
                  style={{ cursor: 'pointer', opacity: mounted ? 1 : 0,
                    transition: `opacity 350ms ease-out ${idx * 20}ms` }}
                  onMouseEnter={() => setHovered(place.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => router.push(`/explore/${place.slug}`)}>
                  {/* Hit area */}
                  <circle cx={px} cy={py} r={20} fill="transparent"/>
                  {/* Hover halo */}
                  {isActive && (
                    <circle cx={px} cy={py} r={outerR + 7} fill={col} fillOpacity={0.12}/>
                  )}
                  {/* Outer */}
                  <circle cx={px} cy={py} r={outerR}
                    fill={col}
                    filter={isActive ? 'url(#pinShadow)' : undefined}
                    style={{ transition: 'r 150ms ease-out' }}/>
                  {/* Inner white core */}
                  <circle cx={px} cy={py} r={innerR}
                    fill="white" fillOpacity={0.95}
                    style={{ transition: 'r 150ms ease-out' }}/>
                </g>
              );
            })}

            {/* ══ LAYER 3 – PLACE LABELS (always visible, on top of pins) */}
            {places.map((place, idx) => {
              if (!place.mapAngle || !place.mapDistanceKm) return null;
              const { x, y } = toXY(place.mapAngle, place.mapDistanceKm);
              const px = CX + x, py = CY + y;
              const c = CAT[place.category as keyof typeof CAT] ?? CAT['sacred-temples'];
              const col = isDark ? c.dark : c.color;
              const isActive = hovered === place.id;
              const sz = pinSize(place.mapDistanceKm);
              const { lx, ly, anchor } = labelPos(px, py, place.mapAngle, sz.outer);
              const km = place.mapDistanceKm;
              const fontSize = km < 0.5 ? 6.5 : km < 2 ? 7.5 : km < 10 ? 8.5 : 9.5;
              const label = shortMapName(place.name);

              return (
                <text key={`lbl-${place.id}`}
                  x={lx} y={ly}
                  textAnchor={anchor}
                  fontFamily="Georgia,'Times New Roman',serif"
                  fontSize={isActive ? fontSize + 1 : fontSize}
                  fontWeight={isActive ? '700' : '500'}
                  fontStyle={isActive ? 'normal' : 'normal'}
                  // Paint halo: render stroke (background) BEFORE fill (text color)
                  paintOrder="stroke fill"
                  stroke={T.halo}
                  strokeWidth={isActive ? 3.5 : 2.8}
                  strokeLinejoin="round"
                  fill={isActive ? col : `${col}d8`}
                  style={{
                    pointerEvents: 'none',
                    opacity: mounted ? 1 : 0,
                    transition: `opacity 350ms ease-out ${idx * 20}ms`,
                    letterSpacing: km > 5 ? '0.5px' : '0',
                  }}
                >
                  {label}
                </text>
              );
            })}

            {/* ══ HOTEL MARKER (always on top) ══════════════════════════ */}
            <g style={{ pointerEvents: 'none' }}>
              {/* Pulse rings */}
              <circle cx={CX} cy={CY} r={28} fill="rgba(198,167,94,.1)" stroke="rgba(198,167,94,.22)" strokeWidth="1">
                <animate attributeName="r"       values="28;54" dur="2.6s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values=".8;0"  dur="2.6s" repeatCount="indefinite"/>
              </circle>
              <circle cx={CX} cy={CY} r={28} fill="rgba(198,167,94,.1)" stroke="rgba(198,167,94,.22)" strokeWidth="1">
                <animate attributeName="r"       values="28;54" begin="1.3s" dur="2.6s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values=".8;0"  begin="1.3s" dur="2.6s" repeatCount="indefinite"/>
              </circle>
              {/* Static ring */}
              <circle cx={CX} cy={CY} r={27}
                fill={isDark ? 'rgba(198,167,94,.1)' : 'rgba(198,167,94,.08)'}
                stroke="rgba(198,167,94,.45)" strokeWidth="1.5"/>
              {/* White base */}
              <circle cx={CX} cy={CY} r={20}
                fill={isDark ? '#1c1b28' : 'white'}
                stroke="rgba(198,167,94,.55)" strokeWidth="1.5"
                filter="url(#hotelGlow)"/>
              {/* Logo */}
              <foreignObject x={CX - 13} y={CY - 13} width={26} height={26} style={{ overflow: 'visible' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/shivashray.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }}/>
              </foreignObject>
              {/* Hotel label */}
              <text x={CX} y={CY + 38} fontSize="8.5" fill="rgba(198,167,94,.95)"
                textAnchor="middle" fontFamily="system-ui,sans-serif" fontWeight="800" letterSpacing="0.8">
                SHIV ASHRAY
              </text>
            </g>
          </svg>

          {/* ══ HOVER TOOLTIP ════════════════════════════════════════════ */}
          {hoveredPlace && tooltipData && (() => {
            const c   = CAT[hoveredPlace.category as keyof typeof CAT] ?? CAT['sacred-temples'];
            const col = isDark ? c.dark : c.color;
            const { leftPct, topPct, above, shiftLeft } = tooltipData;
            const hkm = hoveredPlace.mapDistanceKm ?? 0;
            const hMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hoveredPlace.name + ', Varanasi, India')}&travelmode=${hkm < 2 ? 'walking' : hkm < 10 ? 'transit' : 'driving'}`;
            return (
              <div className="absolute z-30 pointer-events-none"
                style={{
                  left: `${leftPct}%`, top: `${topPct}%`,
                  transform: `translate(${shiftLeft ? '-90%' : '-50%'}, ${above ? 'calc(-100% - 16px)' : '16px'})`,
                }}>
                <div className="relative bg-white dark:bg-[#1e1b2e] rounded-xl overflow-hidden
                  shadow-[0_10px_40px_rgba(0,0,0,0.18)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.55)]
                  border border-slate-100 dark:border-slate-700/60 min-w-[160px] max-w-[220px]">
                  <div className="h-[3px] w-full" style={{ background: `linear-gradient(to right,${col},${col}80)` }}/>
                  <div className="px-3.5 pt-2.5 pb-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-[9px] leading-none" style={{ color: col }}>{c.icon}</span>
                      <p className="text-[9px] font-bold uppercase tracking-wide" style={{ color: col }}>{c.label}</p>
                      <span className="ml-auto text-[9px] text-slate-400 dark:text-slate-500 tabular-nums">{hoveredPlace.distance}</span>
                    </div>
                    <p className="text-[12.5px] font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                      {hoveredPlace.name}
                    </p>
                    {hoveredPlace.travelHint && (
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                        {hoveredPlace.travelHint}
                      </p>
                    )}
                    <a
                      href={hMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2.5 flex items-center justify-between hover:opacity-75 transition-opacity duration-150"
                      style={{ pointerEvents: 'auto', color: col }}
                    >
                      <span className="text-[10px] font-semibold">Open in Maps</span>
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                        <path d="M1.5 7.5L7.5 1.5M7.5 1.5H3.5M7.5 1.5V5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  </div>
                </div>
                {/* Arrow */}
                {above ? (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-[calc(100%-1px)] w-0 h-0"
                    style={{ borderLeft: '7px solid transparent', borderRight: '7px solid transparent',
                      borderTop: `8px solid ${isDark ? '#1e1b2e' : 'white'}` }}/>
                ) : (
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-[calc(100%-1px)] w-0 h-0"
                    style={{ borderLeft: '7px solid transparent', borderRight: '7px solid transparent',
                      borderBottom: `8px solid ${col}` }}/>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
