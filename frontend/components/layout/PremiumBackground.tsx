'use client';

import { ReactNode } from 'react';

interface PremiumBackgroundProps {
  children: ReactNode;
  variant?: 'default' | 'center' | 'top' | 'bottom' | 'explore';
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
      case 'explore':
        return {
          // Sacred gradient - warm, reverent tones inspired by spiritual light
          // Light mode: Soft golden-amber glow from above, like morning light in a temple
          lightGradient: 'radial-gradient(ellipse 140% 120% at 50% 0%, oklch(0.99 0.012 75) 0%, oklch(0.985 0.008 65) 30%, oklch(0.98 0.005 70) 60%, oklch(0.975 0.003 60) 100%)',
          // Dark mode: Deep sacred space with warm amber light bloom
          darkGradient: 'radial-gradient(ellipse 140% 120% at 50% 0%, oklch(0.16 0.015 75) 0%, oklch(0.15 0.012 65) 30%, oklch(0.145 0.008 70) 60%, oklch(0.14 0.005 60) 100%)',
          // Sacred light bloom - golden warmth descending
          lightBloom: 'radial-gradient(ellipse 90% 70% at 50% 15%, oklch(0.98 0.02 80 / 0.25) 0%, oklch(0.97 0.015 75 / 0.15) 40%, transparent 70%)',
          // Dark mode sacred bloom - dim golden light
          darkBloom: 'radial-gradient(ellipse 90% 70% at 50% 15%, oklch(0.22 0.02 80 / 0.3) 0%, oklch(0.19 0.015 75 / 0.2) 40%, transparent 70%)',
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

      {/* Light bloom layer - adds depth and polish */}
      {/* Light mode bloom */}
      <div 
        className="fixed inset-0 -z-10 pointer-events-none transition-opacity duration-1000 ease-out dark:hidden"
        style={{
          background: config.lightBloom,
          opacity: 0.6,
        }}
      />

      {/* Dark mode bloom with gentle pulse */}
      <div 
        className="hidden dark:block fixed inset-0 -z-10 pointer-events-none transition-opacity duration-1000 ease-out"
        style={{
          background: config.darkBloom,
          opacity: 0.4,
          animation: variant === 'explore' ? 'sacredGlow 8s ease-in-out infinite' : 'none',
        }}
      />

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

      {/* Sacred Animations Styles */}
      {variant === 'explore' && (
        <style jsx>{`
          @keyframes sacredPulse {
            0%, 100% {
              opacity: 0.03;
              transform: scale(1);
            }
            50% {
              opacity: 0.05;
              transform: scale(1.02);
            }
          }
          @keyframes sacredFloat {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }
            50% {
              transform: translateY(-8px) rotate(2deg);
            }
          }
          @keyframes sacredRotate {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          @keyframes sacredWave {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-3px);
            }
          }
          @keyframes sacredGlow {
            0%, 100% {
              opacity: 0.02;
            }
            50% {
              opacity: 0.04;
            }
          }
          @keyframes sacredBreath {
            0%, 100% {
              opacity: 0.015;
              transform: scale(1);
            }
            50% {
              opacity: 0.025;
              transform: scale(1.05);
            }
          }
          .dark .sacred-pulse {
            animation: sacredPulse 8s ease-in-out infinite;
          }
          .dark .sacred-float {
            animation: sacredFloat 12s ease-in-out infinite;
          }
          .dark .sacred-rotate {
            animation: sacredRotate 60s linear infinite;
          }
          .dark .sacred-glow {
            animation: sacredGlow 6s ease-in-out infinite;
          }
          .dark .sacred-breath {
            animation: sacredBreath 10s ease-in-out infinite;
          }
        `}</style>
      )}

      {/* Decorative Design Elements - Only for explore variant */}
      {variant === 'explore' && (
        <>
          {/* Sacred geometric pattern - top corners */}
          <svg 
            className="fixed top-0 left-0 w-64 h-64 -z-10 pointer-events-none opacity-[0.03] dark:opacity-[0.05] sacred-pulse"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Mandala-inspired pattern */}
            <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.5" className="text-slate-900 dark:text-slate-100" />
            <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.5" className="text-slate-900 dark:text-slate-100" />
            <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="0.5" className="text-slate-900 dark:text-slate-100" />
            <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" strokeWidth="0.5" className="text-slate-900 dark:text-slate-100" />
            <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="0.5" className="text-slate-900 dark:text-slate-100" />
            <line x1="40" y1="40" x2="160" y2="160" stroke="currentColor" strokeWidth="0.5" className="text-slate-900 dark:text-slate-100" />
            <line x1="160" y1="40" x2="40" y2="160" stroke="currentColor" strokeWidth="0.5" className="text-slate-900 dark:text-slate-100" />
          </svg>

          <svg 
            className="fixed top-0 right-0 w-64 h-64 -z-10 pointer-events-none opacity-[0.03] dark:opacity-[0.05] sacred-float"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.5" className="text-slate-900 dark:text-slate-100" />
            <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.5" className="text-slate-900 dark:text-slate-100" />
            <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="0.5" className="text-slate-900 dark:text-slate-100" />
            <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" strokeWidth="0.5" className="text-slate-900 dark:text-slate-100" />
            <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="0.5" className="text-slate-900 dark:text-slate-100" />
            <line x1="40" y1="40" x2="160" y2="160" stroke="currentColor" strokeWidth="0.5" className="text-slate-900 dark:text-slate-100" />
            <line x1="160" y1="40" x2="40" y2="160" stroke="currentColor" strokeWidth="0.5" className="text-slate-900 dark:text-slate-100" />
          </svg>

          {/* Flowing line design - bottom */}
          <svg 
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-32 -z-10 pointer-events-none opacity-[0.02] dark:opacity-[0.04] sacred-glow"
            viewBox="0 0 800 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMin meet"
          >
            {/* Flowing sacred wave pattern */}
            <path 
              d="M 0 100 Q 200 50, 400 100 T 800 100" 
              stroke="currentColor" 
              strokeWidth="1" 
              className="text-slate-900 dark:text-slate-100"
              fill="none"
              style={{
                animation: 'sacredWave 8s ease-in-out infinite'
              }}
            />
            <path 
              d="M 0 120 Q 200 70, 400 120 T 800 120" 
              stroke="currentColor" 
              strokeWidth="0.8" 
              className="text-slate-900 dark:text-slate-100"
              fill="none"
              style={{
                animation: 'sacredWave 10s ease-in-out infinite 0.5s'
              }}
            />
            <path 
              d="M 0 140 Q 200 90, 400 140 T 800 140" 
              stroke="currentColor" 
              strokeWidth="0.6" 
              className="text-slate-900 dark:text-slate-100"
              fill="none"
              style={{
                animation: 'sacredWave 12s ease-in-out infinite 1s'
              }}
            />
          </svg>

          {/* Subtle corner accents */}
          <div className="fixed top-8 left-8 w-16 h-16 -z-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-8 h-px bg-gradient-to-r from-slate-400/20 to-transparent dark:from-slate-500/20" />
            <div className="absolute top-0 left-0 h-8 w-px bg-gradient-to-b from-slate-400/20 to-transparent dark:from-slate-500/20" />
          </div>

          <div className="fixed top-8 right-8 w-16 h-16 -z-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-8 h-px bg-gradient-to-l from-slate-400/20 to-transparent dark:from-slate-500/20" />
            <div className="absolute top-0 right-0 h-8 w-px bg-gradient-to-b from-slate-400/20 to-transparent dark:from-slate-500/20" />
          </div>

          <div className="fixed bottom-8 left-8 w-16 h-16 -z-10 pointer-events-none">
            <div className="absolute bottom-0 left-0 w-8 h-px bg-gradient-to-r from-slate-400/20 to-transparent dark:from-slate-500/20" />
            <div className="absolute bottom-0 left-0 h-8 w-px bg-gradient-to-t from-slate-400/20 to-transparent dark:from-slate-500/20" />
          </div>

          <div className="fixed bottom-8 right-8 w-16 h-16 -z-10 pointer-events-none">
            <div className="absolute bottom-0 right-0 w-8 h-px bg-gradient-to-l from-slate-400/20 to-transparent dark:from-slate-500/20" />
            <div className="absolute bottom-0 right-0 h-8 w-px bg-gradient-to-t from-slate-400/20 to-transparent dark:from-slate-500/20" />
          </div>
        </>
      )}

      {/* Content */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
}
