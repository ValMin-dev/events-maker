import { create } from "zustand";
import type {
  AuthLoginRequest,
  AuthRegisterRequest,
  UserPublic,
} from "../shared/api/types";
import { getAuthToken, setAuthToken } from "../shared/api/auth-token";
import { authApi } from "../shared/api/auth-api";
import { getApiErrorMessage } from "../lib/utils";

type AuthState = {
  user: null | UserPublic;
  token: string | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  authError: null | string;

  isAuth: () => Promise<void>;
  login: (payload: AuthLoginRequest) => Promise<void>;
  logout: () => void;
  register: (payload: AuthRegisterRequest) => Promise<void>;
  clearOfError: () => void;
  fetchMe: () => Promise<void>;
};

function profileToUser(profile: UserPublic): UserPublic {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
  };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isAuthLoading: false,
  authError: null,

  isAuth: async () => {
    if (get().isAuthenticated) return;

    set({ isAuthLoading: true, authError: null });
    try {
      if (!getAuthToken()) {
        set({ user: null, isAuthLoading: false, isAuthenticated: false });
        return;
      }
      const profile = await authApi.me();
      set({
        user: profileToUser(profile),
        isAuthenticated: true,
        isAuthLoading: false,
      });
    } catch (error) {
      setAuthToken("");
      set({
        user: null,
        isAuthLoading: false,
        isAuthenticated: false,
        authError: "Failed to authenticate user",
      });
    } finally {
      set({ isAuthLoading: false });
    }
  },

  login: async (payload: AuthLoginRequest) => {
    set({ isAuthLoading: true, authError: null });
    try {
      const { user, token } = await authApi.login(payload);
      set({
        user: user,
        isAuthenticated: true,
        isAuthLoading: false,
      });
      setAuthToken(token);
    } catch (error) {
      set({
        authError:
          getApiErrorMessage(error) || "Login failed. Please try again.",
      });
    } finally {
      set({ isAuthLoading: false });
    }
  },

  logout: () => {
    set({ user: null, token: null, isAuthenticated: false, authError: null });
    setAuthToken("");
  },

  register: async (payload: AuthRegisterRequest) => {
    set({ isAuthLoading: true, authError: null });
    try {
      const { user, token } = await authApi.register(payload);
      set({
        user: user,
        isAuthLoading: false,
      });
      setAuthToken(token);
    } catch (error) {
      set({
        authError:
          getApiErrorMessage(error) || "Registration failed. Please try again.",
      });
    } finally {
      set({ isAuthLoading: false });
    }
  },

  fetchMe: async () => {
    if (!getAuthToken()) {
      set({ user: null });
      return;
    }
    try {
      const userProfile = await authApi.me();
      set({ user: profileToUser(userProfile) });
    } catch (error) {
      set({ user: null });
      setAuthToken("");
      throw error;
    }
  },
  clearOfError: () => {
    set({ authError: null });
  },
}));
