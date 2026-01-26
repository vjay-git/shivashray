export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  is_active: boolean;
  role: 'guest' | 'admin';
  created_at: string;
}

export interface RoomType {
  id: number;
  name: string;
  description?: string;
  max_occupancy: number;
  base_price: number;
  extra_adult_price?: number;
  child_price?: number;
  created_at: string;
}

export interface RoomAmenity {
  id: number;
  name: string;
  icon?: string;
}

export interface Room {
  id: number;
  room_number: string;
  room_type_id: number;
  floor?: number;
  description?: string;
  image_urls?: string[];
  is_active: boolean;
  room_type: RoomType;
  amenities: RoomAmenity[];
  created_at: string;
}

export interface Booking {
  id: number;
  user_id?: number;
  room_id: number;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  number_of_adults?: number;
  number_of_children?: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded';
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  special_requests?: string;
  created_at: string;
  updated_at?: string;
}

export interface Service {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export type PlaceCategory = 'sacred-temples' | 'nature-scenic' | 'cultural-landmarks' | 'short-excursions';

export interface Place {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: PlaceCategory;
  distance?: string;
  travelHint?: string;
  imageUrl?: string;
  content: {
    introduction: string;
    context?: string;
    culturalContext?: string;
    spiritualContext?: string;
    howToReach?: string;
  };
}

