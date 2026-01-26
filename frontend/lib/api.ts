import axios from 'axios';
import { Room, RoomType, Service, Booking, User } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
// Use mock API if explicitly set to true, or if no API URL is provided (for static deployment)
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' || 
                     (process.env.NEXT_PUBLIC_USE_MOCK_API !== 'false' && !process.env.NEXT_PUBLIC_API_URL);

// Log mock mode status in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && USE_MOCK_API) {
  console.log('🔧 Mock API Mode is ACTIVE - Using mock data instead of real API calls');
  console.log('💡 To disable mock mode, set NEXT_PUBLIC_USE_MOCK_API=false and NEXT_PUBLIC_API_URL to your API URL');
}

// Mock data - Updated with correct room types and pricing
const mockRoomTypes: RoomType[] = [
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

const mockRooms: Room[] = [
  {
    id: 1,
    room_number: '101',
    room_type_id: 1,
    floor: 1,
    description: 'Beautiful deluxe room with premium amenities',
    image_urls: [],
    is_active: true,
    room_type: mockRoomTypes[0],
    amenities: [],
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    room_number: '102',
    room_type_id: 1,
    floor: 1,
    description: 'Spacious deluxe room with modern comforts',
    image_urls: [],
    is_active: true,
    room_type: mockRoomTypes[0],
    amenities: [],
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    room_number: '201',
    room_type_id: 2,
    floor: 2,
    description: 'Luxurious super deluxe room with separate living area',
    image_urls: [],
    is_active: true,
    room_type: mockRoomTypes[1],
    amenities: [],
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    room_number: '202',
    room_type_id: 2,
    floor: 2,
    description: 'Elegant super deluxe room with premium amenities',
    image_urls: [],
    is_active: true,
    room_type: mockRoomTypes[1],
    amenities: [],
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    room_number: '301',
    room_type_id: 3,
    floor: 3,
    description: 'Spacious family room ideal for families',
    image_urls: [],
    is_active: true,
    room_type: mockRoomTypes[2],
    amenities: [],
    created_at: new Date().toISOString(),
  },
  {
    id: 6,
    room_number: '302',
    room_type_id: 3,
    floor: 3,
    description: 'Comfortable family room with quad occupancy',
    image_urls: [],
    is_active: true,
    room_type: mockRoomTypes[2],
    amenities: [],
    created_at: new Date().toISOString(),
  },
];

const mockServices: Service[] = [
  {
    id: 1,
    name: 'Free WiFi',
    description: 'High-speed internet access throughout the hotel',
    icon: '📶',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Room Service',
    description: '24/7 room service available',
    icon: '🍽️',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Laundry',
    description: 'Professional laundry and dry cleaning services',
    icon: '👔',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'Parking',
    description: 'Secure parking facilities available',
    icon: '🚗',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: 'Airport Shuttle',
    description: 'Complimentary airport transfer',
    icon: '✈️',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 6,
    name: 'Fitness Center',
    description: 'Well-equipped fitness center',
    icon: '💪',
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

const mockBookings: Booking[] = [];

const mockUser: User = {
  id: 1,
  email: 'demo@example.com',
  full_name: 'Demo User',
  phone: '+91 9876543210',
  is_active: true,
  role: 'guest',
  created_at: new Date().toISOString(),
};

// Mock API handler
const handleMockRequest = (method: string, url: string, data?: any, params?: any) => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      let response: any;

      // Auth endpoints
      if (url.includes('/auth/login')) {
        response = {
          access_token: 'mock_access_token',
          refresh_token: 'mock_refresh_token',
          token_type: 'bearer',
        };
      } else if (url.includes('/auth/register')) {
        response = { message: 'User registered successfully' };
      } else if (url.includes('/auth/me')) {
        response = mockUser;
      } else if (url.includes('/auth/refresh')) {
        response = {
          access_token: 'mock_access_token_new',
          refresh_token: 'mock_refresh_token_new',
        };
      }
      // Rooms endpoints
      else if (url.includes('/rooms/types')) {
        response = mockRoomTypes;
      } else if (url.includes('/rooms/') && url.match(/\/rooms\/(\d+)\/availability/)) {
        response = { available: true };
      } else if (url.includes('/rooms/') && url.match(/\/rooms\/(\d+)$/)) {
        const roomId = parseInt(url.match(/\/rooms\/(\d+)$/)?.[1] || '1');
        const room = mockRooms.find((r) => r.id === roomId) || mockRooms[0];
        response = room;
      } else if (url.includes('/rooms')) {
        response = mockRooms;
      }
      // Services endpoints
      else if (url.includes('/services')) {
        response = mockServices;
      }
      // Bookings endpoints
      else if (method === 'POST' && url.includes('/bookings')) {
        const newBooking: Booking = {
          id: mockBookings.length + 1,
          user_id: 1,
          room_id: data.room_id || 1,
          check_in_date: data.check_in_date,
          check_out_date: data.check_out_date,
          number_of_guests: data.number_of_guests || 2,
          total_amount: data.total_amount || 5000,
          status: 'pending',
          payment_status: 'pending',
          guest_name: data.guest_name || 'Guest',
          guest_email: data.guest_email || 'guest@example.com',
          guest_phone: data.guest_phone,
          special_requests: data.special_requests,
          created_at: new Date().toISOString(),
        };
        mockBookings.push(newBooking);
        response = newBooking;
      } else if (url.includes('/bookings/') && url.match(/\/bookings\/(\d+)$/)) {
        const bookingId = parseInt(url.match(/\/bookings\/(\d+)$/)?.[1] || '1');
        const booking = mockBookings.find((b) => b.id === bookingId);
        response = booking || mockBookings[0] || null;
      } else if (url.includes('/bookings')) {
        response = mockBookings;
      } else if (method === 'DELETE' && url.includes('/bookings/')) {
        const bookingId = parseInt(url.match(/\/bookings\/(\d+)$/)?.[1] || '0');
        const index = mockBookings.findIndex((b) => b.id === bookingId);
        if (index > -1) {
          mockBookings.splice(index, 1);
        }
        response = { message: 'Booking cancelled successfully' };
      } else if (method === 'PATCH' && url.includes('/bookings/')) {
        const bookingId = parseInt(url.match(/\/bookings\/(\d+)$/)?.[1] || '0');
        const booking = mockBookings.find((b) => b.id === bookingId);
        if (booking) {
          Object.assign(booking, data);
          booking.updated_at = new Date().toISOString();
        }
        response = booking;
      }
      // Admin endpoints
      else if (url.includes('/admin/bookings')) {
        response = mockBookings;
      }
      // Default
      else {
        response = { message: 'Mock API response' };
      }

      resolve({ data: response, status: 200, statusText: 'OK', headers: {}, config: {} as any });
    }, 300); // 300ms delay to simulate network
  });
};

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests for mock mode
api.interceptors.request.use(async (config) => {
  if (USE_MOCK_API) {
    // Handle mock requests by creating a custom adapter
    const method = config.method?.toUpperCase() || 'GET';
    const url = config.url || '';
    const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
    
    const mockResponse = await handleMockRequest(method, fullUrl, config.data, config.params);
    // Create a custom error that will be caught by response interceptor
    const mockError = new Error('Mock API Request');
    (mockError as any).isMock = true;
    (mockError as any).response = mockResponse;
    throw mockError;
  }

  // Add token to requests if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle responses and mock mode
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle mock responses
    if (error.isMock && error.response) {
      return Promise.resolve(error.response);
    }

    // Handle token refresh on 401
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });
          const { access_token, refresh_token } = response.data;
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

