import type { ReactNode } from 'react';
import { ExternalLink, Play, Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ContentBlock, Localized, PageStatus, WorkflowState } from '@/types/website';

import PreviewLandingSection from '../PreviewLandingSection';
import WorkflowStatusBadge from '../WorkflowStatusBadge';

interface PreviewPaneProps {
  title?: Localized<string | null>;
  blocks: ContentBlock[];
  status: PageStatus;
  workflowState?: WorkflowState;
  scheduledFor?: string | null;
  isPreviewing?: boolean;
  isPublishing?: boolean;
  previewUrl?: string | null;
  onPreview?: () => void;
  onPublish?: () => void;
  onOpenPreviewTab?: () => void;
  canPublish?: boolean;
  canPreview?: boolean;
  actionsSlot?: ReactNode;
}

const getStatusMeta = (status: PageStatus) => {
  switch (status) {
    case 'published':
      return { label: 'Published', tone: 'bg-emerald-100 text-emerald-800', icon: '🟢' };
    case 'preview':
      return { label: 'Preview', tone: 'bg-blue-100 text-blue-800', icon: '🔵' };
    case 'unlinked':
      return { label: 'Unlinked', tone: 'bg-red-100 text-red-800', icon: '🔴' };
    default:
      return { label: 'Draft', tone: 'bg-amber-100 text-amber-800', icon: '🟡' };
  }
};

const PreviewPane: React.FC<PreviewPaneProps> = ({
  title,
  blocks,
  status,
  workflowState,
  scheduledFor,
  isPreviewing,
  isPublishing,
  previewUrl,
  onPreview,
  onPublish,
  onOpenPreviewTab,
  canPublish = true,
  canPreview = true,
  actionsSlot,
}) => {
  const statusMeta = getStatusMeta(status);

  return (
    <Card className="h-full bg-background/60 backdrop-blur dark:bg-muted/40">
      <CardHeader className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg font-semibold">Live preview</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={`${statusMeta.tone} font-medium`}>{statusMeta.icon} {statusMeta.label}</Badge>
            {workflowState ? <WorkflowStatusBadge state={workflowState} scheduledFor={scheduledFor} /> : null}
          </div>
        </div>
        <CardDescription>Review localized content before sharing changes with the world.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs defaultValue="en" className="space-y-4">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="ar">العربية</TabsTrigger>
          </TabsList>

          <TabsContent value="en" className="space-y-3">
            <PreviewLandingSection locale="en" title={title?.en ?? ''} blocks={blocks} />
          </TabsContent>

          <TabsContent value="ar" className="space-y-3">
            <div dir="rtl">
              <PreviewLandingSection locale="ar" title={title?.ar ?? ''} blocks={blocks} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <Separator />

      <CardFooter className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
          {previewUrl ? (
            <a
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" /> Preview link
            </a>
          ) : (
            <span>Preview links are generated when you request a preview.</span>
          )}
          {onOpenPreviewTab ? (
            <Button variant="link" className="h-auto w-fit p-0 text-sm" onClick={onOpenPreviewTab} disabled={!previewUrl}>
              Open preview in new tab
            </Button>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:justify-end">
          {actionsSlot}
          {canPreview ? (
            <Button variant="outline" size="sm" onClick={onPreview} disabled={isPreviewing}>
              <Play className="mr-2 h-4 w-4" />
              {isPreviewing ? 'Generating…' : 'Preview changes'}
            </Button>
          ) : null}
          {canPublish ? (
            <Button size="sm" onClick={onPublish} disabled={isPublishing}>
              <Send className="mr-2 h-4 w-4" />
              {isPublishing ? 'Publishing…' : 'Publish now'}
            </Button>
          ) : null}
        </div>
      </CardFooter>
    </Card>
  );
};

export default PreviewPane;
