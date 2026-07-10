import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "@/services/authService";

// Nota: como el back autentica por cookie httpOnly, acá NO guardamos ningún
// token. Solo persistimos los datos del usuario (para no mostrar un flash de
// "sin sesión" al recargar), y al montar la app se revalida con /api/auth/me.
export const useAuthStore = create()(
  persist(
    (set, get) => ({
      user: null,
      isAuthChecked: false,

      isAdmin: () => !!get().user?.roles.includes("Admin"),
      isPremium: () => !!get().user?.roles.includes("UserPremium"),
      isFree: () => !!get().user?.roles.includes("UserGratis"),

      setUser: (user) => set({ user }),

      checkSession: async () => {
        try {
          const user = await authService.me();
          set({ user, isAuthChecked: true });
        } catch {
          set({ user: null, isAuthChecked: true });
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } finally {
          set({ user: null });
        }
      },
    }),
    {
      name: "cursos-auth",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
