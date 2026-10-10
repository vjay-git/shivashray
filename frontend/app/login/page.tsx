'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // OAuth2PasswordRequestForm expects form-encoded data
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const res = await api.post('/auth/login', formData.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const { access_token, refresh_token } = res.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      const userRes = await api.get('/auth/me');
      setUser(userRes.data);

      // BF-08: return to where the user came from
      const redirect = sessionStorage.getItem('post_login_redirect') || '/';
      sessionStorage.removeItem('post_login_redirect');
      router.push(redirect);
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-[32px] font-semibold text-gray-900 tracking-tight mb-2">Welcome back</h1>
          <p className="text-[16px] text-gray-500 font-light">Sign in to your account</p>
        </div>

        <div className="bg-white/70 backdrop-blur-2xl rounded-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/20 p-8">
          {error && (
            <div role="alert" className="mb-6 bg-red-50 border border-red-100 rounded-2xl px-5 py-4 text-[14px] text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/60 rounded-2xl text-[17px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#007aff]/30 focus:border-[#007aff]/40 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/60 rounded-2xl text-[17px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#007aff]/30 focus:border-[#007aff]/40 focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-gray-900 text-white text-[17px] font-semibold rounded-2xl hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/10"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-[14px] text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#007aff] font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
