import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthSession {
  token: string;
  expiresAt: number;
  user: {
    id: number;
  };
}

interface AuthState {
  session: AuthSession | null;
  hydrated: boolean;
  setSession: (session: AuthSession) => void;
  clearAuth: () => void;
  setHydrated: (hydrated: boolean) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      hydrated: false,
      setSession: (session) => set({ session }),
      clearAuth: () => set({ session: null }),
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: "lafise-auth-session",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

export default useAuthStore;
export type { AuthSession };
