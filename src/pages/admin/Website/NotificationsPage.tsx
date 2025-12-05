import { useMemo } from 'react';
import { AlertCircle, AlertTriangle, BellRing, CheckCircle2, RefreshCcw } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import useNotifications from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';

const severityTone = {
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  info: 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  error: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300',
} as const;

const severityIcon = {
  success: CheckCircle2,
  info: BellRing,
  warning: AlertTriangle,
  error: AlertCircle,
} as const;

const NotificationsPage = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    connectionState,
    isBootstrapping,
  } = useNotifications();

  const items = useMemo(() => notifications.slice(0, 200), [notifications]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground">Notification center</h1>
          <p className="text-sm text-muted-foreground">
            Live workflow alerts for approvals, publishing, scheduling, and autosave health inside the CMS.
          </p>
          <p className="text-xs text-muted-foreground">Connection state: {connectionState}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
            Mark all as read
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              items.forEach((item) => markAsRead(item.id));
            }}
          >
            <RefreshCcw className="mr-2 h-4 w-4" /> Sync
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <BellRing className="h-5 w-5" /> Live alerts
          </CardTitle>
          <CardDescription>Latest notifications from the website publishing workflow and editor tooling.</CardDescription>
        </CardHeader>
        <CardContent>
          {isBootstrapping && items.length === 0 ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={`notification-skeleton-${index}`} className="flex items-start gap-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-md border border-dashed border-border/60 bg-muted/40 p-6 text-center text-sm text-muted-foreground">
              No notifications have been received. Collaboration events and publishing outcomes will surface here instantly.
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((notification) => {
                const tone = severityTone[notification.severity] ?? severityTone.info;
                const Icon = severityIcon[notification.severity] ?? BellRing;
                return (
                  <li
                    key={notification.id}
                    className={cn(
                      'flex flex-col gap-2 rounded-lg border border-border/60 bg-background/90 p-4 shadow-sm transition',
                      !notification.read && 'border-primary/60 ring-1 ring-primary/30',
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={cn('flex h-9 w-9 items-center justify-center rounded-full', tone)}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-foreground">{notification.message}</span>
                          <span className="text-xs text-muted-foreground">{formatRelativeTime(notification.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notification.read ? (
                          <Badge variant="outline" className="border-primary/60 text-primary">
                            Unread
                          </Badge>
                        ) : null}
                        <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                          Mark read
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => dismissNotification(notification.id)}>
                          Dismiss
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary" className="capitalize">
                        {notification.category}
                      </Badge>
                      <span>Event: {notification.type}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const formatRelativeTime = (timestamp: string) => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return 'just now';
  }

  const diff = Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) {
    return 'just now';
  }
  if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return `${minutes}m ago`;
  }
  if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours}h ago`;
  }
  const days = Math.floor(diff / day);
  return `${days}d ago`;
};

export default NotificationsPage;
