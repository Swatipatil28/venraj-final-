/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
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
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }

    if (error.response?.status === 429) {
      console.warn('Rate limited - skipping retry');
      return Promise.reject(new Error('Too many requests. Please try again later.'));
    }

    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timeout. Please try again.'));
    }

    if (error.message === 'Network Error' || !error.response) {
      return Promise.reject(new Error('Network Error. Please ensure you are connected to the internet and the server is reachable.'));
    }

    const serverMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      `Server error (${error.response?.status || 500})`;

    return Promise.reject(new Error(serverMessage));
  }
);

export default api;
