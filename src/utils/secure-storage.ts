import * as SecureStore from 'expo-secure-store';

// ─── Secure Storage Keys ───
// These are the ONLY things we store on disk. Access tokens stay in memory only.
const KEYS = {
  REFRESH_TOKEN: 'shopa_refresh_token',
  BIOMETRIC_TOKEN: 'shopa_biometric_token',
  DEVICE_ID: 'shopa_device_id',
} as const;

// ─── Refresh Token ───
export async function storeRefreshToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, token);
}

export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
}

export async function removeRefreshToken(): Promise<void> {
  await SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN);
}

// ─── Biometric Token ───
export async function storeBiometricToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(KEYS.BIOMETRIC_TOKEN, token);
}

export async function getBiometricToken(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.BIOMETRIC_TOKEN);
}

export async function removeBiometricToken(): Promise<void> {
  await SecureStore.deleteItemAsync(KEYS.BIOMETRIC_TOKEN);
}

// ─── Device ID ───
// A stable device identifier used for biometric auth binding.
// Generated once, persists across app sessions.
export async function getOrCreateDeviceId(): Promise<string> {
  let deviceId = await SecureStore.getItemAsync(KEYS.DEVICE_ID);
  if (!deviceId) {
    deviceId =
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    await SecureStore.setItemAsync(KEYS.DEVICE_ID, deviceId);
  }
  return deviceId;
}

// ─── Clear All ───
export async function clearAllSecureStorage(): Promise<void> {
  await Promise.all([
    removeRefreshToken(),
    removeBiometricToken(),
  ]);
}
