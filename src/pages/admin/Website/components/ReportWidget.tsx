import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity, AlertTriangle, BarChart3, CheckCircle2, Clock, Database, History, Timer } from 'lucide-react';
import { Link } from 'react-router-dom';

import { getWebsiteReport } from '@/api/websiteAdmin.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import WorkflowStatusBadge from './WorkflowStatusBadge';
import useNotifications from '@/hooks/useNotifications';
import useUserRoles from '@/hooks/useUserRoles';

const ReportWidget: React.FC = () => {
  const { can, isLoading: rolesLoading, isFetching: rolesFetching } = useUserRoles();
  const permissionsReady = !(rolesLoading || rolesFetching);
  const canViewReport = permissionsReady && can('analytics:view');

  const reportQuery = useQuery({
    queryKey: ['admin-website-report'],
    queryFn: getWebsiteReport,
    enabled: canViewReport,
  });

  const report = reportQuery.data;
  const { activity, connectionState } = useNotifications();
  const recentActivity = useMemo(() => activity.slice(0, 10), [activity]);

  if (!permissionsReady) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!canViewReport) {
    return (
      <Card className="border-dashed border-border/60 bg-muted/30">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Analytics access required</CardTitle>
          <CardDescription>You do not have permission to view website analytics.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (reportQuery.isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (reportQuery.isError || !report) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" /> Unable to load report
          </CardTitle>
          <CardDescription className="text-red-600">
            Check API connectivity for /api/admin/website/report and try again.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const completion = Math.round(report.completionRate ?? 0);
  const apiStatus = report.apiHealthy ? (
    <Badge className="bg-emerald-100 text-emerald-800">Connected</Badge>
  ) : (
    <Badge className="bg-red-100 text-red-800">Unavailable</Badge>
  );
  const mediaUsage = report.mediaStorageUsage;
  const mediaUsageValue = mediaUsage?.quota ? Math.min(100, Math.round((mediaUsage.used / mediaUsage.quota) * 100)) : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Activity className="h-4 w-4" /> Completion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-semibold">{completion}%</div>
            <Progress value={completion} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Clock className="h-4 w-4" /> Last edited
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">
              {report.lastEditedAt ? new Date(report.lastEditedAt).toLocaleString() : 'No edits recorded'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CheckCircle2 className="h-4 w-4" /> Completed pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">
              {report.completedPages} / {report.totalPages}
            </p>
            <p className="text-xs text-muted-foreground">Pending drafts: {report.pendingDrafts}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">API status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {apiStatus}
            <p className="text-xs text-muted-foreground">Monitored endpoint: /api/admin/website/report</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Timer className="h-4 w-4" /> Pending approvals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-semibold">{report.pendingApprovals ?? 0}</p>
            <p className="text-xs text-muted-foreground">Requests awaiting admin review.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Database className="h-4 w-4" /> Media usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm font-medium text-foreground">
              {mediaUsage ? (
                <>
                  {formatBytes(mediaUsage.used)} / {formatBytes(mediaUsage.quota)}
                </>
              ) : (
                '—'
              )}
            </div>
            <Progress value={mediaUsageValue} />
            <p className="text-xs text-muted-foreground">Media library consumption (real-time).</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Section progress</CardTitle>
          <CardDescription>Track how each landing page module is progressing toward publication.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {report.sections.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sections available.</p>
          ) : (
            report.sections.map((section) => {
              const progress = Math.round(section.completion);
              return (
                <div key={section.slug} className="space-y-2 rounded-lg border border-border/60 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{section.title}</span>
                      <WorkflowStatusBadge state={section.status === 'published' ? 'published' : 'draft'} />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Last update: {section.updated_at ? new Date(section.updated_at).toLocaleString() : '—'}
                    </span>
                  </div>
                  <Progress value={progress} />
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <BarChart3 className="h-5 w-5" /> Edit frequency
            </CardTitle>
            <CardDescription>Pages with the highest cadence of edits in the last sprint.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {report.editFrequencyPerPage && report.editFrequencyPerPage.length > 0 ? (
              report.editFrequencyPerPage.map((item) => (
                <div key={item.slug} className="flex items-center justify-between rounded-md border border-border/60 p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">/{item.slug}</p>
                    <p className="text-xs text-muted-foreground">Edits in sprint</p>
                  </div>
                  <Badge variant="secondary">{item.edits}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No edit activity recorded.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Clock className="h-5 w-5" /> Time since publish
            </CardTitle>
            <CardDescription>Monitor stale pages that may need updates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {report.timeSinceLastPublish && report.timeSinceLastPublish.length > 0 ? (
              report.timeSinceLastPublish.map((item) => (
                <div key={item.slug} className="flex items-center justify-between rounded-md border border-border/60 p-3">
                  <span className="text-sm font-medium text-foreground">/{item.slug}</span>
                  <span className="text-xs text-muted-foreground">{formatMinutes(item.minutes)}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Publish activity data not available.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <History className="h-5 w-5" /> Recent admin activity
            </CardTitle>
            <CardDescription>Live audit log events streaming from website collaborators.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Status: {connectionState === 'open' ? 'Live' : connectionState}</span>
              <Link to="/dashboard/website/activity" className="font-medium text-primary hover:underline">
                View all
              </Link>
            </div>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity captured in the last updates.</p>
            ) : (
              <ul className="space-y-2">
                {recentActivity.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-center justify-between gap-3 rounded-md border border-border/60 bg-muted/40 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-1">{entry.action}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {entry.user} • {formatRelativeTimestamp(entry.timestamp)}
                      </p>
                    </div>
                    {entry.section ? (
                      <Badge variant="outline" className="shrink-0 capitalize">
                        {entry.section}
                      </Badge>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const formatBytes = (bytes: number) => {
  if (!Number.isFinite(bytes)) {
    return '—';
  }
  if (bytes >= 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  if (bytes >= 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  return `${bytes} B`;
};

const formatMinutes = (minutes: number) => {
  if (!Number.isFinite(minutes)) {
    return '—';
  }
  if (minutes < 60) {
    return `${minutes} min ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const formatRelativeTimestamp = (value: string) => {
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

export default ReportWidget;
