'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import { Room } from '@/types';
import { useRouter } from 'next/navigation';
import { hotelContent } from '@/lib/content/hotel-content';
import Link from 'next/link';

// PR-01: GST slabs (mirrors backend _gst_rate)
function gstRate(effectiveNightly: number): number {
  if (effectiveNightly >= 7500) return 0.18;
  if (effectiveNightly >= 2500) return 0.12;
  return 0;
}

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

// Shared input class — visible focus ring replaces the prior focus:ring-0 (WCAG 2.4.7)
const INPUT_CLASS =
  'w-full px-4 py-3 bg-gray-50/50 border border-gray-200/60 rounded-2xl text-[17px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#007aff]/30 focus:border-[#007aff]/40 focus:bg-white transition-all duration-300 ease-out';
const FLOAT_INPUT_CLASS =
  'w-full px-4 pt-6 pb-2 bg-gray-50/50 border border-gray-200/60 rounded-2xl text-[17px] text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#007aff]/30 focus:border-[#007aff]/40 focus:bg-white transition-all duration-300 ease-out';

export function BookingForm({ room, initialCheckIn, initialCheckOut }: BookingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pretaxAmount, setPretaxAmount] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [priceChangedDialog, setPriceChangedDialog] = useState<{ oldPrice: number; newPrice: number } | null>(null);
  const submittingRef = useRef(false); // BF-16: synchronous guard against double-submit
  const lastSubmitDataRef = useRef<(BookingFormData & { room_id: number; check_in_date: string; check_out_date: string }) | null>(null);

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

  // BF-08: restore saved draft after login redirect
  useEffect(() => {
    const saved = sessionStorage.getItem(`booking_draft_${room.id}`);
    if (!saved) return;
    try {
      const draft = JSON.parse(saved) as Partial<BookingFormData>;
      (Object.entries(draft) as [keyof BookingFormData, any][]).forEach(([key, value]) => {
        setValue(key, value);
      });
    } catch {
      sessionStorage.removeItem(`booking_draft_${room.id}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.id]);

  const checkIn = watch('check_in_date');
  const checkOut = watch('check_out_date');
  const numberOfGuests = watch('number_of_guests');
  const numberOfAdults = watch('number_of_adults') || 1;
  const numberOfChildren = watch('number_of_children') || 0;
  const guestName = watch('guest_name');
  const guestEmail = watch('guest_email');
  const guestPhone = watch('guest_phone');

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

        const baseOccupancy = room.room_type.max_occupancy;
        let pretax = nights * room.room_type.base_price;

        const totalAdults = numberOfAdults || numberOfGuests;
        if (totalAdults > baseOccupancy && room.room_type.extra_adult_price) {
          pretax += (totalAdults - baseOccupancy) * room.room_type.extra_adult_price * nights;
        }
        // PR-02: children are zero-charge

        const effectiveNightly = pretax / nights;
        const rate = gstRate(effectiveNightly);
        const tax = Math.round(pretax * rate * 100) / 100;

        setPretaxAmount(pretax);
        setTaxRate(rate);
        setTaxAmount(tax);
      } else {
        setPretaxAmount(0);
        setTaxRate(0);
        setTaxAmount(0);
      }
    }
  }, [checkIn, checkOut, room.room_type, numberOfAdults, numberOfChildren, numberOfGuests]);

  const today = new Date().toISOString().split('T')[0];

  const formatDateForBackend = (dateString: string): string => {
    if (dateString.includes('T')) return dateString;
    return `${dateString}T00:00:00`;
  };

  const submitBooking = async (payload: object) => {
    const response = await api.post('/bookings', payload);
    sessionStorage.removeItem(`booking_draft_${room.id}`);
    router.push(`/bookings/${response.data.id}`);
  };

  const onSubmit = async (data: BookingFormData) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setLoading(true);
    setError('');

    sessionStorage.setItem(`booking_draft_${room.id}`, JSON.stringify(data));

    const bookingData = {
      ...data,
      room_id: room.id,
      check_in_date: formatDateForBackend(data.check_in_date),
      check_out_date: formatDateForBackend(data.check_out_date),
      quoted_amount: pretaxAmount + taxAmount, // PR-04
    };
    lastSubmitDataRef.current = bookingData;

    try {
      await submitBooking(bookingData);
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (err.response?.status === 409 && detail?.code === 'PRICE_CHANGED') {
        setPriceChangedDialog({ oldPrice: detail.old_price, newPrice: detail.new_price });
      } else {
        let errorMessage = 'Failed to create booking. Please try again.';
        if (detail) {
          if (typeof detail === 'string') {
            errorMessage = detail;
          } else if (Array.isArray(detail)) {
            errorMessage = detail.map((d: any) => d.msg || JSON.stringify(d)).join(', ');
          } else if (detail.msg) {
            errorMessage = detail.msg;
          }
        }
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  };

  const confirmAtNewPrice = async () => {
    if (!lastSubmitDataRef.current || !priceChangedDialog) return;
    setPriceChangedDialog(null);
    setLoading(true);
    try {
      await submitBooking({ ...lastSubmitDataRef.current, quoted_amount: priceChangedDialog.newPrice });
    } catch {
      setError('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nights = checkIn && checkOut
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const maxOccupancy = room.room_type.max_occupancy;

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Server error banner — role="alert" so screen readers announce it immediately */}
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="bg-red-50/80 backdrop-blur-sm border border-red-100 rounded-2xl px-5 py-4 animate-in slide-in-from-top-4 duration-500"
        >
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
          <label htmlFor="check_in_date" className="block text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-2">
            Check-in
          </label>
          <input
            id="check_in_date"
            type="date"
            {...register('check_in_date')}
            onFocus={() => setFocusedField('check_in_date')}
            onBlur={() => setFocusedField(null)}
            min={today}
            aria-invalid={!!errors.check_in_date}
            aria-describedby={errors.check_in_date ? 'check_in_date-error' : undefined}
            className={INPUT_CLASS}
          />
          <p className="mt-1 text-[12px] text-gray-500">Time: {hotelContent.policies.checkIn.time}</p>
          {errors.check_in_date && (
            <p id="check_in_date-error" role="alert" className="mt-2 text-[13px] text-red-600 font-medium px-1">
              {errors.check_in_date.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="check_out_date" className="block text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-2">
            Check-out
          </label>
          <input
            id="check_out_date"
            type="date"
            {...register('check_out_date')}
            onFocus={() => setFocusedField('check_out_date')}
            onBlur={() => setFocusedField(null)}
            min={checkIn || today}
            aria-invalid={!!errors.check_out_date}
            aria-describedby={errors.check_out_date ? 'check_out_date-error' : undefined}
            className={INPUT_CLASS}
          />
          <p className="mt-1 text-[12px] text-gray-500">Time: {hotelContent.policies.checkOut.time}</p>
          {errors.check_out_date && (
            <p id="check_out_date-error" role="alert" className="mt-2 text-[13px] text-red-600 font-medium px-1">
              {errors.check_out_date.message}
            </p>
          )}
        </div>
      </div>

      {/* Total Guests — stepper (mobile-friendly, no raw number input) */}
      <div role="group" aria-labelledby="guests-label">
        <p id="guests-label" className="text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-3">
          Total Guests{' '}
          <span className="normal-case text-gray-400 font-normal">(max {maxOccupancy})</span>
        </p>
        {/* Hidden input keeps RHF registration + zodResolver validation intact */}
        <input
          type="number"
          {...register('number_of_guests', { valueAsNumber: true })}
          aria-hidden="true"
          tabIndex={-1}
          className="sr-only"
        />
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => setValue('number_of_guests', Math.max(1, numberOfGuests - 1), { shouldValidate: true })}
            disabled={numberOfGuests <= 1}
            className="w-11 h-11 rounded-xl bg-gray-100/80 hover:bg-gray-200 active:scale-95 flex items-center justify-center text-gray-700 text-xl font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Decrease total guests"
          >
            −
          </button>
          <span
            className="text-[22px] font-semibold text-gray-900 min-w-[2ch] text-center tabular-nums"
            aria-live="polite"
            aria-atomic="true"
          >
            {numberOfGuests}
          </span>
          <button
            type="button"
            onClick={() => setValue('number_of_guests', Math.min(maxOccupancy, numberOfGuests + 1), { shouldValidate: true })}
            disabled={numberOfGuests >= maxOccupancy}
            className="w-11 h-11 rounded-xl bg-gray-100/80 hover:bg-gray-200 active:scale-95 flex items-center justify-center text-gray-700 text-xl font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Increase total guests"
          >
            +
          </button>
        </div>
        {errors.number_of_guests && (
          <p id="number_of_guests-error" role="alert" className="mt-2 text-[13px] text-red-600 font-medium">
            {errors.number_of_guests.message}
          </p>
        )}
      </div>

      {/* Adults and Children — steppers */}
      <div className="grid grid-cols-2 gap-6">
        <div role="group" aria-labelledby="adults-label">
          <p id="adults-label" className="text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-3">Adults</p>
          <input
            type="number"
            {...register('number_of_adults', { valueAsNumber: true })}
            aria-hidden="true"
            tabIndex={-1}
            className="sr-only"
          />
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setValue('number_of_adults', Math.max(1, numberOfAdults - 1), { shouldValidate: true })}
              disabled={numberOfAdults <= 1}
              className="w-11 h-11 rounded-xl bg-gray-100/80 hover:bg-gray-200 active:scale-95 flex items-center justify-center text-gray-700 text-xl font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Decrease adults"
            >
              −
            </button>
            <span
              className="text-[22px] font-semibold text-gray-900 min-w-[2ch] text-center tabular-nums"
              aria-live="polite"
              aria-atomic="true"
            >
              {numberOfAdults}
            </span>
            <button
              type="button"
              onClick={() => setValue('number_of_adults', Math.min(maxOccupancy, numberOfAdults + 1), { shouldValidate: true })}
              disabled={numberOfAdults >= maxOccupancy}
              className="w-11 h-11 rounded-xl bg-gray-100/80 hover:bg-gray-200 active:scale-95 flex items-center justify-center text-gray-700 text-xl font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Increase adults"
            >
              +
            </button>
          </div>
          {errors.number_of_adults && (
            <p role="alert" className="mt-2 text-[13px] text-red-600 font-medium">
              {errors.number_of_adults.message}
            </p>
          )}
        </div>

        <div role="group" aria-labelledby="children-label">
          <p id="children-label" className="text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-3">
            Children{' '}
            <span className="normal-case text-gray-400 font-normal">(0–12 yrs, free)</span>
          </p>
          <input
            type="number"
            {...register('number_of_children', { valueAsNumber: true })}
            aria-hidden="true"
            tabIndex={-1}
            className="sr-only"
          />
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setValue('number_of_children', Math.max(0, numberOfChildren - 1), { shouldValidate: true })}
              disabled={numberOfChildren <= 0}
              className="w-11 h-11 rounded-xl bg-gray-100/80 hover:bg-gray-200 active:scale-95 flex items-center justify-center text-gray-700 text-xl font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Decrease children"
            >
              −
            </button>
            <span
              className="text-[22px] font-semibold text-gray-900 min-w-[2ch] text-center tabular-nums"
              aria-live="polite"
              aria-atomic="true"
            >
              {numberOfChildren}
            </span>
            <button
              type="button"
              onClick={() => setValue('number_of_children', Math.min(maxOccupancy, numberOfChildren + 1), { shouldValidate: true })}
              disabled={numberOfChildren >= maxOccupancy}
              className="w-11 h-11 rounded-xl bg-gray-100/80 hover:bg-gray-200 active:scale-95 flex items-center justify-center text-gray-700 text-xl font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Increase children"
            >
              +
            </button>
          </div>
          {errors.number_of_children && (
            <p role="alert" className="mt-2 text-[13px] text-red-600 font-medium">
              {errors.number_of_children.message}
            </p>
          )}
        </div>
      </div>

      {/* Guest Information — floating labels with id/htmlFor connections (WCAG 1.3.1) */}
      <div className="pt-4 border-t border-gray-100/60 space-y-6">
        <div className="relative">
          <input
            id="guest_name"
            type="text"
            {...register('guest_name')}
            onFocus={() => setFocusedField('guest_name')}
            onBlur={() => setFocusedField(null)}
            className={FLOAT_INPUT_CLASS}
            placeholder="Guest Name"
            aria-invalid={!!errors.guest_name}
            aria-describedby={errors.guest_name ? 'guest_name-error' : undefined}
          />
          <label
            htmlFor="guest_name"
            className={`absolute left-4 transition-all duration-300 ease-out pointer-events-none ${
              guestName || focusedField === 'guest_name'
                ? 'top-2 text-[13px] text-[#007aff] font-medium'
                : 'top-4 text-[17px] text-gray-500'
            }`}
          >
            Guest Name
          </label>
          {errors.guest_name && (
            <p id="guest_name-error" role="alert" className="mt-2 text-[13px] text-red-600 font-medium px-1">
              {errors.guest_name.message}
            </p>
          )}
        </div>

        <div className="relative">
          <input
            id="guest_email"
            type="email"
            {...register('guest_email')}
            onFocus={() => setFocusedField('guest_email')}
            onBlur={() => setFocusedField(null)}
            className={FLOAT_INPUT_CLASS}
            placeholder="Email"
            aria-invalid={!!errors.guest_email}
            aria-describedby={errors.guest_email ? 'guest_email-error' : undefined}
          />
          <label
            htmlFor="guest_email"
            className={`absolute left-4 transition-all duration-300 ease-out pointer-events-none ${
              guestEmail || focusedField === 'guest_email'
                ? 'top-2 text-[13px] text-[#007aff] font-medium'
                : 'top-4 text-[17px] text-gray-500'
            }`}
          >
            Email
          </label>
          {errors.guest_email && (
            <p id="guest_email-error" role="alert" className="mt-2 text-[13px] text-red-600 font-medium px-1">
              {errors.guest_email.message}
            </p>
          )}
        </div>

        <div className="relative">
          <input
            id="guest_phone"
            type="tel"
            {...register('guest_phone')}
            onFocus={() => setFocusedField('guest_phone')}
            onBlur={() => setFocusedField(null)}
            className={FLOAT_INPUT_CLASS}
            placeholder="Phone (Optional)"
          />
          <label
            htmlFor="guest_phone"
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
          <label htmlFor="special_requests" className="block text-[13px] text-gray-500 uppercase tracking-wide font-medium mb-2">
            Special Requests{' '}
            <span className="normal-case text-gray-400 font-normal">(Optional)</span>
          </label>
          <textarea
            id="special_requests"
            {...register('special_requests')}
            rows={3}
            onFocus={() => setFocusedField('special_requests')}
            onBlur={() => setFocusedField(null)}
            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/60 rounded-2xl text-[17px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007aff]/30 focus:border-[#007aff]/40 focus:bg-white transition-all duration-300 ease-out resize-none"
            placeholder="Enter any special requests or preferences..."
          />
        </div>
      </div>

      {/* Price breakdown */}
      {pretaxAmount > 0 && (() => {
        const totalAdults = numberOfAdults || numberOfGuests;
        const extraAdults = totalAdults > maxOccupancy ? totalAdults - maxOccupancy : 0;
        const extraAdultsAmount =
          extraAdults > 0 && room.room_type.extra_adult_price
            ? extraAdults * room.room_type.extra_adult_price * nights
            : 0;
        const baseAmount = nights * room.room_type.base_price;
        const totalWithTax = pretaxAmount + taxAmount;

        return (
          <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100/60">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[15px] text-gray-600 font-light">
                  Base price (up to {maxOccupancy} guests)
                </span>
                <span className="text-[15px] font-medium text-gray-900">
                  ₹{room.room_type.base_price.toLocaleString('en-IN')}/night × {nights}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[15px] text-gray-600 font-light" />
                <span className="text-[15px] font-medium text-gray-900">₹{baseAmount.toLocaleString('en-IN')}</span>
              </div>
              {extraAdults > 0 && room.room_type.extra_adult_price && (
                <div className="flex justify-between items-center">
                  <span className="text-[15px] text-gray-600 font-light">
                    Extra adult{extraAdults > 1 ? 's' : ''} ({extraAdults} ×
                    ₹{room.room_type.extra_adult_price.toLocaleString('en-IN')}/night × {nights})
                  </span>
                  <span className="text-[15px] font-medium text-gray-900">
                    ₹{extraAdultsAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
              {numberOfChildren > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-[15px] text-gray-600 font-light">
                    Child{numberOfChildren > 1 ? 'ren' : ''} ({numberOfChildren})
                  </span>
                  <span className="text-[15px] font-medium text-emerald-600">Complimentary</span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-200/60 flex justify-between items-center">
                <span className="text-[15px] text-gray-600 font-light">Pre-tax subtotal</span>
                <span className="text-[15px] font-medium text-gray-900">₹{pretaxAmount.toLocaleString('en-IN')}</span>
              </div>
              {taxRate > 0 ? (
                <div className="flex justify-between items-center">
                  <span className="text-[15px] text-gray-600 font-light">GST ({(taxRate * 100).toFixed(0)}%)</span>
                  <span className="text-[15px] font-medium text-gray-900">₹{taxAmount.toLocaleString('en-IN')}</span>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="text-[15px] text-gray-600 font-light">GST (0%)</span>
                  <span className="text-[15px] font-medium text-emerald-600">Nil</span>
                </div>
              )}
              <div className="pt-3 border-t border-gray-200/60 flex justify-between items-center">
                <span className="text-[17px] font-semibold text-gray-900">Total</span>
                <span className="text-[28px] font-semibold text-gray-900 tracking-tight">
                  ₹{totalWithTax.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Policies */}
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

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-4 bg-gray-900 text-white text-[17px] font-semibold rounded-2xl hover:bg-gray-800 active:scale-[0.98] transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-lg shadow-black/10"
      >
        {loading ? (
          <span className="flex items-center justify-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Processing...</span>
          </span>
        ) : (
          'Confirm Booking'
        )}
      </button>
    </form>

    {/* PR-04: price-changed confirmation dialog */}
    {priceChangedDialog && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-6">
        <div className="bg-white rounded-[28px] shadow-2xl max-w-sm w-full p-8 space-y-6">
          <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 flex items-center justify-center">
            <svg className="w-7 h-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-center">
            <h3 className="text-[20px] font-semibold text-gray-900 mb-2">Price Updated</h3>
            <p className="text-[15px] text-gray-600 font-light">
              The price has changed from{' '}
              <span className="line-through text-gray-400">
                ₹{priceChangedDialog.oldPrice.toLocaleString('en-IN')}
              </span>
              {' '}to{' '}
              <span className="font-semibold text-gray-900">
                ₹{priceChangedDialog.newPrice.toLocaleString('en-IN')}
              </span>.
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={confirmAtNewPrice}
              className="w-full px-6 py-3.5 bg-gray-900 text-white text-[15px] font-semibold rounded-2xl hover:bg-gray-800 transition-colors"
            >
              Book at ₹{priceChangedDialog.newPrice.toLocaleString('en-IN')}
            </button>
            <button
              onClick={() => setPriceChangedDialog(null)}
              className="w-full px-6 py-3.5 bg-gray-100 text-gray-700 text-[15px] font-medium rounded-2xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
