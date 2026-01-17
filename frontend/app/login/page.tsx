'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const emailValue = watch('email');
  const passwordValue = watch('password');

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    try {
      const formData = new URLSearchParams();
      formData.append('username', data.email);
      formData.append('password', data.password);
      
      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token, refresh_token } = response.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      // Fetch user info
      const userResponse = await api.get('/auth/me');
      setUser(userResponse.data);

      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#f5f5f7] px-4 py-12">
      {/* Subtle Background Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#007aff]/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#5856d6]/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#af52de]/2 rounded-full blur-3xl"></div>
      </div>

      <div 
        className={`w-full max-w-md relative z-10 transition-all duration-700 ease-out ${
          mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
        }`}
      >
        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-4 shadow-lg shadow-black/5 animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#34c759]/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#34c759]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-[15px] font-medium text-gray-900">Registration successful! Please login.</span>
            </div>
          </div>
        )}

        {/* Glassmorphism Card */}
        <div className="bg-white/70 backdrop-blur-2xl rounded-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-12 pb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100/50 mb-6">
              <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-[32px] font-semibold text-gray-900 mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-[15px] text-gray-600 font-light">Sign in to continue</p>
          </div>

          {/* Form Section */}
          <div className="px-8 pb-10">
            {error && (
              <div className="mb-6 bg-red-50/80 backdrop-blur-sm border border-red-100 rounded-2xl px-5 py-4 animate-in slide-in-from-top-4 duration-500">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <span className="text-[15px] font-medium text-red-900">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field with Floating Label */}
              <div className="relative">
                <div className="relative">
                  <input
                    type="email"
                    {...register('email')}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className="peer w-full px-4 pt-6 pb-2 bg-gray-50/50 border border-gray-200/60 rounded-2xl text-[17px] text-gray-900 placeholder-transparent focus:outline-none focus:ring-0 focus:border-[#007aff]/40 focus:bg-white transition-all duration-300 ease-out"
                    placeholder="Email"
                  />
                  <label
                    className={`absolute left-4 transition-all duration-300 ease-out pointer-events-none ${
                      emailValue || focusedField === 'email'
                        ? 'top-2 text-[13px] text-[#007aff] font-medium'
                        : 'top-4 text-[17px] text-gray-500'
                    }`}
                  >
                    Email
                  </label>
                </div>
                {errors.email && (
                  <p className="mt-2 text-[13px] text-red-600 font-medium flex items-center space-x-1.5 px-1">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{errors.email.message}</span>
                  </p>
                )}
              </div>

              {/* Password Field with Floating Label */}
              <div className="relative">
                <div className="relative">
                  <input
                    type="password"
                    {...register('password')}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className="peer w-full px-4 pt-6 pb-2 bg-gray-50/50 border border-gray-200/60 rounded-2xl text-[17px] text-gray-900 placeholder-transparent focus:outline-none focus:ring-0 focus:border-[#007aff]/40 focus:bg-white transition-all duration-300 ease-out"
                    placeholder="Password"
                  />
                  <label
                    className={`absolute left-4 transition-all duration-300 ease-out pointer-events-none ${
                      passwordValue || focusedField === 'password'
                        ? 'top-2 text-[13px] text-[#007aff] font-medium'
                        : 'top-4 text-[17px] text-gray-500'
                    }`}
                  >
                    Password
                  </label>
                </div>
                {errors.password && (
                  <p className="mt-2 text-[13px] text-red-600 font-medium flex items-center space-x-1.5 px-1">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{errors.password.message}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full bg-gray-900 text-white font-semibold py-4 rounded-2xl text-[17px] shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/15 active:scale-[0.98] transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <svg
                        className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-300 ease-out"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-[15px] text-gray-600 font-light">
                Don't have an account?{' '}
                <Link
                  href="/register"
                  className="font-semibold text-[#007aff] hover:text-[#0051d5] transition-colors duration-200 inline-flex items-center space-x-1"
                >
                  <span>Sign up</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
