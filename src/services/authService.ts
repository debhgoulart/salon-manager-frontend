import apiClient from './api';
import type { LoginRequest, AuthResponse, RefreshTokenRequest } from 'src/types/auth';

export const authService = {
  async login(payload: LoginRequest): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/api/auth/login', payload);
    return data;
  },

  async refreshToken(payload: RefreshTokenRequest): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/api/auth/refresh', payload);
    return data;
  },
};

export default authService;
