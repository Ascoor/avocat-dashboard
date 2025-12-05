import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import API_CONFIG from '@/config/config';

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

const api: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

const refreshClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  withCredentials: true,
});

const broadcastAuthEvent = (event: 'auth:authorized' | 'auth:unauthorized' | 'auth:logout') => {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent(event));
};

const readTokenFromStorage = (): string | null => {
  try {
    const token = sessionStorage.getItem('token');
    if (!token) {
      return null;
    }

    const parsed = JSON.parse(token) as unknown;
    return typeof parsed === 'string' ? parsed : null;
  } catch (error) {
    console.warn('Error parsing token from sessionStorage', error);
    return null;
  }
};

const persistToken = (token: string | null) => {
  if (!token) {
    sessionStorage.removeItem('token');
    return;
  }

  sessionStorage.setItem('token', JSON.stringify(token));
};

let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const { data } = await refreshClient.post<{ access_token?: string }>('/api/auth/refresh');
        const nextToken = data?.access_token ?? null;

        if (nextToken) {
          persistToken(nextToken);
          broadcastAuthEvent('auth:authorized');
        }

        return nextToken;
      } catch (error) {
        persistToken(null);
        broadcastAuthEvent('auth:unauthorized');
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
};

// Interceptor: Attach token to every request
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = readTokenFromStorage();
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    } as typeof config.headers;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error ?? {};
    if (!response || !config) {
      return Promise.reject(error);
    }

    const status = response.status;
    const isAuthEndpoint = typeof config.url === 'string' &&
      (config.url.includes('/api/auth/login') || config.url.includes('/api/auth/register') || config.url.includes('/api/auth/refresh'));

    if ((status === 401 || status === 419) && !config._retry && !isAuthEndpoint) {
      config._retry = true;
      const nextToken = await refreshAccessToken();

      if (nextToken) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${nextToken}`,
        } as typeof config.headers;

        return api(config);
      }

      broadcastAuthEvent('auth:unauthorized');
    } else if (status === 401 && !isAuthEndpoint) {
      broadcastAuthEvent('auth:unauthorized');
      persistToken(null);
    }

    return Promise.reject(error);
  },
);

export default api;
