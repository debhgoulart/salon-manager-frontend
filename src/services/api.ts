import axios, { type AxiosRequestConfig, type AxiosError } from 'axios';
import { useAuthStore } from 'src/stores/auth';
import type { ProblemDetails } from 'src/types/api';

const baseURL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${authStore.accessToken}`;
    }
    return config;
  },
  (error: unknown) => Promise.reject(error instanceof Error ? error : new Error(String(error)))
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ProblemDetails>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    const authStore = useAuthStore();

    if (error.response?.status === 401 && !originalRequest?._retry && authStore.refreshToken) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err: unknown) => Promise.reject(err instanceof Error ? err : new Error(String(err))));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(`${baseURL}/api/auth/refresh`, {
          refreshToken: authStore.refreshToken,
        });

        authStore.setTokens(data.accessToken, data.refreshToken);
        processQueue(null);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshErr: unknown) {
        processQueue(refreshErr);
        authStore.logout();
        return Promise.reject(refreshErr instanceof Error ? refreshErr : new Error(String(refreshErr)));
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
