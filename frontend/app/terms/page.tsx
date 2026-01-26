'use client';

import { useEffect, useState } from 'react';
import { hotelContent } from '@/lib/content/hotel-content';
import Link from 'next/link';

export default function TermsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        {/* Header */}
        <div
          className={`mb-12 transition-all duration-1000 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 className="text-[48px] md:text-[56px] font-semibold text-gray-900 mb-4 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-[18px] text-gray-600 font-light">
            Please read these terms and conditions carefully before making a reservation at {hotelContent.name}.
          </p>
        </div>

        {/* Content */}
        <div
          className={`bg-white rounded-[24px] p-8 md:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-1000 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          {/* Check-in and Check-out */}
          <section className="mb-10">
            <h2 className="text-[28px] font-semibold text-gray-900 mb-4 tracking-tight">
              Check-in and Check-out Timings
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                <strong className="text-gray-900">Check-in Time:</strong> {hotelContent.policies.checkIn.time} (12:00 PM)
              </p>
              <p>
                <strong className="text-gray-900">Check-out Time:</strong> {hotelContent.policies.checkOut.time} (11:00 AM)
              </p>
              <p className="text-gray-600">
                Please ensure you complete the check-in process by showing valid ID proof. Checkout must be done on or before the checkout time.
              </p>
            </div>
          </section>

          {/* Terms and Conditions */}
          <section className="mb-10">
            <h2 className="text-[28px] font-semibold text-gray-900 mb-4 tracking-tight">
              Hotel Policies and Terms
            </h2>
            <ul className="space-y-3 text-gray-700 leading-relaxed">
              {hotelContent.policies.termsAndConditions.map((term, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-gray-400 mr-3 mt-1">•</span>
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* ID Proof Requirement */}
          <section className="mb-10">
            <h2 className="text-[28px] font-semibold text-gray-900 mb-4 tracking-tight">
              Identification Requirements
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                To check-in, every guest must show valid ID proof. Acceptable forms of identification include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Government-issued photo ID (Aadhaar, Passport, Driving License, Voter ID)</li>
                <li>Valid international passport for foreign guests</li>
              </ul>
              <p className="text-red-600 font-medium mt-4">
                <strong>Note:</strong> Local ID is not accepted for check-in.
              </p>
            </div>
          </section>

          {/* Cancellation Policy */}
          <section className="mb-10">
            <h2 className="text-[28px] font-semibold text-gray-900 mb-4 tracking-tight">
              Cancellation Policy
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                <strong className="text-gray-900">Policy:</strong> {hotelContent.policies.cancellation.policy}
              </p>
              <p>
                {hotelContent.policies.cancellation.description}
              </p>
              <p className="text-gray-600 mt-4">
                Cancellations made less than 3 days before the check-in date may be subject to charges as per the booking terms.
              </p>
            </div>
          </section>

          {/* Child Policy */}
          <section className="mb-10">
            <h2 className="text-[28px] font-semibold text-gray-900 mb-4 tracking-tight">
              Child Policy
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p className="font-medium text-gray-900">{hotelContent.policies.childPolicy.description}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                {hotelContent.policies.childPolicy.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* Meal Plan */}
          <section className="mb-10">
            <h2 className="text-[28px] font-semibold text-gray-900 mb-4 tracking-tight">
              Meal Plan
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                <strong className="text-gray-900">Meal Plan:</strong> {hotelContent.property.mealPlan} (European Plan - Room only, no meals included)
              </p>
              <p className="text-gray-600">
                Meals are not included in the room rate. Guests can avail dining services at nearby restaurants or order room service as per availability.
              </p>
            </div>
          </section>

          {/* Property Information */}
          <section className="mb-10">
            <h2 className="text-[28px] font-semibold text-gray-900 mb-4 tracking-tight">
              Property Information
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                <strong className="text-gray-900">Total Rooms:</strong> {hotelContent.property.totalRooms} Rooms
              </p>
              <p>
                <strong className="text-gray-900">Total Floors:</strong> {hotelContent.property.totalFloors} Floors
              </p>
              <p>
                <strong className="text-gray-900">Built Year:</strong> {hotelContent.property.builtYear}
              </p>
              <p>
                <strong className="text-gray-900">Renovation Year:</strong> {hotelContent.property.renovationYear}
              </p>
              <p>
                <strong className="text-gray-900">GSTIN:</strong> {hotelContent.property.gstin}
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-10">
            <h2 className="text-[28px] font-semibold text-gray-900 mb-4 tracking-tight">
              Contact Us
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                <strong className="text-gray-900">Property Name:</strong> {hotelContent.name}
              </p>
              <p>
                <strong className="text-gray-900">Address:</strong> {hotelContent.location.address}
              </p>
              <p>
                <strong className="text-gray-900">Contact Person:</strong> {hotelContent.contact.contactPerson}
              </p>
              <p>
                <strong className="text-gray-900">Phone:</strong>{' '}
                <a href={`tel:${hotelContent.contact.phone.replace(/\s/g, '')}`} className="text-[#007aff] hover:underline">
                  {hotelContent.contact.phone}
                </a>
              </p>
              <p>
                <strong className="text-gray-900">Email:</strong>{' '}
                <a href={`mailto:${hotelContent.contact.email}`} className="text-[#007aff] hover:underline">
                  {hotelContent.contact.email}
                </a>
              </p>
              <p>
                <strong className="text-gray-900">Website:</strong>{' '}
                <a href={hotelContent.contact.website} target="_blank" rel="noopener noreferrer" className="text-[#007aff] hover:underline">
                  {hotelContent.contact.website}
                </a>
              </p>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 leading-relaxed">
              By making a reservation at {hotelContent.name}, you acknowledge that you have read, understood, and agree to abide by these terms and conditions. The hotel reserves the right to refuse service to anyone who violates these policies.
            </p>
          </section>

          {/* Back Link */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/"
              className="inline-flex items-center text-[#007aff] hover:text-[#0051d5] transition-colors font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
