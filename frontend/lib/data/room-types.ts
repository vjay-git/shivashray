/**
 * Hardcoded Room Types Data
 * This ensures the frontend displays correct information even before backend is updated
 */

import { RoomType } from '@/types';

export const hardcodedRoomTypes: RoomType[] = [
  {
    id: 1,
    name: 'Deluxe Room',
    description: 'Spacious deluxe room with premium amenities, perfect for couples or small families',
    max_occupancy: 2,
    base_price: 4000,
    extra_adult_price: 1500,
    child_price: 1200,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Super Deluxe Room',
    description: 'Luxurious super deluxe room with separate living area and premium amenities',
    max_occupancy: 2,
    base_price: 6000,
    extra_adult_price: 2100,
    child_price: 1500,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Family Room',
    description: 'Spacious family room ideal for families, with quad occupancy and family-friendly amenities',
    max_occupancy: 4,
    base_price: 6500,
    extra_adult_price: 2275,
    child_price: 1625,
    created_at: new Date().toISOString(),
  },
];

/**
 * Get room type by name
 */
export const getRoomTypeByName = (name: string): RoomType | undefined => {
  return hardcodedRoomTypes.find(
    (rt) => rt.name.toLowerCase() === name.toLowerCase()
  );
};

/**
 * Get room type by ID
 */
export const getRoomTypeById = (id: number): RoomType | undefined => {
  return hardcodedRoomTypes.find((rt) => rt.id === id);
};
