import { useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowUpRight, CalendarClock, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

import { getPublishingQueue } from '@/api/websiteAdmin.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import WorkflowStatusBadge from './components/WorkflowStatusBadge';
import useNotifications from '@/hooks/useNotifications';
import useUserRoles from '@/hooks/useUserRoles';

const WorkflowBoardPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { can, isLoading: rolesLoading, isFetching: rolesFetching } = useUserRoles();
  const permissionsReady = !(rolesLoading || rolesFetching);
  const canViewWorkflow = permissionsReady && can('pages:view');

  const queueQuery = useQuery({
    queryKey: ['admin-website-publishing-queue'],
    queryFn: getPublishingQueue,
    enabled: canViewWorkflow,
  });
  const { connectionState } = useNotifications();

  const items = useMemo(() => queueQuery.data ?? [], [queueQuery.data]);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-website-publishing-queue'] });
  };

  if (!permissionsReady) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!canViewWorkflow) {
    return (
      <div className="rounded-lg border border-dashed border-border/60 p-6 text-sm text-muted-foreground">
        You do not have permission to view the publishing workflow.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Publishing workflow</h1>
          <p className="text-sm text-muted-foreground">
            Monitor drafts awaiting approval, scheduled publishes, and bulk publishing progress in real time.
          </p>
          <p className="text-xs text-muted-foreground">Live updates: {connectionState}</p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={queueQuery.isFetching}>
          <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Approval queue</CardTitle>
          <CardDescription>Items appear here when editors request approval or schedule a publish.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {queueQuery.isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending approvals or scheduled publishes 🎉</p>
          ) : (
            items.map((item) => (
              <div key={`${item.slug}-${item.draft_id ?? 'live'}`} className="flex flex-col gap-3 rounded-lg border border-border/60 p-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-foreground">/{item.slug}</h3>
                    <WorkflowStatusBadge state={item.state} scheduledFor={item.scheduled_for ?? null} />
                    {item.progress !== undefined ? (
                      <Badge variant="outline">{Math.round(item.progress)}%</Badge>
                    ) : null}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Submitted by {item.submitted_by ?? '—'} • Last updated {item.last_updated ? new Date(item.last_updated).toLocaleString() : '—'}
                  </p>
                  {item.approved_by ? (
                    <p className="text-xs text-muted-foreground">Approved by {item.approved_by}</p>
                  ) : null}
                </div>

                <div className="flex w-full flex-col gap-2 md:w-56">
                  {item.scheduled_for ? (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarClock className="h-4 w-4" /> Scheduled for {new Date(item.scheduled_for).toLocaleString()}
                    </div>
                  ) : null}
                  {item.progress !== undefined ? <Progress value={Math.min(100, Math.round(item.progress))} /> : null}
                  <Button variant="ghost" size="sm" className="justify-start px-0" asChild>
                    <Link to="/dashboard/website/pages" className="inline-flex items-center gap-2">
                      <ArrowUpRight className="h-4 w-4" /> Open in editor
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowBoardPage;
