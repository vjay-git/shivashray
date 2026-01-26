'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import { Room } from '@/types';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { hotelContent } from '@/lib/content/hotel-content';
import Link from 'next/link';

const bookingSchema = z.object({
  check_in_date: z.string().min(1, 'Check-in date is required'),
  check_out_date: z.string().min(1, 'Check-out date is required'),
  number_of_guests: z.number().min(1).max(10),
  number_of_adults: z.number().min(1).max(10).optional(),
  number_of_children: z.number().min(0).max(10).optional(),
  guest_name: z.string().min(2, 'Name is required'),
  guest_email: z.string().email('Invalid email'),
  guest_phone: z.string().optional(),
  special_requests: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  room: Room;
  initialCheckIn?: string;
  initialCheckOut?: string;
}

export function BookingForm({ room, initialCheckIn, initialCheckOut }: BookingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      check_in_date: initialCheckIn || '',
      check_out_date: initialCheckOut || '',
      number_of_guests: 1,
      number_of_adults: 1,
      number_of_children: 0,
    },
  });

  const checkIn = watch('check_in_date');
  const checkOut = watch('check_out_date');
  const numberOfGuests = watch('number_of_guests');
  const numberOfAdults = watch('number_of_adults') || 1;
  const numberOfChildren = watch('number_of_children') || 0;
  const guestName = watch('guest_name');
  const guestEmail = watch('guest_email');
  const guestPhone = watch('guest_phone');

  // Update adults when guests change
  useEffect(() => {
    if (numberOfGuests && !numberOfAdults) {
      setValue('number_of_adults', numberOfGuests);
    }
  }, [numberOfGuests, numberOfAdults, setValue]);

  useEffect(() => {
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      if (checkOutDate > checkInDate) {
        const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
        
        // Calculate base amount
        let baseAmount = nights * room.room_type.base_price;
        let extraAmount = 0;
        
        // Determine base occupancy
        const isFamilyRoom = room.room_type.name.includes('Family Room');
        const baseOccupancy = isFamilyRoom ? 4 : 2; // Quad for Family, Double for others
        
        // Calculate extra adults
        const totalAdults = numberOfAdults || numberOfGuests;
        if (totalAdults > baseOccupancy && room.room_type.extra_adult_price) {
          const extraAdults = totalAdults - baseOccupancy;
          extraAmount += extraAdults * room.room_type.extra_adult_price * nights;
        }
        
        // Calculate children charges
        if (numberOfChildren > 0 && room.room_type.child_price) {
          extraAmount += numberOfChildren * room.room_type.child_price * nights;
        }
        
        setTotalAmount(baseAmount + extraAmount);
      }
    }
  }, [checkIn, checkOut, room.room_type, numberOfAdults, numberOfChildren, numberOfGuests]);

  const today = new Date().toISOString().split('T')[0];

  const onSubmit = async (data: BookingFormData) => {
    setLoading(true);
    setError('');

    const formatDateForBackend = (dateString: string): string => {
      if (dateString.includes('T')) {
        return dateString;
      }
      return `${dateString}T00:00:00`;
    };

    try {
      const availabilityResponse = await api.get(`/rooms/${room.id}/availability`, {
        params: {
          check_in: formatDateForBackend(data.check_in_date),
          check_out: formatDateForBackend(data.check_out_date),
        },
      });

      if (!availabilityResponse.data.available) {
        setError('Room is not available for the selected dates');
        setLoading(false);
        return;
      }

      const bookingData = {
        ...data,
        room_id: room.id,
        check_in_date: formatDateForBackend(data.check_in_date),
        check_out_date: formatDateForBackend(data.check_out_date),
      };

      const response = await api.post('/bookings', bookingData);
      router.push(`/bookings/${response.data.id}`);
    } catch (err: any) {
      let errorMessage = 'Failed to create booking. Please try again.';
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (typeof detail === 'string') {
          errorMessage = detail;
        } else if (Array.isArray(detail)) {
          errorMessage = detail.map((d: any) => d.msg || JSON.stringify(d)).join(', ');
        } else if (detail.msg) {
          errorMessage = detail.msg;
        } else {
          errorMessage = JSON.stringify(detail);
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const nights = checkIn && checkOut
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50/80 backdrop-blur-sm border border-red-100 rounded-2xl px-5 py-4 animate-in slide-in-from-top-4 duration-500">
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

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-2">
            Check-in
          </label>
          <input
            type="date"
            {...register('check_in_date')}
            onFocus={() => setFocusedField('check_in_date')}
            onBlur={() => setFocusedField(null)}
            min={today}
            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/60 rounded-2xl text-[17px] text-gray-900 focus:outline-none focus:ring-0 focus:border-[#007aff]/40 focus:bg-white transition-all duration-300 ease-out"
          />
          <p className="mt-1 text-[12px] text-gray-500">Time: {hotelContent.policies.checkIn.time}</p>
          {errors.check_in_date && (
            <p className="mt-2 text-[13px] text-red-600 font-medium px-1">{errors.check_in_date.message}</p>
          )}
        </div>

        <div>
          <label className="block text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-2">
            Check-out
          </label>
          <input
            type="date"
            {...register('check_out_date')}
            onFocus={() => setFocusedField('check_out_date')}
            onBlur={() => setFocusedField(null)}
            min={checkIn || today}
            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/60 rounded-2xl text-[17px] text-gray-900 focus:outline-none focus:ring-0 focus:border-[#007aff]/40 focus:bg-white transition-all duration-300 ease-out"
          />
          <p className="mt-1 text-[12px] text-gray-500">Time: {hotelContent.policies.checkOut.time}</p>
          {errors.check_out_date && (
            <p className="mt-2 text-[13px] text-red-600 font-medium px-1">{errors.check_out_date.message}</p>
          )}
        </div>
      </div>

      {/* Number of Guests */}
      <div>
        <label className="block text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-2">
          Total Guests (max {room.room_type.max_occupancy})
        </label>
        <input
          type="number"
          {...register('number_of_guests', { valueAsNumber: true })}
          min={1}
          max={room.room_type.max_occupancy}
          className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/60 rounded-2xl text-[17px] text-gray-900 focus:outline-none focus:ring-0 focus:border-[#007aff]/40 focus:bg-white transition-all duration-300 ease-out"
        />
        {errors.number_of_guests && (
          <p className="mt-2 text-[13px] text-red-600 font-medium px-1">{errors.number_of_guests.message}</p>
        )}
      </div>

      {/* Adults and Children Breakdown */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-2">
            Adults
          </label>
          <input
            type="number"
            {...register('number_of_adults', { valueAsNumber: true })}
            min={1}
            max={room.room_type.max_occupancy}
            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/60 rounded-2xl text-[17px] text-gray-900 focus:outline-none focus:ring-0 focus:border-[#007aff]/40 focus:bg-white transition-all duration-300 ease-out"
          />
          {errors.number_of_adults && (
            <p className="mt-2 text-[13px] text-red-600 font-medium px-1">{errors.number_of_adults.message}</p>
          )}
        </div>

        <div>
          <label className="block text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-2">
            Children (0-12 years)
          </label>
          <input
            type="number"
            {...register('number_of_children', { valueAsNumber: true })}
            min={0}
            max={room.room_type.max_occupancy}
            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/60 rounded-2xl text-[17px] text-gray-900 focus:outline-none focus:ring-0 focus:border-[#007aff]/40 focus:bg-white transition-all duration-300 ease-out"
          />
          {errors.number_of_children && (
            <p className="mt-2 text-[13px] text-red-600 font-medium px-1">{errors.number_of_children.message}</p>
          )}
        </div>
      </div>

      {/* Guest Information */}
      <div className="pt-4 border-t border-gray-100/60 space-y-6">
        <div className="relative">
          <input
            type="text"
            {...register('guest_name')}
            onFocus={() => setFocusedField('guest_name')}
            onBlur={() => setFocusedField(null)}
            className="w-full px-4 pt-6 pb-2 bg-gray-50/50 border border-gray-200/60 rounded-2xl text-[17px] text-gray-900 placeholder-transparent focus:outline-none focus:ring-0 focus:border-[#007aff]/40 focus:bg-white transition-all duration-300 ease-out"
            placeholder="Guest Name"
          />
          <label
            className={`absolute left-4 transition-all duration-300 ease-out pointer-events-none ${
              guestName || focusedField === 'guest_name'
                ? 'top-2 text-[13px] text-[#007aff] font-medium'
                : 'top-4 text-[17px] text-gray-500'
            }`}
          >
            Guest Name
          </label>
          {errors.guest_name && (
            <p className="mt-2 text-[13px] text-red-600 font-medium px-1">{errors.guest_name.message}</p>
          )}
        </div>

        <div className="relative">
          <input
            type="email"
            {...register('guest_email')}
            onFocus={() => setFocusedField('guest_email')}
            onBlur={() => setFocusedField(null)}
            className="w-full px-4 pt-6 pb-2 bg-gray-50/50 border border-gray-200/60 rounded-2xl text-[17px] text-gray-900 placeholder-transparent focus:outline-none focus:ring-0 focus:border-[#007aff]/40 focus:bg-white transition-all duration-300 ease-out"
            placeholder="Email"
          />
          <label
            className={`absolute left-4 transition-all duration-300 ease-out pointer-events-none ${
              guestEmail || focusedField === 'guest_email'
                ? 'top-2 text-[13px] text-[#007aff] font-medium'
                : 'top-4 text-[17px] text-gray-500'
            }`}
          >
            Email
          </label>
          {errors.guest_email && (
            <p className="mt-2 text-[13px] text-red-600 font-medium px-1">{errors.guest_email.message}</p>
          )}
        </div>

        <div className="relative">
          <input
            type="tel"
            {...register('guest_phone')}
            onFocus={() => setFocusedField('guest_phone')}
            onBlur={() => setFocusedField(null)}
            className="w-full px-4 pt-6 pb-2 bg-gray-50/50 border border-gray-200/60 rounded-2xl text-[17px] text-gray-900 placeholder-transparent focus:outline-none focus:ring-0 focus:border-[#007aff]/40 focus:bg-white transition-all duration-300 ease-out"
            placeholder="Phone (Optional)"
          />
          <label
            className={`absolute left-4 transition-all duration-300 ease-out pointer-events-none ${
              guestPhone || focusedField === 'guest_phone'
                ? 'top-2 text-[13px] text-[#007aff] font-medium'
                : 'top-4 text-[17px] text-gray-500'
            }`}
          >
            Phone <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
        </div>

        <div>
          <label className="block text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-2">
            Special Requests <span className="normal-case text-gray-400 font-normal">(Optional)</span>
          </label>
          <textarea
            {...register('special_requests')}
            rows={3}
            onFocus={() => setFocusedField('special_requests')}
            onBlur={() => setFocusedField(null)}
            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/60 rounded-2xl text-[17px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-[#007aff]/40 focus:bg-white transition-all duration-300 ease-out resize-none"
            placeholder="Enter any special requests or preferences..."
          />
        </div>
      </div>

      {/* Total Amount */}
      {totalAmount > 0 && (() => {
        const nights = checkIn && checkOut
          ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
          : 0;
        
        const isFamilyRoom = room.room_type.name.includes('Family Room');
        const baseOccupancy = isFamilyRoom ? 4 : 2;
        const baseAmount = nights * room.room_type.base_price;
        const totalAdults = numberOfAdults || numberOfGuests;
        const extraAdults = totalAdults > baseOccupancy ? totalAdults - baseOccupancy : 0;
        const extraAdultsAmount = extraAdults > 0 && room.room_type.extra_adult_price
          ? extraAdults * room.room_type.extra_adult_price * nights
          : 0;
        const childrenAmount = numberOfChildren > 0 && room.room_type.child_price
          ? numberOfChildren * room.room_type.child_price * nights
          : 0;
        
        return (
          <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100/60">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[15px] text-gray-600 font-light">
                  Base price ({isFamilyRoom ? 'Quad' : 'Double'} occupancy)
                </span>
                <span className="text-[17px] font-medium text-gray-900">₹{room.room_type.base_price.toLocaleString('en-IN')}/night</span>
              </div>
              {extraAdults > 0 && room.room_type.extra_adult_price && (
                <div className="flex justify-between items-center">
                  <span className="text-[15px] text-gray-600 font-light">
                    Extra Adult{extraAdults > 1 ? 's' : ''} ({extraAdults} × ₹{room.room_type.extra_adult_price.toLocaleString('en-IN')}/night)
                  </span>
                  <span className="text-[15px] font-medium text-gray-900">₹{extraAdultsAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              {numberOfChildren > 0 && room.room_type.child_price && (
                <div className="flex justify-between items-center">
                  <span className="text-[15px] text-gray-600 font-light">
                    Child{numberOfChildren > 1 ? 'ren' : ''} ({numberOfChildren} × ₹{room.room_type.child_price.toLocaleString('en-IN')}/night)
                  </span>
                  <span className="text-[15px] font-medium text-gray-900">₹{childrenAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2">
                <span className="text-[15px] text-gray-600 font-light">{nights} {nights === 1 ? 'night' : 'nights'}</span>
                <span className="text-[15px] text-gray-600 font-light">× {nights}</span>
              </div>
              <div className="pt-4 border-t border-gray-200/60 flex justify-between items-center">
                <span className="text-[17px] font-semibold text-gray-900">Total</span>
                <span className="text-[28px] font-semibold text-gray-900 tracking-tight">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Policies Information */}
      <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100/60 space-y-4">
        <h3 className="text-[17px] font-semibold text-gray-900">Important Information</h3>
        
        <div className="space-y-3 text-[14px] text-gray-700">
          <div>
            <p className="font-medium text-gray-900 mb-1">Cancellation Policy:</p>
            <p>{hotelContent.policies.cancellation.description}</p>
          </div>
          
          <div>
            <p className="font-medium text-gray-900 mb-1">Child Policy:</p>
            <p>{hotelContent.policies.childPolicy.description}</p>
          </div>

          <div>
            <p className="font-medium text-gray-900 mb-1">Important Notes:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Valid ID proof required for check-in (Local ID not accepted)</li>
              <li>Meal Plan: {hotelContent.property.mealPlan}</li>
            </ul>
          </div>
        </div>

        <p className="text-[13px] text-gray-600">
          By proceeding, you agree to our{' '}
          <Link href="/terms" className="text-[#007aff] hover:underline font-medium">
            Terms & Conditions
          </Link>
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-4 bg-gray-900 text-white text-[17px] font-semibold rounded-2xl hover:bg-gray-800 active:scale-[0.98] transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-lg shadow-black/10"
      >
        {loading ? (
          <span className="flex items-center justify-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Processing...</span>
          </span>
        ) : (
          'Confirm Booking'
        )}
      </button>
    </form>
  );
}
