import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { UserSession, AuthResponse, LoginRequest, Role } from 'src/types/auth';
import axios from 'axios';

const TOKEN_KEY = 'salon_access_token';
const REFRESH_TOKEN_KEY = 'salon_refresh_token';
const USER_KEY = 'salon_user_session';

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(localStorage.getItem(TOKEN_KEY));
  const refreshToken = ref<string | null>(localStorage.getItem(REFRESH_TOKEN_KEY));
  const user = ref<UserSession | null>(
    localStorage.getItem(USER_KEY) ? JSON.parse(localStorage.getItem(USER_KEY)!) : null
  );

  const isAuthenticated = computed(() => !!accessToken.value);
  const userRole = computed(() => user.value?.role);

  function setSession(data: AuthResponse) {
    accessToken.value = data.accessToken;
    refreshToken.value = data.refreshToken;
    user.value = data.user;

    localStorage.setItem(TOKEN_KEY, data.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }

  function setTokens(newAccessToken: string, newRefreshToken: string) {
    accessToken.value = newAccessToken;
    refreshToken.value = newRefreshToken;

    localStorage.setItem(TOKEN_KEY, newAccessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
  }

  async function login(credentials: LoginRequest): Promise<AuthResponse> {
    const baseURL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8080';
    const response = await axios.post<AuthResponse>(`${baseURL}/api/auth/login`, credentials, {
      headers: { 'Content-Type': 'application/json' },
    });

    setSession(response.data);
    return response.data;
  }

  function logout() {
    accessToken.value = null;
    refreshToken.value = null;
    user.value = null;

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  function hasRole(allowedRoles: Role[]): boolean {
    if (!user.value?.role) return false;
    return allowedRoles.includes(user.value.role);
  }

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    userRole,
    setSession,
    setTokens,
    login,
    logout,
    hasRole,
  };
});
