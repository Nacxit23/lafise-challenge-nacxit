import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authenticate, getUserById } from "@/features/auth/services/auth.service";
import type { Auth, User } from "@/features/auth/types/auth.type";

import { getExpiresAt } from "@/helpers/expireDate";

/** Datos que se conservan mientras la sesión del usuario está activa. */
interface AuthSession {
  token: string;
  expiresAt: number;
  user: User;
}

interface AuthState {
  session: AuthSession | null;
  hydrated: boolean;
  signIn: (credentials: Auth) => Promise<void>;
  loadUser: (userId: number) => Promise<void>;
  setSession: (session: AuthSession) => void;
  clearAuth: () => void;
  setHydrated: (hydrated: boolean) => void;
}

/**
 * Store global de autenticación.
 *
 * Persiste la sesión para conservarla al recargar la aplicación y centraliza
 * el flujo de inicio de sesión. Los componentes solo llaman signIn y leen
 * session; no necesitan ejecutar las peticiones de autenticación directamente.
 */
const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      hydrated: false,
      /** Login + consulta del perfil + guardado de la sesión completa. */
      signIn: async (credentials) => {
        const response = await authenticate(credentials);

        set({
          session: {
            token: response.token,
            expiresAt: getExpiresAt(response.expiresIn),
            user: response.user,
          },
        });
      },
      /** Recupera el perfil cuando una sesión persistida solo conserva el id. */
      loadUser: async (userId) => {
        const user = await getUserById(userId);

        set((state) => (state.session ? { session: { ...state.session, user } } : state));
      },
      /** Permite establecer una sesión cuando ya se tienen todos sus datos. */
      setSession: (session) => set({ session }),
      /** Elimina la sesión y devuelve la aplicación al estado de login. */
      clearAuth: () => set({ session: null }),
      /** Indica que Zustand terminó de recuperar la sesión persistida. */
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: "lafise-auth-session",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);

        if (state?.session && !state.session.user.fullName) {
          void state.loadUser(state.session.user.id);
        }
      },
    },
  ),
);

export default useAuthStore;
export type { AuthSession };
