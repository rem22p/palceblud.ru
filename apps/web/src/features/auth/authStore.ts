import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  username: string | null;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  setUser: (user: User | null) => void;
  logout: () => void;

  /** Fetch current user from API */
  fetchUser: () => Promise<void>;
}

const API_BASE = "http://localhost:8000";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) =>
    set({ user, isAuthenticated: !!user, isLoading: false }),

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  fetchUser: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/session`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.user) {
          set({
            user: {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              image: data.user.image ?? null,
              username: data.user.username ?? null,
            },
            isAuthenticated: true,
            isLoading: false,
          });
          return;
        }
      }
    } catch {
      // API not available
    }
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
}));

/** Get OAuth sign-in URL */
export function getOAuthUrl(provider: "github" | "google"): string {
  return `${API_BASE}/api/auth/sign-in/${provider}`;
}
