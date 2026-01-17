import { create } from 'zustand';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null, isAuthenticated: false });
  },
}));

interface SidebarState {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set, get) => ({
  isCollapsed: false, // Default value, will be updated on client
  toggleSidebar: () => {
    const newState = !get().isCollapsed;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
    }
    set({ isCollapsed: newState });
  },
  setSidebarCollapsed: (collapsed: boolean) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed));
    }
    set({ isCollapsed: collapsed });
  },
}));
