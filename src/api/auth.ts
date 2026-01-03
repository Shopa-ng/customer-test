import { request } from './http';
import { API_BASE_URL } from '../config/env';

export interface LoginRequest {
  email: string;
  pin: string;
}

export interface LoginResponse {
  token: string;
  userId?: string;
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  if (!API_BASE_URL) {
    await new Promise((r) => setTimeout(r, 800));
    if (data.pin === '1234') {
      return { token: 'mock-token' };
    }
    throw new Error('Incorrect Email or PIN!');
  }
  return request<LoginResponse, LoginRequest>({ method: 'POST', path: '/auth/login', body: data });
}

export interface SignUpRequest {
  fullName: string;
  phoneNumber: string;
  email: string;
  pin: string;
  university: string;
}

export interface SignUpResponse {
  userId: string;
}

export async function signUp(data: SignUpRequest): Promise<SignUpResponse> {
  if (!API_BASE_URL) {
    await new Promise((r) => setTimeout(r, 800));
    return { userId: 'mock-user' };
  }
  return request<SignUpResponse, SignUpRequest>({
    method: 'POST',
    path: '/auth/signup',
    body: data,
  });
}
