import { create } from 'zustand';

// Define the shape of the user profile
interface UserProfile {
  name: string;
  role: string;
  organization: string;
}

// Define the shape of the store's state
interface AppState {
  theme: 'dark' | 'light';
  userProfile: UserProfile | null; // User can be logged out
  login: (profile: UserProfile) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>(set => ({
  theme: 'dark', // Default theme
  userProfile: null, // No user is logged in by default

  // Action to log in a user
  login: profile => set({ userProfile: profile }),

  // Action to log out a user
  logout: () => set({ userProfile: null }),
}));
