export type AdminNotificationCategory =
  | 'approval'
  | 'publishing'
  | 'schedule'
  | 'workflow'
  | 'system'
  | 'media';

export type AdminNotificationSeverity = 'info' | 'success' | 'warning' | 'error';

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  section?: string | null;
  diffSummary?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface AdminNotification {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  severity: AdminNotificationSeverity;
  category: AdminNotificationCategory;
  read: boolean;
  meta?: Record<string, unknown>;
}

export interface AdminServerEventPayload {
  id?: string;
  type: string;
  message?: string;
  timestamp?: string;
  severity?: AdminNotificationSeverity;
  category?: AdminNotificationCategory;
  payload?: Record<string, unknown>;
  invalidateQueries?: string[];
  activity?: ActivityLogEntry;
}
