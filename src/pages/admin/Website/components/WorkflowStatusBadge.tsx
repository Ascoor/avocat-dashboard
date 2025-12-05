import type { ReactNode } from 'react';
import { CalendarClock, CheckCircle2, Clock, Hourglass } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { WorkflowState } from '@/types/website';

const workflowMeta: Record<WorkflowState, { label: string; tone: string; icon: ReactNode }> = {
  draft: { label: 'Draft', tone: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-100', icon: <Clock className="h-3.5 w-3.5" /> },
  pendingReview: {
    label: 'Pending review',
    tone: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-100',
    icon: <Hourglass className="h-3.5 w-3.5" />,
  },
  scheduled: {
    label: 'Scheduled',
    tone: 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-100',
    icon: <CalendarClock className="h-3.5 w-3.5" />,
  },
  published: {
    label: 'Published',
    tone: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-100',
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
};

interface WorkflowStatusBadgeProps {
  state?: WorkflowState;
  scheduledFor?: string | null;
  className?: string;
}

const WorkflowStatusBadge: React.FC<WorkflowStatusBadgeProps> = ({ state = 'draft', scheduledFor, className }) => {
  const meta = workflowMeta[state];
  const scheduledSuffix = state === 'scheduled' && scheduledFor ? ` · ${new Date(scheduledFor).toLocaleString()}` : '';

  return (
    <Badge className={cn('flex items-center gap-1.5', meta.tone, className)}>
      {meta.icon}
      <span className="text-xs font-medium">{meta.label}</span>
      {scheduledSuffix ? <span className="text-[10px] font-normal opacity-80">{scheduledSuffix}</span> : null}
    </Badge>
  );
};

export default WorkflowStatusBadge;
