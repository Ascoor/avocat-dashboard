import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { CalendarClock, CheckCircle2, Eye, FileWarning, Hourglass, Send, TimerReset } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import BlockManager from '../BlockManager';
import PreviewPane from './PreviewPane';
import type { PageFormValues, BlockFormValue } from './types';
import usePageManager from '@/hooks/usePageManager';
import useUserRoles from '@/hooks/useUserRoles';
import useWorkflowManager from '@/hooks/useWorkflowManager';
import PublishScheduleModal from '../PublishScheduleModal';
import type { ContentBlock, Localized, WorkflowEvent } from '@/types/website';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import WorkflowStatusBadge from '../WorkflowStatusBadge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface PageEditorProps {
  slug: string;
  title?: string;
  description?: string;
}

const defaultValues: PageFormValues = {
  title_en: '',
  title_ar: '',
  blocks: [],
};

const serializeValue = (value: unknown, type: string | null | undefined): string => {
  if (type === 'list') {
    if (Array.isArray(value)) {
      return value.join('\n');
    }
    return '';
  }

  if (type === 'json') {
    if (value === null || value === undefined) {
      return '';
    }

    try {
      return JSON.stringify(value, null, 2);
    } catch (error) {
      return String(value ?? '');
    }
  }

  if (Array.isArray(value)) {
    return value.join(', ');
  }

  if (typeof value === 'string') {
    return value;
  }

  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
};

const deserializeValue = (input: string, type: string | null | undefined): unknown => {
  if (type === 'list') {
    return input
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  if (type === 'json') {
    if (!input.trim()) {
      return null;
    }

    return JSON.parse(input);
  }

  const trimmed = input.trim();
  if (!trimmed.length) {
    return null;
  }

  return trimmed;
};

const createFormValues = (page: { content_blocks?: ContentBlock[]; title?: Localized<string | null> } | undefined): PageFormValues => {
  if (!page) {
    return {
      title_en: '',
      title_ar: '',
      blocks: [],
    };
  }

  return {
    title_en: page.title?.en ?? '',
    title_ar: page.title?.ar ?? '',
    blocks: (page.content_blocks ?? []).map((block) => ({
      id: String(block.id ?? block.key ?? Math.random()),
      key: block.key,
      type: block.type ?? 'text',
      value_en: serializeValue(block.value?.en ?? '', block.type),
      value_ar: serializeValue(block.value?.ar ?? '', block.type),
    })),
  };
};

const toContentBlocks = (values: PageFormValues): ContentBlock[] => {
  return values.blocks.map((block, index) => {
    const type = block.type ?? 'text';

    const parseValue = (input: string, fallback: unknown) => {
      try {
        return deserializeValue(input ?? '', type);
      } catch (error) {
        return fallback;
      }
    };

    const valueEn = parseValue(block.value_en ?? '', block.value_en);
    const valueAr = parseValue(block.value_ar ?? '', block.value_ar);

    return {
      key: block.key || `block_${index + 1}`,
      type,
      value: {
        en: valueEn,
        ar: valueAr,
      },
    };
  });
};

const toPayload = (values: PageFormValues) => {
    const contentBlocks = values.blocks.map((block) => {
      const type = block.type ?? 'text';
      const valueEn = deserializeValue(block.value_en ?? '', type);
      const valueAr = deserializeValue(block.value_ar ?? '', type);

    return {
      key: block.key,
      type,
      value: {
        en: valueEn,
        ar: valueAr,
      },
    };
  });

  return {
    title_en: values.title_en ?? '',
    title_ar: values.title_ar ?? '',
    content_blocks: contentBlocks,
  };
};

const formatTimestamp = (input: string | null | undefined) => {
  if (!input) {
    return '—';
  }

  try {
    const date = new Date(input);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  } catch (error) {
    return input;
  }
};

const workflowEventMeta: Record<WorkflowEvent['type'], { label: string; icon: ReactNode; tone: string }> = {
  submitted: { label: 'Submitted for review', icon: <Send className="h-4 w-4 text-blue-500" />, tone: 'text-blue-600 dark:text-blue-200' },
  reviewed: { label: 'Reviewed', icon: <Eye className="h-4 w-4 text-slate-500" />, tone: 'text-muted-foreground' },
  approved: {
    label: 'Approved',
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    tone: 'text-emerald-600 dark:text-emerald-200',
  },
  rejected: {
    label: 'Changes requested',
    icon: <FileWarning className="h-4 w-4 text-red-500" />,
    tone: 'text-red-600 dark:text-red-200',
  },
  published: {
    label: 'Published',
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    tone: 'text-emerald-600 dark:text-emerald-200',
  },
  scheduled: {
    label: 'Scheduled',
    icon: <CalendarClock className="h-4 w-4 text-purple-500" />,
    tone: 'text-purple-600 dark:text-purple-200',
  },
  cancelled: {
    label: 'Schedule cancelled',
    icon: <TimerReset className="h-4 w-4 text-amber-500" />,
    tone: 'text-amber-600 dark:text-amber-200',
  },
};

const PageEditor: React.FC<PageEditorProps> = ({ slug, title, description }) => {
  const { toast } = useToast();
  const {
    can,
    isLoading: isRolesLoading,
    isFetching: isRolesFetching,
  } = useUserRoles();
  const permissionsReady = !(isRolesLoading || isRolesFetching);
  const hasViewAccess = permissionsReady && can('pages:view');
  const canManageWorkflow =
    permissionsReady && (can('pages:approve') || can('pages:publish') || can('pages:schedule'));

  const { page, status, workflow, workflowState, history, isLoading, isSaving, isPreviewing, saveDraft, requestPreview } =
    usePageManager(slug, { enabled: hasViewAccess });
  const {
    requestApproval,
    approveAndPublish,
    publishDirectly,
    schedulePublish,
    cancelSchedule,
    isRequestingApproval,
    isApproving,
    isPublishing: isWorkflowPublishing,
    isScheduling,
    isCancellingSchedule,
  } = useWorkflowManager({ slug, enabled: hasViewAccess, loadQueue: canManageWorkflow });

  const form = useForm<PageFormValues>({
    defaultValues,
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: 'blocks',
  });

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  const watchedValues = useWatch({ control: form.control }) as PageFormValues | undefined;
  const previewValues = watchedValues ?? defaultValues;
  const previewBlocks = useMemo(() => toContentBlocks(previewValues), [previewValues]);
  const previewTitle = useMemo<Localized<string | null>>(
    () => ({
      en: previewValues.title_en || page?.title?.en || slug,
      ar: previewValues.title_ar || page?.title?.ar || null,
    }),
    [page?.title?.ar, page?.title?.en, previewValues.title_ar, previewValues.title_en, slug],
  );

  const lastSnapshotRef = useRef<string>('');
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allowEditing = permissionsReady && can('pages:edit');
  const isReadOnly = !allowEditing;
  const canPreviewDraft = permissionsReady && (can('pages:view') || allowEditing);
  const canPublishNow = permissionsReady && can('pages:publish');
  const canApproveContent = permissionsReady && can('pages:approve');
  const canScheduleContent = permissionsReady && can('pages:schedule');
  const showRequestApprovalButton = allowEditing && !canApproveContent && !canPublishNow;

  const previewHref = useMemo(() => {
    if (!slug) {
      return page?.preview_url ?? null;
    }
    const base = `/preview/${slug}`;
    const params = new URLSearchParams();
    if (workflow?.draft_id) {
      params.set('draftId', workflow.draft_id);
    }

    const fallback = params.size > 0 ? `${base}?${params.toString()}` : base;
    return page?.preview_url ?? fallback;
  }, [page?.preview_url, slug, workflow?.draft_id]);

  const workflowEvents = useMemo(() => {
    const events = [...(workflow?.events ?? [])];
    return events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [workflow?.events]);

  useEffect(() => {
    if (!page) {
      return;
    }

    const formValues = createFormValues(page);
    form.reset(formValues);
    lastSnapshotRef.current = JSON.stringify(formValues);
  }, [page, form]);

  useEffect(() => {
    if (isReadOnly) {
      return;
    }

    const subscription = form.watch((values) => {
      const serialized = JSON.stringify(values);

      if (!serialized || serialized === lastSnapshotRef.current) {
        return;
      }

      if (autosaveTimer.current) {
        clearTimeout(autosaveTimer.current);
      }

      // Ensure complete values before calling toPayload
      const completeValues: PageFormValues = {
        title_en: values.title_en ?? '',
        title_ar: values.title_ar ?? '',
        blocks: (values.blocks ?? []).filter((b): b is BlockFormValue => b !== undefined).map(b => ({
          id: b.id,
          key: b.key ?? '',
          type: b.type ?? null,
          value_en: b.value_en ?? '',
          value_ar: b.value_ar ?? '',
        })),
      };
      const payload = toPayload(completeValues);
      autosaveTimer.current = setTimeout(() => {
        void saveDraft(payload, { silent: true })
          .then(() => {
            lastSnapshotRef.current = serialized;
          })
          .catch((error) => {
            const message = error instanceof Error ? error.message : 'Failed to autosave changes';
            toast({ title: 'Autosave failed', description: message, variant: 'destructive' });
          });
      }, 2000);
    });

    return () => {
      subscription.unsubscribe();
      if (autosaveTimer.current) {
        clearTimeout(autosaveTimer.current);
      }
    };
  }, [form, isReadOnly, saveDraft, toast]);

  const handleManualSave = (values: PageFormValues) => {
    if (isReadOnly) {
      toast({ title: 'You do not have permission to edit this page', variant: 'destructive' });
      return;
    }

    try {
      const missingKey = values.blocks.find((block) => !block.key.trim());
      if (missingKey) {
        toast({ title: 'Each block needs a key', description: 'Please provide a unique key for every block.', variant: 'destructive' });
        return;
      }

      const payload = toPayload(values);
      saveDraft(payload, { status: 'draft' })
        .then(() => {
          toast({ title: 'Draft saved successfully' });
          lastSnapshotRef.current = JSON.stringify(values);
        })
        .catch((error) => {
          const message = error instanceof Error ? error.message : 'Unable to save draft';
          toast({ title: 'Save failed', description: message, variant: 'destructive' });
        });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to prepare payload';
      toast({ title: 'Validation error', description: message, variant: 'destructive' });
    }
  };

  const handlePreview = async (options?: { silent?: boolean }) => {
    try {
      const values = form.getValues();
      const payload = toPayload(values);
      const data = await requestPreview(payload);
      if (!options?.silent) {
        toast({ title: 'Preview link updated' });
      }
      return data?.preview_url ?? previewHref;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to generate preview';
      if (!options?.silent) {
        toast({ title: 'Preview failed', description: message, variant: 'destructive' });
      }
      throw error;
    }
  };

  const handleOpenPreviewTab = async () => {
    try {
      await handlePreview({ silent: true });
      if (previewHref && typeof window !== 'undefined') {
        window.open(previewHref, '_blank', 'noopener');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to open preview';
      toast({ title: 'Preview failed', description: message, variant: 'destructive' });
    }
  };

  const handlePublishNow = async () => {
    if (!canPublishNow) {
      toast({ title: 'Publishing restricted', description: 'You need publish permissions to publish this page.', variant: 'destructive' });
      return;
    }

    try {
      await publishDirectly();
      toast({ title: 'Page published successfully' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to publish page';
      toast({ title: 'Publish failed', description: message, variant: 'destructive' });
    }
  };

  const handleRequestApproval = async () => {
    if (!allowEditing) {
      toast({ title: 'Request blocked', description: 'You do not have permission to request approval.', variant: 'destructive' });
      return;
    }
    try {
      await requestApproval({ draft_id: workflow?.draft_id ?? null });
      toast({ title: 'Approval requested', description: 'An administrator will review the draft shortly.' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to request approval';
      toast({ title: 'Request failed', description: message, variant: 'destructive' });
    }
  };

  const handleApprovePublish = async () => {
    if (!canApproveContent) {
      toast({ title: 'Approval restricted', description: 'You do not have permission to approve this page.', variant: 'destructive' });
      return;
    }
    try {
      await approveAndPublish({ draft_id: workflow?.draft_id ?? null });
      toast({ title: 'Changes approved and published' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to approve changes';
      toast({ title: 'Approval failed', description: message, variant: 'destructive' });
    }
  };

  const handleScheduleSubmit = async ({ scheduled_for, notes }: { scheduled_for: string; notes?: string | null }) => {
    if (!canScheduleContent) {
      toast({ title: 'Scheduling restricted', description: 'You do not have permission to schedule this page.', variant: 'destructive' });
      return;
    }
    try {
      await schedulePublish({ scheduled_for, notes: notes ?? null, draft_id: workflow?.draft_id ?? null });
      toast({ title: 'Publish scheduled', description: `Content will go live at ${formatTimestamp(scheduled_for)}` });
      setScheduleModalOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to schedule publish';
      toast({ title: 'Scheduling failed', description: message, variant: 'destructive' });
    }
  };

  const handleCancelSchedule = async () => {
    if (!canScheduleContent && !canApproveContent && !canPublishNow) {
      toast({ title: 'Cancel restricted', description: 'You do not have permission to cancel scheduled publishes.', variant: 'destructive' });
      return;
    }
    try {
      await cancelSchedule();
      toast({ title: 'Scheduled publish cancelled' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to cancel schedule';
      toast({ title: 'Cancel failed', description: message, variant: 'destructive' });
    }
  };

  if (!permissionsReady) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!hasViewAccess) {
    return (
      <div className="rounded-lg border border-dashed border-border/60 p-6 text-sm text-muted-foreground">
        You do not have permission to view this page.
      </div>
    );
  }

  if (!slug) {
    return null;
  }

  const actionsSlot = (
    <>
      {showRequestApprovalButton ? (
        <Button variant="secondary" size="sm" onClick={handleRequestApproval} disabled={isRequestingApproval || isReadOnly}>
          {isRequestingApproval ? 'Requesting…' : 'Request approval'}
        </Button>
      ) : null}
      {canApproveContent ? (
        <Button variant="secondary" size="sm" onClick={handleApprovePublish} disabled={isApproving}>
          {isApproving ? 'Approving…' : 'Approve & publish'}
        </Button>
      ) : null}
      {canScheduleContent ? (
        <Button variant="outline" size="sm" onClick={() => setScheduleModalOpen(true)} disabled={isScheduling}>
          Schedule
        </Button>
      ) : null}
      {workflowState === 'scheduled' && canScheduleContent ? (
        <Button variant="ghost" size="sm" className="text-destructive" onClick={handleCancelSchedule} disabled={isCancellingSchedule}>
          {isCancellingSchedule ? 'Cancelling…' : 'Cancel schedule'}
        </Button>
      ) : null}
    </>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-6">
        {title || description ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold text-foreground">{title}</h2>
              <WorkflowStatusBadge state={workflowState} scheduledFor={workflow?.scheduled_for ?? null} />
              {workflow?.assigned_to ? <Badge variant="outline">Reviewer: {workflow.assigned_to}</Badge> : null}
              {isReadOnly ? <Badge variant="destructive">View only</Badge> : null}
            </div>
            {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
          </div>
        ) : null}

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : null}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleManualSave)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Meta information</CardTitle>
                <CardDescription>Control localized page titles for navigation and previews.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Page title (EN)</FormLabel>
                      <Input placeholder="Optional English title" disabled={isReadOnly} {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>عنوان الصفحة (AR)</FormLabel>
                      <Input dir="rtl" placeholder="عنوان اختياري" disabled={isReadOnly} {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <BlockManager
              form={form}
              control={form.control}
              fields={fieldArray.fields}
              fieldArray={fieldArray}
              readOnly={isReadOnly}
            />

            <CardFooter className="flex flex-wrap items-center justify-end gap-3 border-t bg-muted/30 py-4">
              <Badge variant="outline">Autosaving every 2s when changes detected</Badge>
              <Button type="button" variant="outline" onClick={() => void handlePreview()} disabled={!canPreviewDraft || isPreviewing}>
                {isPreviewing ? 'Generating preview…' : 'Preview draft'}
              </Button>
              <Button type="submit" disabled={isSaving || isReadOnly}>
                {isSaving ? 'Saving…' : 'Save draft'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </div>

      <div className="space-y-6">
        <PreviewPane
          title={previewTitle}
          blocks={previewBlocks}
          status={status}
          workflowState={workflowState}
          scheduledFor={workflow?.scheduled_for ?? null}
          previewUrl={previewHref}
          isPreviewing={isPreviewing}
          isPublishing={isWorkflowPublishing}
          onPreview={() => void handlePreview()}
          onPublish={handlePublishNow}
          onOpenPreviewTab={previewHref ? handleOpenPreviewTab : undefined}
          canPreview={canPreviewDraft}
          canPublish={canPublishNow}
          actionsSlot={actionsSlot}
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Workflow timeline</CardTitle>
            <CardDescription>Track review events and publishing milestones for this page.</CardDescription>
          </CardHeader>
          <CardContent>
            {workflowEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No workflow activity recorded yet.</p>
            ) : (
              <ScrollArea className="max-h-64 pr-2">
                <div className="space-y-4">
                  {workflowEvents.map((event) => {
                    const meta = workflowEventMeta[event.type];
                    return (
                      <div key={`${event.id}-${event.timestamp}`} className="flex items-start gap-3">
                        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                          {meta?.icon ?? <Hourglass className="h-4 w-4 text-muted-foreground" />}
                        </div>
                        <div className="space-y-1">
                          <p className={cn('text-sm font-medium', meta?.tone)}>{meta?.label ?? event.type}</p>
                          <p className="text-xs text-muted-foreground">{formatTimestamp(event.timestamp)}</p>
                          {event.actor ? (
                            <p className="text-xs text-muted-foreground">by {event.actor}</p>
                          ) : null}
                          {event.notes ? <p className="text-xs text-muted-foreground">{event.notes}</p> : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Version history</CardTitle>
            <CardDescription>Review autosaved versions and published checkpoints.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground">No previous versions recorded yet.</p>
            ) : (
              history.map((entry) => (
                <div key={entry.id} className="space-y-1 rounded-lg border border-border/60 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">v{entry.version}</span>
                      <span className="text-muted-foreground">{entry.status}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatTimestamp(entry.updated_at ?? entry.created_at)}</span>
                  </div>
                  {entry.editor ? (
                    <p className="text-xs text-muted-foreground">Edited by {entry.editor}</p>
                  ) : null}
                  {entry.notes ? <p className="text-xs text-muted-foreground">{entry.notes}</p> : null}
                </div>
              ))
            )}
          </CardContent>
          <Separator />
          <CardFooter>
            <p className="text-xs text-muted-foreground">History is sourced from /api/admin/website/pages/{slug}/history.</p>
          </CardFooter>
        </Card>
      </div>

      <PublishScheduleModal
        open={scheduleModalOpen}
        onOpenChange={setScheduleModalOpen}
        onSubmit={handleScheduleSubmit}
        defaultDate={workflow?.scheduled_for ?? null}
        isSubmitting={isScheduling}
      />
    </div>
  );
};

export default PageEditor;
