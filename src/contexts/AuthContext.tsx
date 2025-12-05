import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import api from '@/api/axiosConfig';

interface ApiUser {
  id: number | string;
  email: string;
  name: string;
  role?: string | number | null;
  avatar?: string | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'lawyer' | 'client';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const STORAGE_USER_KEY = 'avocat_user';
const TOKEN_STORAGE_KEY = 'token';
const AUTH_EVENTS = {
  unauthorized: 'auth:unauthorized',
  logout: 'auth:logout',
  authorized: 'auth:authorized',
} as const;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const broadcastAuthEvent = useCallback((event: keyof typeof AUTH_EVENTS) => {
    if (typeof window === 'undefined') {
      return;
    }

    window.dispatchEvent(new CustomEvent(AUTH_EVENTS[event]));
  }, []);

  const readUserFromStorage = useCallback(() => {
    const storedUser = localStorage.getItem(STORAGE_USER_KEY);
    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as User;
    } catch (error) {
      console.warn('Failed to parse stored user payload', error);
      localStorage.removeItem(STORAGE_USER_KEY);
      return null;
    }
  }, []);

  const mapRole = useCallback((role: ApiUser['role']): User['role'] => {
    const normalized = typeof role === 'string' ? role.toLowerCase() : String(role ?? '').toLowerCase();

    if (normalized === '1' || normalized === 'admin') {
      return 'admin';
    }

    if (normalized === '2' || normalized === 'lawyer') {
      return 'lawyer';
    }

    return 'client';
  }, []);

  const mapApiUserToContextUser = useCallback(
    (payload: ApiUser): User => ({
      id: String(payload.id),
      email: payload.email,
      name: payload.name,
      avatar: payload.avatar ?? undefined,
      role: mapRole(payload.role ?? null),
    }),
    [mapRole],
  );

  useEffect(() => {
    const initialize = async () => {
      try {
        const storedUser = readUserFromStorage();
        if (storedUser) {
          setUser(storedUser);
        }

        const storedToken = sessionStorage.getItem(TOKEN_STORAGE_KEY);
        if (storedToken) {
          const parsedToken = JSON.parse(storedToken) as string | null;
          if (parsedToken) {
            const { data } = await api.get<ApiUser>('/api/auth/profile');
            const mappedUser = mapApiUserToContextUser(data);
            setUser(mappedUser);
            localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(mappedUser));
          }
        }
      } catch (error) {
        console.warn('Failed to bootstrap auth state from API', error);
        sessionStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(STORAGE_USER_KEY);
      } finally {
        setLoading(false);
      }
    };

    void initialize();
  }, [mapApiUserToContextUser, readUserFromStorage]);

  useEffect(() => {
    const handleAuthReset = () => {
      setUser(null);
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(STORAGE_USER_KEY);
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (!event.key) {
        return;
      }

      if (event.key === STORAGE_USER_KEY) {
        const nextUser = readUserFromStorage();
        setUser(nextUser);
      }

      if (event.key === TOKEN_STORAGE_KEY && event.storageArea === sessionStorage) {
        // sessionStorage events don't fire across tabs, guard for safety
        if (!event.newValue) {
          setUser(null);
        }
      }
    };

    window.addEventListener(AUTH_EVENTS.unauthorized, handleAuthReset);
    window.addEventListener(AUTH_EVENTS.logout, handleAuthReset);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(AUTH_EVENTS.unauthorized, handleAuthReset);
      window.removeEventListener(AUTH_EVENTS.logout, handleAuthReset);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [readUserFromStorage]);

  const extractErrorMessage = useCallback((error: unknown, fallback: string): string => {
    if (error && typeof error === 'object') {
      const maybeResponse = (error as { response?: { data?: { message?: string } } }).response;
      if (maybeResponse?.data?.message && typeof maybeResponse.data.message === 'string') {
        return maybeResponse.data.message;
      }

      if ('message' in error && typeof (error as { message?: string }).message === 'string') {
        return (error as { message: string }).message;
      }
    }

    return fallback;
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const response = await api.post<{ user: ApiUser; access_token: string }>(
          '/api/auth/login',
          { email, password },
        );

        const token = response.data?.access_token;
        const apiUser = response.data?.user;

        if (!token || !apiUser) {
          throw new Error('Invalid authentication response.');
        }

        sessionStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(token));

        const mappedUser = mapApiUserToContextUser(apiUser);
        setUser(mappedUser);
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(mappedUser));
        broadcastAuthEvent('authorized');
      } catch (error) {
        const message = extractErrorMessage(error, 'فشل في تسجيل الدخول');
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [broadcastAuthEvent, extractErrorMessage, mapApiUserToContextUser],
  );

  const signup = useCallback(
    async (email: string, password: string, name: string) => {
      setLoading(true);
      try {
        const response = await api.post<{ user: ApiUser; access_token: string }>(
          '/api/auth/register',
          {
            name,
            email,
            password,
            password_confirmation: password,
            role: '3',
          },
        );

        const token = response.data?.access_token;
        const apiUser = response.data?.user;

        if (!token || !apiUser) {
          throw new Error('Invalid registration response.');
        }

        sessionStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(token));

        const mappedUser = mapApiUserToContextUser(apiUser);
        setUser(mappedUser);
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(mappedUser));
        broadcastAuthEvent('authorized');
      } catch (error) {
        const message = extractErrorMessage(error, 'فشل في إنشاء الحساب');
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [broadcastAuthEvent, extractErrorMessage, mapApiUserToContextUser],
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_USER_KEY);
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    broadcastAuthEvent('logout');
    void api.post('/api/auth/logout').catch(() => undefined);
  }, [broadcastAuthEvent]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      loading,
    }),
    [loading, login, logout, signup, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};