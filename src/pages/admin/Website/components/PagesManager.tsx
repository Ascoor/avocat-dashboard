import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { listWebsitePages, publishAllWebsitePages } from '@/api/websiteAdmin.service';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import useUserRoles from '@/hooks/useUserRoles';
import WorkflowStatusBadge from './WorkflowStatusBadge';
import PageEditor from './PageEditor/PageEditor';
import type { PageStatus, WorkflowState } from '@/types/website';

const PagesManager: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { can, isLoading: rolesLoading, isFetching: rolesFetching } = useUserRoles();

  const canViewPages = can('pages:view');
  const shouldFetchPages = canViewPages && !rolesLoading && !rolesFetching;

  const pagesQuery = useQuery({
    queryKey: ['admin-website-pages'],
    queryFn: listWebsitePages,
    enabled: shouldFetchPages,
  });

  const pages = useMemo(() => pagesQuery.data ?? [], [pagesQuery.data]);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [bulkProgress, setBulkProgress] = useState(0);
  const canBulkPublish = can('pages:bulk-publish');

  const filteredPages = useMemo(() => {
    if (!searchTerm.trim()) {
      return pages;
    }
    const normalized = searchTerm.toLowerCase();
    return pages.filter((page) => {
      const title = page.title?.en ?? page.title?.ar ?? '';
      return page.slug.toLowerCase().includes(normalized) || title.toLowerCase().includes(normalized);
    });
  }, [pages, searchTerm]);

  const publishAllMutation = useMutation({
    mutationFn: publishAllWebsitePages,
    onMutate: () => {
      setBulkProgress(25);
    },
    onSuccess: () => {
      toast({ title: 'All staged changes published' });
      queryClient.invalidateQueries({ queryKey: ['admin-website-pages'] });
      if (selectedSlug) {
        queryClient.invalidateQueries({ queryKey: ['admin-website-page', selectedSlug] });
      }
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Unable to publish all changes';
      toast({ title: 'Bulk publish failed', description: message, variant: 'destructive' });
    },
    onSettled: () => {
      setBulkProgress(0);
    },
  });

  useEffect(() => {
    if (!publishAllMutation.isPending) {
      return;
    }

    const interval = setInterval(() => {
      setBulkProgress((value) => {
        if (value >= 90) {
          return value;
        }
        return value + 5;
      });
    }, 350);

    return () => {
      clearInterval(interval);
    };
  }, [publishAllMutation.isPending]);

  useEffect(() => {
    if (!pages.length) {
      return;
    }

    if (!selectedSlug) {
      const preferredOrder = ['home', 'landing'];
      const preferredPage = preferredOrder
        .map((slug) => pages.find((page) => page.slug === slug))
        .find((page) => Boolean(page));
      setSelectedSlug((preferredPage ?? pages[0]).slug);
    } else if (!pages.some((page) => page.slug === selectedSlug)) {
      setSelectedSlug(pages[0].slug);
    }
  }, [pages, selectedSlug]);

  const selectedPage = useMemo(
    () => pages.find((page) => page.slug === selectedSlug),
    [pages, selectedSlug],
  );

  const renderStatusBadge = (workflowState?: WorkflowState, status?: PageStatus, scheduledFor?: string | null) => {
    if (workflowState) {
      return <WorkflowStatusBadge state={workflowState} scheduledFor={scheduledFor ?? null} />;
    }

    switch (status) {
      case 'published':
        return <Badge className="bg-emerald-100 text-emerald-800">🟢 Published</Badge>;
      case 'preview':
        return <Badge className="bg-blue-100 text-blue-800">🔵 Preview</Badge>;
      case 'unlinked':
        return <Badge className="bg-red-100 text-red-800">🔴 Unlinked</Badge>;
      default:
        return <Badge className="bg-amber-100 text-amber-800">🟡 Draft</Badge>;
    }
  };

  if (rolesLoading || rolesFetching) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!canViewPages) {
    return (
      <div className="rounded-lg border border-dashed border-border/60 p-6 text-sm text-muted-foreground">
        You do not have permission to view website pages. Please contact an administrator if you believe this is an error.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full space-y-3 lg:w-80">
          {pagesQuery.isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <>
              <Input
                placeholder="Search pages by slug or title"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              {filteredPages.length === 0 ? (
                <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                  No pages match “{searchTerm}”.
                </div>
              ) : (
                <Select value={selectedSlug} onValueChange={setSelectedSlug}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select page" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredPages.map((page) => (
                      <SelectItem key={page.slug} value={page.slug}>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex flex-col text-left">
                            <span className="text-sm font-medium">{page.title?.en ?? page.slug}</span>
                            <span className="text-xs text-muted-foreground">/{page.slug}</span>
                          </div>
                          {renderStatusBadge(page.workflow?.state, page.status, page.workflow?.scheduled_for ?? null)}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </>
          )}
        </div>

        <div className="flex w-full flex-col gap-3 lg:w-auto">
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => navigate('/dashboard/website/report')}>
              View report
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/dashboard/website/workflow')}>
              Workflow board
            </Button>
            <Button
              type="button"
              onClick={() => publishAllMutation.mutate()}
              disabled={!canBulkPublish || publishAllMutation.isPending}
            >
              {publishAllMutation.isPending ? 'Publishing…' : 'Publish all changes'}
            </Button>
          </div>
          {publishAllMutation.isPending ? (
            <div className="space-y-1">
              <Progress value={bulkProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">Rolling out staged drafts to production…</p>
            </div>
          ) : null}
          {!canBulkPublish ? (
            <p className="text-xs text-muted-foreground">Bulk publishing is limited to administrators.</p>
          ) : null}
        </div>
      </div>

      {selectedSlug ? (
        <PageEditor
          slug={selectedSlug}
          title={selectedPage?.title?.en ?? selectedSlug}
          description="Edit localized content blocks, stage drafts, and publish updates."
        />
      ) : null}
    </div>
  );
};

export default PagesManager;
