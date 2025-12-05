import { useEffect, useMemo, useState } from 'react';
import { Clock, FolderKanban, RefreshCcw, ShieldCheck, UserCircle } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import useNotifications from '@/hooks/useNotifications';

const ActivityLogPage = () => {
  const { activity, refreshActivity, connectionState, isBootstrapping } = useNotifications();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    refreshActivity().catch((error) => console.warn('Failed to fetch activity log on mount', error));
  }, [refreshActivity]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshActivity();
    } finally {
      setIsRefreshing(false);
    }
  };

  const items = useMemo(() => activity.slice(0, 200), [activity]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground">Website activity log</h1>
          <p className="text-sm text-muted-foreground">
            Audit every workflow step including edits, approvals, publishing attempts, and scheduling changes.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" /> Real-time feed status: <strong className="font-semibold text-foreground">{connectionState}</strong>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <FolderKanban className="h-5 w-5" /> Latest activity
          </CardTitle>
          <CardDescription>
            Entries are captured whenever an admin edits, reviews, or publishes website content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isBootstrapping && items.length === 0 ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={`skeleton-${index}`} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-md border border-dashed border-border/60 bg-muted/40 p-6 text-center text-sm text-muted-foreground">
              No activity has been recorded yet. Actions performed inside the CMS will appear instantly.
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((entry) => (
                <li key={entry.id} className="flex flex-col gap-2 rounded-lg border border-border/60 bg-background/80 p-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <UserCircle className="h-4 w-4" /> {entry.user}
                    </div>
                    <time className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" /> {formatRelativeTime(entry.timestamp)}
                    </time>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-foreground">
                    <Badge variant="secondary" className="capitalize">
                      {entry.action}
                    </Badge>
                    {entry.section ? (
                      <Badge variant="outline" className="capitalize">
                        {entry.section}
                      </Badge>
                    ) : null}
                  </div>
                  {entry.diffSummary ? (
                    <p className="text-sm text-muted-foreground">{entry.diffSummary}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const formatRelativeTime = (value: string) => {
  const date = new Date(value);
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

export default ActivityLogPage;
