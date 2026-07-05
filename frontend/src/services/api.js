import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

export const TOKEN_KEY = 'token';
export const REFRESH_KEY = 'refreshToken';
export const USER_KEY = 'user';

const getStored = (key) => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
});

// Attach the JWT access token to every request so protected routes (incl. admin) authenticate.
api.interceptors.request.use((config) => {
  const token = getStored(TOKEN_KEY);
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On an expired/invalid token, clear stale credentials so the app falls back to login.
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err?.response?.status === 401 && typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.removeItem(REFRESH_KEY);
        window.localStorage.removeItem(USER_KEY);
      } catch {
        /* ignore storage errors */
      }
    }
    return Promise.reject(err);
  }
);

export default api;
