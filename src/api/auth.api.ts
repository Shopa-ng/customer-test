import apiClient from './client';

// ─── Types ───
// These match the backend DTOs exactly (from auth.dto.ts and auth.service.ts)

export interface RegisterRequest {
  email: string;
  password: string; // The 4-digit PIN is sent as the password
  firstName: string;
  lastName: string;
  phone?: string;
  campusId?: string;
}

export interface LoginRequest {
  email: string;
  password: string; // 4-digit PIN
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
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
    createdAt: string;
  };
}

export interface EnableBiometricRequest {
  deviceId: string;
  platform: string; // 'ios' or 'android'
}

export interface BiometricLoginRequest {
  biometricToken: string;
  deviceId: string;
}

// ─── API Calls ───

// Fire-and-forget ping to wake up the Render cold-start before login is attempted
export async function pingServer(): Promise<void> {
  try {
    await apiClient.get('/health', { timeout: 60000 });
  } catch {
    // Ignore — this is best-effort only
  }
}

export async function registerUser(data: RegisterRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/register', data);
  return response.data;
}

export async function loginUser(data: LoginRequest, timeout?: number): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/login', data, timeout ? { timeout } : undefined);
  return response.data;
}

export async function refreshTokenApi(token: string): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/refresh', {
    refreshToken: token,
  });
  return response.data;
}

export async function logoutUser(token: string): Promise<void> {
  await apiClient.post('/auth/logout', { refreshToken: token });
}

export async function logoutAllSessions(): Promise<void> {
  await apiClient.post('/auth/logout-all');
}

export async function enableBiometric(
  data: EnableBiometricRequest,
): Promise<{ biometricToken: string }> {
  const response = await apiClient.post<{ biometricToken: string }>(
    '/auth/biometric/enable',
    data,
  );
  return response.data;
}

export async function biometricLogin(
  data: BiometricLoginRequest,
): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/biometric/login', data);
  return response.data;
}

export async function disableBiometric(): Promise<void> {
  await apiClient.post('/auth/biometric/disable');
}
