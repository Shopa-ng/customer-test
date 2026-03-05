import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Lazy accessor to avoid require cycle: auth.api → client → auth.store → auth.api
const getAuthStore = () => require('../store/auth.store').useAuthStore;

// ─── Base Configuration ───
// All endpoints are prefixed with /api/v1 on the backend (set in main.ts)
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'https://shopa-backend.onrender.com/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30s — accounts for Render cold starts + Nigerian network conditions
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ───
// Automatically attaches the access token to every outgoing request.
// You never have to manually add Authorization headers in your API calls.
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthStore().getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor (Token Refresh) ───
// When the backend returns 401 (token expired), this interceptor:
// 1. Pauses the failed request
// 2. Calls /auth/refresh to get a new access token
// 3. Retries the original request with the new token
// 4. If refresh also fails → logs user out
//
// The "isRefreshing" flag prevents multiple simultaneous refresh calls
// when several requests fail at once. The queue holds pending requests
// until the refresh completes, then retries them all.

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  // Success — just pass through
  (response) => response,

  // Error handler
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Only attempt refresh on 401 errors that haven't already been retried
    // and aren't the refresh endpoint itself (prevents infinite loop)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/login')
    ) {
      // If we're already refreshing, queue this request
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const store = getAuthStore().getState();
        const newToken = await store.refreshSession();

        if (newToken) {
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        } else {
          // Refresh failed — log out
          processQueue(new Error('Session expired'));
          getAuthStore().getState().logout();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError as Error);
        getAuthStore().getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
