import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';

import API_CONFIG from '@/config/config';
import { getActivityLog } from '@/api/websiteAdmin.service';
import type {
  ActivityLogEntry,
  AdminNotification,
  AdminNotificationCategory,
  AdminNotificationSeverity,
  AdminServerEventPayload,
} from '@/types/notifications';
import { useAuth } from '@/contexts/AuthContext';

export type NotificationConnectionState = 'idle' | 'connecting' | 'open' | 'error';

interface NotificationCenterContextValue {
  notifications: AdminNotification[];
  activity: ActivityLogEntry[];
  unreadCount: number;
  connectionState: NotificationConnectionState;
  isBootstrapping: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
  refreshActivity: () => Promise<void>;
}

const NotificationCenterContext = createContext<NotificationCenterContextValue | undefined>(
  undefined,
);

const MAX_ITEMS = 100;

const mapSeverity = (severity?: AdminNotificationSeverity): AdminNotificationSeverity => {
  if (!severity) {
    return 'info';
  }
  return severity;
};

const mapCategory = (category?: AdminNotificationCategory): AdminNotificationCategory => {
  if (!category) {
    return 'system';
  }
  return category;
};

const bootstrapActivityFallback = (event: AdminServerEventPayload): ActivityLogEntry => {
  const timestamp = event.timestamp ?? new Date().toISOString();
  const payload = event.payload ?? {};
  return {
    id: event.id ?? `${event.type}-${timestamp}`,
    timestamp,
    user: (payload.user as string) ?? 'System',
    action: event.type,
    section: (payload.section as string | undefined) ?? null,
    diffSummary: event.message ?? null,
    metadata: payload,
  };
};

const NotificationCenterProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [activity, setActivity] = useState<ActivityLogEntry[]>([]);
  const [connectionState, setConnectionState] = useState<NotificationConnectionState>('idle');
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { user, isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && user?.role === 'admin';

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const readToken = useCallback((): string | null => {
    try {
      const storedToken = sessionStorage.getItem('token');
      if (!storedToken) {
        return null;
      }

      const parsed = JSON.parse(storedToken) as string | null;
      if (!parsed || typeof parsed !== 'string' || parsed.length === 0) {
        return null;
      }

      return parsed;
    } catch (error) {
      console.warn('Unable to parse session token for SSE connection', error);
      return null;
    }
  }, []);

  const refreshActivity = useCallback(async () => {
    if (!isAdmin) {
      setActivity([]);
      return;
    }

    try {
      const entries = await getActivityLog({ limit: 100 });
      setActivity(entries);
    } catch (error) {
      console.warn('Failed to refresh activity log', error);
    }
  }, [isAdmin]);

  const handleServerEvent = useCallback(
    (payload: AdminServerEventPayload) => {
      const timestamp = payload.timestamp ?? new Date().toISOString();
      const id = payload.id ?? `${payload.type}-${timestamp}`;
      const severity = mapSeverity(payload.severity);
      const category = mapCategory(payload.category);
      const meta = payload.payload;

      if (payload.activity) {
        const entry: ActivityLogEntry = {
          ...payload.activity,
          id: payload.activity.id ?? id,
          timestamp: payload.activity.timestamp ?? timestamp,
        };
        setActivity((prev) => {
          const filtered = prev.filter((item) => item.id !== entry.id);
          return [entry, ...filtered].slice(0, MAX_ITEMS);
        });
      } else {
        setActivity((prev) => {
          const entry = bootstrapActivityFallback(payload);
          const filtered = prev.filter((item) => item.id !== entry.id);
          return [entry, ...filtered].slice(0, MAX_ITEMS);
        });
      }

      setNotifications((prev) => {
        const next: AdminNotification = {
          id,
          type: payload.type,
          message: payload.message ?? payload.type,
          createdAt: timestamp,
          severity,
          category,
          read: false,
          meta: meta,
        };
        const filtered = prev.filter((item) => item.id !== id);
        return [next, ...filtered].slice(0, MAX_ITEMS);
      });

      const invalidateTargets = payload.invalidateQueries ?? [];
      if (invalidateTargets.length > 0) {
        invalidateTargets.forEach((key) => {
          queryClient
            .invalidateQueries({ queryKey: [key] })
            .catch((error) => console.warn('Failed to invalidate query for key', key, error));
        });
      } else if (payload.type.startsWith('workflow.') || payload.type.startsWith('publish.')) {
        queryClient.invalidateQueries({ queryKey: ['admin-website-publishing-queue'] }).catch(() => undefined);
        queryClient.invalidateQueries({ queryKey: ['admin-website-report'] }).catch(() => undefined);
      }
    },
    [queryClient],
  );

  useEffect(() => {
    let isMounted = true;

    if (!isAdmin) {
      setIsBootstrapping(false);
      setConnectionState('idle');
      setActivity([]);
      setNotifications([]);
      reconnectAttempts.current = 0;
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
        reconnectTimeout.current = null;
      }
      return () => {
        isMounted = false;
      };
    }

    const bootstrap = async () => {
      try {
        await refreshActivity();
      } finally {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      }
    };

    bootstrap().catch((error) => {
      console.warn('Notification center bootstrap failed', error);
      if (isMounted) {
        setIsBootstrapping(false);
      }
    });

    return () => {
      isMounted = false;
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [isAdmin, refreshActivity]);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    if (!isAdmin) {
      setConnectionState('idle');
      reconnectAttempts.current = 0;
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
        reconnectTimeout.current = null;
      }
      return () => {
        if (eventSource) {
          eventSource.close();
        }
      };
    }

    const connect = () => {
      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }

      setConnectionState('connecting');

      const url = new URL('/api/admin/events/subscribe', API_CONFIG.baseURL);
      const token = readToken();
      if (!token) {
        setConnectionState('idle');
        return;
      }

      url.searchParams.set('token', token);

      const source = new EventSource(url.toString(), { withCredentials: true });
      eventSource = source;

      source.onopen = () => {
        setConnectionState('open');
        reconnectAttempts.current = 0;
      };

      source.onerror = () => {
        setConnectionState('error');
        source.close();
        if (reconnectAttempts.current < 5) {
          const timeout = Math.min(30000, 1000 * 2 ** reconnectAttempts.current);
          reconnectAttempts.current += 1;
          reconnectTimeout.current = setTimeout(connect, timeout);
        }
      };

      source.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as AdminServerEventPayload;
          handleServerEvent(data);
        } catch (error) {
          console.warn('Failed to parse admin event payload', error);
        }
      };

      source.addEventListener('ping', () => {
        setConnectionState('open');
      });
    };

    connect();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [handleServerEvent, isAdmin, readToken]);

  const unreadCount = useMemo(
    () => notifications.reduce((total, notification) => (notification.read ? total : total + 1), 0),
    [notifications],
  );

  const contextValue = useMemo<NotificationCenterContextValue>(
    () => ({
      notifications,
      activity,
      unreadCount,
      connectionState,
      isBootstrapping,
      markAsRead,
      markAllAsRead,
      dismissNotification,
      refreshActivity,
    }),
    [
      activity,
      connectionState,
      dismissNotification,
      isBootstrapping,
      markAllAsRead,
      markAsRead,
      notifications,
      refreshActivity,
      unreadCount,
    ],
  );

  return (
    <NotificationCenterContext.Provider value={contextValue}>
      {children}
    </NotificationCenterContext.Provider>
  );
};

export const useNotificationCenterContext = () => {
  const context = useContext(NotificationCenterContext);
  if (!context) {
    throw new Error('useNotificationCenterContext must be used within NotificationCenterProvider');
  }

  return context;
};

export default NotificationCenterProvider;
