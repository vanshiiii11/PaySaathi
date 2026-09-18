import axios, { AxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// Request interceptor — attach access token
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 with refresh + retry once
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        const newAccessToken = data.data.accessToken;

        await SecureStore.setItemAsync('accessToken', newAccessToken);
        if (originalRequest.headers) {
          (originalRequest.headers as Record<string, string>)['Authorization'] = `Bearer ${newAccessToken}`;
        }
        return api(originalRequest);
      } catch {
        // Refresh failed — clear tokens, let the app handle redirect to auth
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        return Promise.reject(error);
      }
    }

    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

// ─── Typed API helpers ────────────────────────────────────────────────────────

export const authApi = {
  sendOtp: (phone: string) =>
    api.post('/auth/otp/send', { phone }),
  verifyOtp: (phone: string, code: string) =>
    api.post('/auth/otp/verify', { phone, code }),
  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),
  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),
};

export const userApi = {
  getMe: () => api.get('/users/me'),
  updateMe: (data: { name?: string; bio?: string }) => api.patch('/users/me', data),
  uploadAvatar: (formData: FormData) =>
    api.post('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateStatus: (data: {
    isActive: boolean;
    intent?: string;
    minAmount?: number;
    maxAmount?: number;
    radiusKm?: number;
    locationLat?: number;
    locationLng?: number;
  }) => api.patch('/users/me/status', data),
  getPublicProfile: (userId: string) => api.get(`/users/${userId}`),
};

export const matchApi = {
  getNearby: (params: {
    lat: number;
    lng: number;
    radiusKm?: number;
    direction?: string;
  }) => api.get('/match/nearby', { params }),
};

export const exchangeApi = {
  create: (data: {
    partnerId: string;
    direction: string;
    amount: number;
    note?: string;
    meetingPoint?: string;
  }) => api.post('/exchanges', data),
  update: (id: string, data: { status: string }) =>
    api.patch(`/exchanges/${id}`, data),
  list: (page = 1, limit = 10) =>
    api.get('/exchanges', { params: { page, limit } }),
  get: (id: string) => api.get(`/exchanges/${id}`),
};

export const chatApi = {
  getMessages: (threadId: string, page = 1, limit = 30) =>
    api.get(`/chats/${threadId}/messages`, { params: { page, limit } }),
};

export const ratingApi = {
  create: (data: {
    exchangeId: string;
    rateeId: string;
    stars: number;
    tags?: string[];
    comment?: string;
  }) => api.post('/ratings', data),
  getUserRatings: (userId: string) => api.get(`/ratings/users/${userId}`),
};

export const reportApi = {
  create: (data: {
    reportedId: string;
    reason: string;
    details?: string;
    exchangeId?: string;
  }) => api.post('/reports', data),
  blockUser: (userId: string) => api.post(`/reports/users/${userId}/block`),
  unblockUser: (userId: string) => api.delete(`/reports/users/${userId}/block`),
};

