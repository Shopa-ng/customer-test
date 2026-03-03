import { create } from 'zustand';
import {
  loginUser,
  registerUser,
  refreshTokenApi,
  logoutUser,
  AuthResponse,
  RegisterRequest,
} from '../api/auth.api';
import {
  storeRefreshToken,
  getRefreshToken,
  clearAllSecureStorage,
} from '../utils/secure-storage';

// ─── Types ───

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: 'STUDENT' | 'VENDOR' | 'ADMIN';
  isVerified: boolean;
  isEmailVerified: boolean;
  verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  campusId: string | null;
}

interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;

  // Actions
  login: (email: string, pin: string) => Promise<void>;
  signup: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<string | null>;
  initializeAuth: () => Promise<void>;
  clearError: () => void;
}

// ─── Helper ───
function handleAuthSuccess(
  set: (partial: Partial<AuthState>) => void,
  response: AuthResponse,
) {
  set({
    user: response.user,
    accessToken: response.accessToken,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  });
  storeRefreshToken(response.refreshToken);
}

// ─── Store ───

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  isInitializing: true,
  error: null,

  login: async (email: string, pin: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await loginUser({ email, password: pin });
      handleAuthSuccess(set, response);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Login failed. Please try again.';
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  signup: async (data: RegisterRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await registerUser(data);
      handleAuthSuccess(set, response);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Registration failed. Please try again.';
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  logout: async () => {
    try {
      const refreshTkn = await getRefreshToken();
      if (refreshTkn) {
        await logoutUser(refreshTkn).catch(() => {});
      }
    } finally {
      await clearAllSecureStorage();
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  refreshSession: async () => {
    try {
      const storedToken = await getRefreshToken();
      if (!storedToken) return null;

      const response = await refreshTokenApi(storedToken);
      set({
        user: response.user,
        accessToken: response.accessToken,
        isAuthenticated: true,
      });
      await storeRefreshToken(response.refreshToken);
      return response.accessToken;
    } catch {
      await clearAllSecureStorage();
      set({ user: null, accessToken: null, isAuthenticated: false });
      return null;
    }
  },

  initializeAuth: async () => {
    set({ isInitializing: true });
    try {
      const storedToken = await getRefreshToken();
      if (storedToken) {
        const response = await refreshTokenApi(storedToken);
        handleAuthSuccess(set, response);
      }
    } catch {
      await clearAllSecureStorage();
    } finally {
      set({ isInitializing: false });
    }
  },

  clearError: () => set({ error: null }),
}));
