/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

export const API_URL = import.meta.env.VITE_API_URL || "https://venraj-final.onrender.com";
const API_BASE_URL = `${API_URL}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

const pendingRequests = new Map<string, Promise<unknown>>();

export async function fetchOnce<T>(key: string, fn: () => Promise<T>): Promise<T> {
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key) as Promise<T>;
  }

  const promise = fn().finally(() => {
    pendingRequests.delete(key);
  });

  pendingRequests.set(key, promise);
  return promise as Promise<T>;
}

api.interceptors.request.use((config) => {
  if (import.meta.env.DEV) console.log('API CALL:', config.url);
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data?.data ?? response.data,
  async (error) => {
    const { config, response } = error;

    if (response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Retry mechanism for Render cold starts
    if (!config || !config.retry) config.retry = 0;
    const shouldRetry = !response || response.status === 503 || response.status === 504 || response.status === 502;
    
    if (shouldRetry && config.retry < 3) {
      config.retry += 1;
      const delay = config.retry * 2000;
      console.log(`Retrying API call (${config.retry}/3) in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return api(config);
    }

    if (error.response?.status === 429) {
      console.warn('Rate limited - skipping retry');
      return Promise.reject(new Error('Too many requests. Please try again later.'));
    }

    let message = "An unexpected error occurred";
    if (error.message === 'Network Error' || !error.response) {
      message = 'Backend server is sleeping or unreachable. Please wait...';
    } else if (error.code === 'ECONNABORTED') {
      message = 'Request timeout. The server might be waking up.';
    } else {
      message = error.response?.data?.message || error.response?.data?.error || `Server error (${error.response?.status || 500})`;
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
