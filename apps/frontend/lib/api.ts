import axios from 'axios';
import { getStoredToken } from '@/lib/auth';
import type { GratifikasiRecord, PaginatedResponse, AuditLog, AnalyticsData, ModelInfo, User } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000',
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('gratifikasi_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export async function login(username: string, password: string): Promise<{ token: string; user?: User }> {
  const { data } = await api.post('/auth/login/', { username, password });
  return data;
}

export async function getRecords(params?: Record<string, string | number>): Promise<PaginatedResponse<GratifikasiRecord>> {
  const { data } = await api.get('/api/records/', { params });
  return data;
}

export async function getRecord(id: number | string): Promise<GratifikasiRecord> {
  const { data } = await api.get(`/api/records/${id}/`);
  return data;
}

export async function submitRecord(payload: {
  text: string;
  value_estimation: number;
  relationship?: string;
  context?: string;
  country?: string;
  regulatory_framework?: string;
}): Promise<GratifikasiRecord> {
  const { data } = await api.post('/api/records/', payload);
  return data;
}

export async function approveRecord(
  id: number | string,
  payload: { final_label: string; note?: string }
): Promise<GratifikasiRecord> {
  const { data } = await api.post(`/api/records/${id}/approve/`, payload);
  return data;
}

export async function getAuditLog(id: number | string): Promise<AuditLog[]> {
  const { data } = await api.get(`/api/records/${id}/audit/`);
  return data;
}

export async function getAnalytics(): Promise<AnalyticsData> {
  const { data } = await api.get('/api/analytics/');
  return data;
}

export async function getModelInfo(): Promise<ModelInfo> {
  const { data } = await api.get('/api/model-info/');
  return data;
}

export async function triggerRetraining(): Promise<{ message: string }> {
  const { data } = await api.post('/api/model-info/retrain/');
  return data;
}

export async function getUsers(): Promise<User[]> {
  const { data } = await api.get('/api/users/');
  return data;
}

export async function updateUser(id: number, payload: Partial<User> & { is_active?: boolean }): Promise<User> {
  const { data } = await api.patch(`/api/users/${id}/`, payload);
  return data;
}

export default api;
