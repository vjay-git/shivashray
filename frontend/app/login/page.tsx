'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PremiumBackground } from '@/components/layout/PremiumBackground';

const GOLD = '#D4AF37';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const inputBase =
  'w-full px-4 py-3.5 rounded-[14px] text-[16px] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-white/90 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/40 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]/50 transition-all duration-200 leading-relaxed';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (searchParams.get('registered') === 'true') {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    try {
      const formData = new URLSearchParams();
      formData.append('username', data.email);
      formData.append('password', data.password);
      const response = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      const { access_token, refresh_token } = response.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      const userResponse = await api.get('/auth/me');
      setUser(userResponse.data);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'We couldn’t sign you in. Please try again.');
    }
  };

  return (
    <PremiumBackground variant="rooms">
      <div className="fixed inset-0 pointer-events-none z-[1]" style={{ boxShadow: 'inset 0 0 120px rgba(0,0,0,0.04)' }} />
      <div className="fixed inset-0 pointer-events-none z-[1] hidden dark:block" style={{ boxShadow: 'inset 0 0 140px rgba(0,0,0,0.2)' }} />

      <div className="relative z-0 min-h-screen flex items-center justify-center px-4 py-16 sm:py-20">
        <div
          className={`w-full max-w-[420px] transition-all duration-[600ms] ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {success && (
            <div className="mb-6 rounded-[14px] px-4 py-3 bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-emerald-800 dark:text-emerald-200 text-[15px] font-light">
              Registration successful. Please sign in.
            </div>
          )}

          <div className="rounded-[20px] overflow-hidden bg-white/95 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/40 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
            <div className="px-8 pt-10 pb-6 text-center">
              <h1
                className="text-3xl sm:text-4xl font-light text-slate-900 dark:text-slate-100 tracking-tight"
                style={{ fontFamily: 'var(--font-playfair-display), Georgia, serif' }}
              >
                Welcome Back
              </h1>
              <p className="mt-2 text-[15px] text-slate-500 dark:text-slate-400 font-light">
                Step gently into your space.
              </p>
              <div className="flex items-center justify-center gap-2 mt-6">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-slate-300/60 to-slate-300/60 dark:via-slate-500/40" />
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400/50 dark:bg-slate-500/40" />
                <div className="h-px w-16 bg-gradient-to-l from-transparent via-slate-300/60 to-slate-300/60 dark:via-slate-500/40" />
              </div>
            </div>

            <div className="px-8 pb-10">
              {error && (
                <p className="mb-4 text-[14px] text-rose-600/90 dark:text-rose-400/90 font-light">
                  {error}
                </p>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label htmlFor="login-email" className="block text-[13px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                    Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    {...register('email')}
                    className={inputBase}
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'login-email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="login-email-error" className="mt-1.5 text-[13px] text-rose-600/90 dark:text-rose-400/90 font-light">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="login-password" className="block text-[13px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                    Password
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    {...register('password')}
                    className={inputBase}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'login-password-error' : undefined}
                  />
                  {errors.password && (
                    <p id="login-password-error" className="mt-1.5 text-[13px] text-rose-600/90 dark:text-rose-400/90 font-light">
                      {errors.password.message}
                    </p>
                  )}
                  <p className="mt-2 text-[13px]">
                    <Link
                      href="/contact"
                      className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:underline transition-colors duration-200 font-light"
                    >
                      Forgot password?
                    </Link>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-[14px] text-[16px] font-medium text-slate-900 dark:text-slate-100 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  style={{
                    background: GOLD,
                    color: '#0F1115',
                    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden>
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Entering…
                    </span>
                  ) : (
                    'Enter'
                  )}
                </button>
              </form>

              <p className="mt-8 text-center text-[15px] text-slate-500 dark:text-slate-400 font-light">
                New here?{' '}
                <Link
                  href="/register"
                  className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:underline transition-colors duration-200"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PremiumBackground>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8F6F2] dark:bg-[#0F1115]">
          <p className="text-slate-500 dark:text-slate-400 font-light">Loading…</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
