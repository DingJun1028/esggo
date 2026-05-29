'use client';

import { create } from 'zustand';
import { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  error: string | null;
  isLoading: boolean;
  companyId: string | null;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  setCompanyId: (companyId: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  error: null,
  isLoading: false,
  companyId: null,
  setUser: (user) => set({ user, isLoading: false }),
  setError: (error) => set({ error }),
  setCompanyId: (companyId) => set({ companyId }),
}));