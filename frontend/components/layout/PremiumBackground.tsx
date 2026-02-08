'use client';

import { ReactNode } from 'react';

interface PremiumBackgroundProps {
  children: ReactNode;
  variant?: 'default' | 'center' | 'top' | 'bottom' | 'explore' | 'rooms';
  className?: string;
}

/**
 * Premium Background System
 * 
 * Creates depth, mood, and polish through layered gradients.
 * Inspired by Apple's design language: symmetry, light, and depth.
 * 
 * Light Mode: Off-white base with soft warm/cool gradient shifts
 * Dark Mode: Deep charcoal base with dim light blooms
 */
export function PremiumBackground({ 
  children, 
  variant = 'default',
  className = '' 
}: PremiumBackgroundProps) {
  // Base gradient positions and intensities vary by variant
  const getGradientConfig = () => {
    switch (variant) {
      case 'rooms':
        return {
          lightGradient: 'radial-gradient(ellipse 120% 100% at 50% 0%, #F8F6F2 0%, #F5F1E8 40%, #F2EEE6 100%)',
          darkGradient: 'radial-gradient(ellipse 110% 90% at 50% 30%, oklch(0.14 0.02 265) 0%, #0F1115 45%, #0C0A10 100%)',
          lightBloom: 'radial-gradient(ellipse 70% 55% at 50% 5%, oklch(0.92 0.04 85 / 0.18) 0%, transparent 65%)',
          darkBloom: 'radial-gradient(ellipse 75% 60% at 50% 0%, oklch(0.28 0.05 75 / 0.2) 0%, transparent 60%)',
          lightBloomBottom: undefined,
          darkBloomBottom: undefined,
        };
      case 'explore':
        return {
          lightGradient: 'radial-gradient(ellipse 140% 120% at 50% -10%, oklch(0.98 0.02 85) 0%, oklch(0.96 0.015 80) 40%, oklch(0.94 0.01 75) 70%, oklch(0.92 0.008 70) 100%)',
          darkGradient: 'radial-gradient(ellipse 150% 120% at 50% 20%, #0c0a14 0%, #0a0812 25%, #060510 50%, #040308 100%)',
          lightBloom: 'radial-gradient(ellipse 90% 70% at 50% 5%, oklch(0.95 0.08 85 / 0.5) 0%, oklch(0.92 0.05 82 / 0.25) 50%, transparent 80%)',
          darkBloom: 'radial-gradient(ellipse 100% 80% at 50% 0%, oklch(0.35 0.12 85 / 0.4) 0%, oklch(0.25 0.08 80 / 0.2) 40%, transparent 70%)',
          lightBloomBottom: 'radial-gradient(ellipse 120% 60% at 50% 110%, oklch(0.92 0.04 250 / 0.25) 0%, transparent 55%)',
          darkBloomBottom: 'radial-gradient(ellipse 110% 55% at 50% 108%, oklch(0.18 0.04 260 / 0.2) 0%, transparent 50%)',
        };
      case 'center':
        return {
          lightGradient: 'radial-gradient(ellipse 100% 120% at 50% 50%, oklch(0.99 0.005 245) 0%, oklch(0.98 0.003 255) 50%, oklch(0.985 0.002 245) 100%)',
          darkGradient: 'radial-gradient(ellipse 100% 120% at 50% 50%, oklch(0.18 0.01 245) 0%, oklch(0.16 0.008 255) 50%, oklch(0.145 0.005 245) 100%)',
          lightBloom: 'radial-gradient(ellipse 70% 70% at 50% 50%, oklch(1 0 0 / 0.12) 0%, transparent 70%)',
          darkBloom: 'radial-gradient(ellipse 70% 70% at 50% 50%, oklch(0.25 0.01 245 / 0.18) 0%, transparent 70%)',
        };
      case 'top':
        return {
          lightGradient: 'radial-gradient(ellipse 100% 80% at 50% 0%, oklch(0.99 0.005 250) 0%, oklch(0.985 0.002 240) 60%, oklch(0.98 0.003 260) 100%)',
          darkGradient: 'radial-gradient(ellipse 100% 80% at 50% 0%, oklch(0.18 0.01 250) 0%, oklch(0.16 0.008 240) 60%, oklch(0.145 0.005 260) 100%)',
          lightBloom: 'radial-gradient(ellipse 90% 50% at 50% 0%, oklch(1 0 0 / 0.1) 0%, transparent 50%)',
          darkBloom: 'radial-gradient(ellipse 90% 50% at 50% 0%, oklch(0.25 0.01 250 / 0.15) 0%, transparent 50%)',
        };
      case 'bottom':
        return {
          lightGradient: 'radial-gradient(ellipse 100% 80% at 50% 100%, oklch(0.98 0.003 240) 0%, oklch(0.985 0.002 260) 40%, oklch(0.99 0.005 250) 100%)',
          darkGradient: 'radial-gradient(ellipse 100% 80% at 50% 100%, oklch(0.145 0.005 260) 0%, oklch(0.16 0.008 240) 40%, oklch(0.18 0.01 250) 100%)',
          lightBloom: 'radial-gradient(ellipse 90% 50% at 50% 100%, oklch(1 0 0 / 0.1) 0%, transparent 50%)',
          darkBloom: 'radial-gradient(ellipse 90% 50% at 50% 100%, oklch(0.25 0.01 250 / 0.15) 0%, transparent 50%)',
        };
      default:
        return {
          lightGradient: 'radial-gradient(ellipse 110% 100% at 50% 50%, oklch(0.99 0.005 245) 0%, oklch(0.985 0.002 255) 50%, oklch(0.98 0.003 245) 100%)',
          darkGradient: 'radial-gradient(ellipse 110% 100% at 50% 50%, oklch(0.18 0.01 245) 0%, oklch(0.16 0.008 255) 50%, oklch(0.145 0.005 245) 100%)',
          lightBloom: 'radial-gradient(ellipse 75% 75% at 50% 50%, oklch(1 0 0 / 0.1) 0%, transparent 65%)',
          darkBloom: 'radial-gradient(ellipse 75% 75% at 50% 50%, oklch(0.25 0.01 245 / 0.15) 0%, transparent 65%)',
        };
    }
  };

  const config = getGradientConfig();

  return (
    <div className={`relative min-h-screen ${className}`}>
      {/* Base gradient layer - creates the ambient light field */}
      {/* Light mode base */}
      <div 
        className="fixed inset-0 -z-10 transition-all duration-1000 ease-out dark:hidden"
        style={{
          background: config.lightGradient,
        }}
      />
      
      {/* Dark mode base */}
      <div 
        className="hidden dark:block fixed inset-0 -z-10 transition-all duration-1000 ease-out"
        style={{
          background: config.darkGradient,
        }}
      />

      {/* Light bloom layer */}
      <div 
        className="fixed inset-0 -z-10 pointer-events-none transition-opacity duration-1000 ease-out dark:hidden"
        style={{
          background: config.lightBloom,
          opacity: variant === 'explore' ? 0.85 : 0.6,
        }}
      />
      <div 
        className="hidden dark:block fixed inset-0 -z-10 pointer-events-none transition-opacity duration-1000 ease-out"
        style={{
          background: config.darkBloom,
          opacity: variant === 'explore' ? 0.5 : 0.35,
          animation: variant === 'explore' ? 'sacredGlow 8s ease-in-out infinite' : 'none',
        }}
      />
      {/* Explore: mid-layer ambient glow for depth */}
      {variant === 'explore' && (
        <>
          <div 
            className="fixed inset-0 -z-10 pointer-events-none dark:hidden"
            style={{
              background: 'radial-gradient(ellipse 70% 50% at 50% 35%, oklch(0.96 0.03 80 / 0.2) 0%, transparent 60%)',
            }}
          />
          <div 
            className="hidden dark:block fixed inset-0 -z-10 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 60% 45% at 50% 38%, oklch(0.2 0.03 80 / 0.15) 0%, transparent 55%)',
            }}
          />
        </>
      )}

      {/* Explore only: bottom counter-tone (cool slate) for depth */}
      {'lightBloomBottom' in config && config.lightBloomBottom && (
        <div 
          className="fixed inset-0 -z-10 pointer-events-none transition-opacity duration-1000 ease-out dark:hidden"
          style={{ background: config.lightBloomBottom, opacity: 0.7 }}
        />
      )}
      {'darkBloomBottom' in config && config.darkBloomBottom && config.darkBloomBottom !== 'none' && (
        <div 
          className="hidden dark:block fixed inset-0 -z-10 pointer-events-none transition-opacity duration-1000 ease-out"
          style={{ background: config.darkBloomBottom, opacity: 0.5 }}
        />
      )}

      {/* Subtle axial gradient overlay - adds horizontal symmetry */}
      {/* Light mode axial */}
      <div 
        className="fixed inset-0 -z-10 pointer-events-none dark:hidden"
        style={{
          background: 'linear-gradient(to right, transparent 0%, oklch(1 0 0 / 0.02) 50%, transparent 100%)',
        }}
      />

      {/* Dark mode axial */}
      <div 
        className="hidden dark:block fixed inset-0 -z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, transparent 0%, oklch(0.2 0.01 245 / 0.03) 50%, transparent 100%)',
        }}
      />

      {/* Explore: Oscar-level cinematic – futuristic + majestic */}
      {variant === 'explore' && (
        <style jsx>{`
          @keyframes sacredPulse { 0%, 100% { opacity: 0.04; transform: scale(1); } 50% { opacity: 0.07; transform: scale(1.02); } }
          @keyframes sacredFloat { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-6px) rotate(1.5deg); } }
          @keyframes sacredRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes sacredWave { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
          @keyframes sacredGlow { 0%, 100% { opacity: 0.6; } 50% { opacity: 0.9; } }
          @keyframes sacredBreath { 0%, 100% { opacity: 0.02; transform: scale(1); } 50% { opacity: 0.04; transform: scale(1.03); } }
          @keyframes nebulaDrift { 0%, 100% { opacity: 0.5; transform: translate(0, 0) scale(1); } 33% { opacity: 0.7; transform: translate(2%, 1%) scale(1.02); } 66% { opacity: 0.55; transform: translate(-1%, 2%) scale(0.98); } }
          @keyframes auroraFlow { 0% { opacity: 0.4; transform: translateX(-5%) scaleY(1); } 50% { opacity: 0.7; transform: translateX(2%) scaleY(1.05); } 100% { opacity: 0.4; transform: translateX(-5%) scaleY(1); } }
          @keyframes starTwinkle { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.9; } }
          @keyframes rayPulse { 0%, 100% { opacity: 0.08; } 50% { opacity: 0.14; } }
          .dark .sacred-pulse { animation: sacredPulse 10s ease-in-out infinite; }
          .dark .sacred-float { animation: sacredFloat 14s ease-in-out infinite; }
          .dark .sacred-glow { animation: sacredGlow 8s ease-in-out infinite; }
        `}</style>
      )}

      {variant === 'explore' && (
        <>
          {/* Layer 0: Cosmic nebula blobs – deep space depth (dark only) */}
          <div className="fixed inset-0 -z-20 pointer-events-none hidden dark:block" style={{ background: 'radial-gradient(ellipse 80% 60% at 20% 25%, rgba(88, 28, 135, 0.25) 0%, transparent 50%)', animation: 'nebulaDrift 18s ease-in-out infinite' }} />
          <div className="fixed inset-0 -z-20 pointer-events-none hidden dark:block" style={{ background: 'radial-gradient(ellipse 70% 50% at 80% 30%, rgba(6, 78, 59, 0.2) 0%, transparent 50%)', animation: 'nebulaDrift 22s ease-in-out infinite 2s' }} />
          <div className="fixed inset-0 -z-20 pointer-events-none hidden dark:block" style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(30, 27, 75, 0.3) 0%, transparent 55%)', animation: 'nebulaDrift 20s ease-in-out infinite 1s' }} />
          <div className="fixed inset-0 -z-20 pointer-events-none hidden dark:block" style={{ background: 'radial-gradient(ellipse 60% 80% at 60% 15%, rgba(120, 53, 15, 0.12) 0%, transparent 45%)' }} />

          {/* Star field – distant layer (dark only) */}
          <div className="fixed inset-0 -z-20 pointer-events-none hidden dark:block overflow-hidden">
            {Array.from({ length: 80 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: i % 3 === 0 ? 1.5 : 1,
                  height: i % 3 === 0 ? 1.5 : 1,
                  left: `${(i * 13.7) % 100}%`,
                  top: `${(i * 17.3 + 10) % 100}%`,
                  opacity: 0.15 + (i % 5) * 0.12,
                  animation: i % 4 === 0 ? 'starTwinkle 3s ease-in-out infinite' : 'none',
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>

          {/* Sacred light rays – cathedral / divine (majestic) */}
          <svg className="fixed inset-0 w-full h-full -z-10 pointer-events-none opacity-70 dark:opacity-100" style={{ mixBlendMode: 'soft-light' }} preserveAspectRatio="none" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="rayGrad" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="white" stopOpacity="0.2" />
                <stop offset="50%" stopColor="white" stopOpacity="0.04" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[-20, -15, -10, -5, 0, 5, 10, 15, 20].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const w = 4;
              const x1 = 50 - Math.sin(rad) * w;
              const x2 = 50 + Math.sin(rad) * w;
              return (
                <g key={i} style={{ animation: 'rayPulse 6s ease-in-out infinite', animationDelay: `${i * 0.35}s` }}>
                  <path fill="url(#rayGrad)" d={`M 50 0 L ${x1} 100 L ${x2} 100 Z`} transform={`rotate(${angle} 50 0)`} />
                </g>
              );
            })}
          </svg>

          {/* Aurora bands – ethereal flow (dark only) */}
          <div className="fixed inset-0 -z-10 pointer-events-none hidden dark:block" style={{ background: 'linear-gradient(180deg, transparent 15%, rgba(20, 184, 166, 0.06) 25%, rgba(251, 191, 36, 0.05) 35%, transparent 45%, rgba(139, 92, 246, 0.04) 55%, transparent 65%)', animation: 'auroraFlow 12s ease-in-out infinite' }} />
          <div className="fixed inset-0 -z-10 pointer-events-none hidden dark:block" style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(14, 165, 233, 0.05) 60%, rgba(251, 191, 36, 0.04) 70%, transparent 80%)', animation: 'auroraFlow 15s ease-in-out infinite 1.5s' }} />

          {/* Divine core / lens flare – top center (majestic) */}
          <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[200%] h-[80vh] -z-10 pointer-events-none dark:hidden" style={{ background: 'radial-gradient(ellipse 50% 80% at 50% 0%, rgba(255,248,220,0.35) 0%, rgba(255,236,179,0.15) 30%, transparent 60%)' }} />
          <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[180%] h-[70vh] -z-10 pointer-events-none hidden dark:block" style={{ background: 'radial-gradient(ellipse 45% 75% at 50% 0%, rgba(251,191,36,0.25) 0%, rgba(245,158,11,0.1) 35%, transparent 65%)', animation: 'sacredGlow 8s ease-in-out infinite' }} />

          {/* Mid-layer volumetric (light + dark) */}
          <div className="fixed inset-0 -z-10 pointer-events-none dark:hidden" style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 30%, oklch(0.97 0.04 85 / 0.35) 0%, transparent 60%)' }} />
          <div className="fixed inset-0 -z-10 pointer-events-none hidden dark:block" style={{ background: 'radial-gradient(ellipse 65% 50% at 50% 35%, oklch(0.28 0.06 82 / 0.2) 0%, transparent 55%)', animation: 'nebulaDrift 16s ease-in-out infinite 0.5s' }} />

          {/* Cinematic vignette – stronger */}
          <div className="fixed inset-0 -z-10 pointer-events-none dark:hidden" style={{ background: 'radial-gradient(ellipse 85% 75% at 50% 45%, transparent 35%, rgba(0,0,0,0.06) 60%, rgba(0,0,0,0.12) 100%)' }} />
          <div className="fixed inset-0 -z-10 pointer-events-none hidden dark:block" style={{ background: 'radial-gradient(ellipse 78% 68% at 50% 45%, transparent 28%, rgba(0,0,0,0.25) 58%, rgba(0,0,0,0.45) 100%)' }} />

          {/* Sacred geometry – mandalas */}
          <svg className="fixed top-0 left-0 w-80 h-80 -z-10 pointer-events-none opacity-[0.04] dark:opacity-[0.08] sacred-pulse" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="0.6" className="text-slate-800 dark:text-amber-900/50" />
            <circle cx="100" cy="100" r="68" stroke="currentColor" strokeWidth="0.5" className="text-slate-800 dark:text-amber-900/40" />
            <circle cx="100" cy="100" r="46" stroke="currentColor" strokeWidth="0.5" className="text-slate-800 dark:text-amber-900/30" />
            <line x1="100" y1="10" x2="100" y2="190" stroke="currentColor" strokeWidth="0.5" className="text-slate-800 dark:text-amber-900/40" />
            <line x1="10" y1="100" x2="190" y2="100" stroke="currentColor" strokeWidth="0.5" className="text-slate-800 dark:text-amber-900/40" />
            <line x1="35" y1="35" x2="165" y2="165" stroke="currentColor" strokeWidth="0.5" className="text-slate-800 dark:text-amber-900/30" />
            <line x1="165" y1="35" x2="35" y2="165" stroke="currentColor" strokeWidth="0.5" className="text-slate-800 dark:text-amber-900/30" />
          </svg>
          <svg className="fixed top-0 right-0 w-80 h-80 -z-10 pointer-events-none opacity-[0.035] dark:opacity-[0.06] sacred-float" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="85" stroke="currentColor" strokeWidth="0.5" className="text-slate-800 dark:text-teal-900/40" />
            <circle cx="100" cy="100" r="55" stroke="currentColor" strokeWidth="0.5" className="text-slate-800 dark:text-teal-900/30" />
            <line x1="100" y1="15" x2="100" y2="185" stroke="currentColor" strokeWidth="0.5" className="text-slate-800 dark:text-teal-900/30" />
            <line x1="15" y1="100" x2="185" y2="100" stroke="currentColor" strokeWidth="0.5" className="text-slate-800 dark:text-teal-900/30" />
            <line x1="40" y1="40" x2="160" y2="160" stroke="currentColor" strokeWidth="0.5" className="text-slate-800 dark:text-teal-900/25" />
            <line x1="160" y1="40" x2="40" y2="160" stroke="currentColor" strokeWidth="0.5" className="text-slate-800 dark:text-teal-900/25" />
          </svg>

          {/* Flowing horizon – bottom */}
          <svg className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-48 -z-10 pointer-events-none opacity-[0.06] dark:opacity-[0.12] sacred-glow" viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMin meet">
            <path d="M 0 90 Q 150 50, 400 90 T 800 90" stroke="currentColor" strokeWidth="1.5" className="text-amber-900/30 dark:text-amber-400/20" fill="none" style={{ animation: 'sacredWave 10s ease-in-out infinite' }} />
            <path d="M 0 110 Q 200 70, 400 110 T 800 110" stroke="currentColor" strokeWidth="1" className="text-teal-900/20 dark:text-teal-400/15" fill="none" style={{ animation: 'sacredWave 12s ease-in-out infinite 0.6s' }} />
            <path d="M 0 130 Q 180 85, 400 130 T 800 130" stroke="currentColor" strokeWidth="0.8" className="text-slate-600/15 dark:text-slate-400/10" fill="none" style={{ animation: 'sacredWave 14s ease-in-out infinite 1.2s' }} />
          </svg>

          {/* Corner frame – golden accent */}
          <div className="fixed top-6 left-6 w-24 h-24 -z-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-12 h-px bg-gradient-to-r from-amber-400/30 via-slate-400/20 to-transparent dark:from-amber-500/25 dark:via-slate-500/15" />
            <div className="absolute top-0 left-0 h-12 w-px bg-gradient-to-b from-amber-400/30 via-slate-400/20 to-transparent dark:from-amber-500/25 dark:via-slate-500/15" />
          </div>
          <div className="fixed top-6 right-6 w-24 h-24 -z-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-12 h-px bg-gradient-to-l from-amber-400/30 via-slate-400/20 to-transparent dark:from-amber-500/25 dark:via-slate-500/15" />
            <div className="absolute top-0 right-0 h-12 w-px bg-gradient-to-b from-amber-400/30 via-slate-400/20 to-transparent dark:from-amber-500/25 dark:via-slate-500/15" />
          </div>
          <div className="fixed bottom-6 left-6 w-24 h-24 -z-10 pointer-events-none">
            <div className="absolute bottom-0 left-0 w-12 h-px bg-gradient-to-r from-amber-400/25 via-slate-400/15 to-transparent dark:from-amber-500/20 dark:via-slate-500/10" />
            <div className="absolute bottom-0 left-0 h-12 w-px bg-gradient-to-t from-amber-400/25 via-slate-400/15 to-transparent dark:from-amber-500/20 dark:via-slate-500/10" />
          </div>
          <div className="fixed bottom-6 right-6 w-24 h-24 -z-10 pointer-events-none">
            <div className="absolute bottom-0 right-0 w-12 h-px bg-gradient-to-l from-amber-400/25 via-slate-400/15 to-transparent dark:from-amber-500/20 dark:via-slate-500/10" />
            <div className="absolute bottom-0 right-0 h-12 w-px bg-gradient-to-t from-amber-400/25 via-slate-400/15 to-transparent dark:from-amber-500/20 dark:via-slate-500/10" />
          </div>

          {/* Film grain – very subtle (dark only) */}
          <div 
            className="fixed inset-0 -z-[5] pointer-events-none hidden dark:block opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
            }}
          />
        </>
      )}

      {/* Rooms: Sanctuary – faint sacred geometry only (1–2% opacity), no animation */}
      {variant === 'rooms' && (
        <svg className="fixed top-0 left-1/2 -translate-x-1/2 w-[min(100%,600px)] h-64 -z-10 pointer-events-none opacity-[0.015] dark:opacity-[0.025]" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.5" className="text-slate-800 dark:text-slate-200" />
          <circle cx="100" cy="100" r="55" stroke="currentColor" strokeWidth="0.5" className="text-slate-800 dark:text-slate-200" />
          <circle cx="100" cy="100" r="30" stroke="currentColor" strokeWidth="0.5" className="text-slate-800 dark:text-slate-200" />
          <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" strokeWidth="0.5" className="text-slate-800 dark:text-slate-200" />
          <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="0.5" className="text-slate-800 dark:text-slate-200" />
          <line x1="35" y1="35" x2="165" y2="165" stroke="currentColor" strokeWidth="0.5" className="text-slate-800 dark:text-slate-200" />
          <line x1="165" y1="35" x2="35" y2="165" stroke="currentColor" strokeWidth="0.5" className="text-slate-800 dark:text-slate-200" />
        </svg>
      )}

      {/* Content */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
}
