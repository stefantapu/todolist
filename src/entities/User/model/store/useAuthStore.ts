import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  username: string | null;
  setAuth: (accessToken: string, username: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(set => ({
    accessToken: null,
    username: null,
    setAuth: (accessToken, username) => set({ accessToken, username }),
    clearAuth: () => set({ accessToken: null, username: null }),
  }))
);
