'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Booking } from '@/types';
import { useAuthStore } from '@/lib/store';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    revenue: 0,
  });

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchBookings();
  }, [isAuthenticated, user, router]);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/admin/bookings');
      setBookings(response.data);
      
      // Calculate stats
      const total = response.data.length;
      const confirmed = response.data.filter((b: Booking) => b.status === 'confirmed').length;
      const pending = response.data.filter((b: Booking) => b.status === 'pending').length;
      const revenue = response.data
        .filter((b: Booking) => b.payment_status === 'paid')
        .reduce((sum: number, b: Booking) => sum + b.total_amount, 0);
      
      setStats({ total, confirmed, pending, revenue });
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-50/80 text-emerald-700 border-emerald-200/60';
      case 'checked_in':
        return 'bg-blue-50/80 text-blue-700 border-blue-200/60';
      case 'checked_out':
        return 'bg-slate-50/80 text-slate-700 border-slate-200/60';
      case 'cancelled':
        return 'bg-rose-50/80 text-rose-700 border-rose-200/60';
      default:
        return 'bg-amber-50/80 text-amber-700 border-amber-200/60';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-50/60 text-emerald-700';
      case 'refunded':
        return 'bg-slate-50/60 text-slate-700';
      default:
        return 'bg-amber-50/60 text-amber-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
          <p className="text-[15px] text-gray-600 font-light">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] relative overflow-hidden">
      {/* Subtle Background Mesh */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#007aff]/2 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#5856d6]/2 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-white/20 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[34px] font-semibold text-gray-900 tracking-tight mb-1">Dashboard</h1>
                <p className="text-[15px] text-gray-600 font-light">Manage bookings and rooms</p>
              </div>
              <Link
                href="/admin/rooms"
                className="px-5 py-2.5 bg-gray-900 text-white text-[15px] font-medium rounded-2xl hover:bg-gray-800 active:scale-[0.98] transition-all duration-300 ease-out shadow-lg shadow-black/10"
              >
                Manage Rooms
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div 
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 transition-all duration-700 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {/* Total Bookings */}
            <div className="group bg-white/70 backdrop-blur-2xl rounded-[24px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/20 hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)] transition-all duration-500 ease-out hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-100/50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <p className="text-[13px] text-gray-600 font-medium mb-1">Total Bookings</p>
              <p className="text-[32px] font-semibold text-gray-900 tracking-tight">{stats.total}</p>
            </div>

            {/* Confirmed */}
            <div className="group bg-white/70 backdrop-blur-2xl rounded-[24px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/20 hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)] transition-all duration-500 ease-out hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100/50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-[13px] text-gray-600 font-medium mb-1">Confirmed</p>
              <p className="text-[32px] font-semibold text-gray-900 tracking-tight">{stats.confirmed}</p>
            </div>

            {/* Pending */}
            <div className="group bg-white/70 backdrop-blur-2xl rounded-[24px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/20 hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)] transition-all duration-500 ease-out hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100/50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-[13px] text-gray-600 font-medium mb-1">Pending</p>
              <p className="text-[32px] font-semibold text-gray-900 tracking-tight">{stats.pending}</p>
            </div>

            {/* Revenue */}
            <div className="group bg-white/70 backdrop-blur-2xl rounded-[24px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/20 hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)] transition-all duration-500 ease-out hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100/50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-[13px] text-gray-600 font-medium mb-1">Revenue</p>
              <p className="text-[32px] font-semibold text-gray-900 tracking-tight">₹{stats.revenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
            </div>
          </div>

          {/* Bookings Section */}
          <div 
            className={`bg-white/70 backdrop-blur-2xl rounded-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/20 overflow-hidden transition-all duration-700 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="px-8 py-6 border-b border-gray-100/60">
              <h2 className="text-[24px] font-semibold text-gray-900 tracking-tight">Recent Bookings</h2>
              <p className="text-[15px] text-gray-600 font-light mt-1">Manage and track all reservations</p>
            </div>

            <div className="p-6">
              {bookings.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100/50 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-[17px] text-gray-600 font-light">No bookings yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.slice(0, 10).map((booking, index) => (
                    <Link
                      key={booking.id}
                      href={`/admin/bookings/${booking.id}`}
                      className="group block bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-100/60 hover:border-gray-200/80 hover:bg-white/70 hover:shadow-lg transition-all duration-300 ease-out"
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 rounded-xl bg-gray-100/50 flex items-center justify-center">
                                <span className="text-[17px] font-semibold text-gray-700">#{booking.id}</span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-[17px] font-semibold text-gray-900 truncate">{booking.guest_name}</h3>
                              <p className="text-[13px] text-gray-600 font-light mt-0.5">{booking.guest_email}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div>
                              <p className="text-[11px] text-gray-500 uppercase tracking-wide font-medium mb-1">Check-in</p>
                              <p className="text-[15px] text-gray-900 font-medium">
                                {new Date(booking.check_in_date).toLocaleDateString('en-IN', { 
                                  day: 'numeric', 
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                            <div>
                              <p className="text-[11px] text-gray-500 uppercase tracking-wide font-medium mb-1">Check-out</p>
                              <p className="text-[15px] text-gray-900 font-medium">
                                {new Date(booking.check_out_date).toLocaleDateString('en-IN', { 
                                  day: 'numeric', 
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                            <div>
                              <p className="text-[11px] text-gray-500 uppercase tracking-wide font-medium mb-1">Amount</p>
                              <p className="text-[15px] text-gray-900 font-semibold">₹{booking.total_amount.toLocaleString('en-IN')}</p>
                            </div>
                            <div>
                              <p className="text-[11px] text-gray-500 uppercase tracking-wide font-medium mb-1">Guests</p>
                              <p className="text-[15px] text-gray-900 font-medium">{booking.number_of_guests}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end space-y-2 ml-6">
                          <span className={`px-3 py-1.5 rounded-xl text-[12px] font-medium border ${getStatusColor(booking.status)}`}>
                            {booking.status.replace('_', ' ')}
                          </span>
                          <span className={`px-3 py-1.5 rounded-xl text-[12px] font-medium ${getPaymentStatusColor(booking.payment_status)}`}>
                            {booking.payment_status}
                          </span>
                          <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
