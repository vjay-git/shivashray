export const DEFAULT_BOOKING_ENGINE_URL =
  "https://bookingengine.stayflexi.com/?hotel_id=33297";

/**
 * Central place to configure the external booking engine.
 * Override in deployments with NEXT_PUBLIC_BOOKING_ENGINE_URL.
 */
export function getBookingEngineUrl(): string {
  return (process.env.NEXT_PUBLIC_BOOKING_ENGINE_URL || DEFAULT_BOOKING_ENGINE_URL).trim();
}


