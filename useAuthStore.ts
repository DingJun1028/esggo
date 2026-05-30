import { create } from 'zustand';
import { User, getAuth, signOut as firebaseSignOut } from 'firebase/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  error: null,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isInitialized: true,
      error: null,
    }),

  setError: (error) => set({ error }),

  logout: async () => {
    try {
      const auth = getAuth();
      await firebaseSignOut(auth);
      set({ user: null, isAuthenticated: false, error: null });
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : 'An unknown error occurred' });
    }
  },
}));
