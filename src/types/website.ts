export type Locale = 'ar' | 'en';

export interface Localized<T> {
  ar: T | null;
  en: T | null;
}

export interface ContentBlock<T = unknown> {
  id?: number;
  key: string;
  type: string | null;
  value: Localized<T>;
}

export type Role = 'Admin' | 'Editor' | 'Viewer';

export type Permission =
  | 'pages:view'
  | 'pages:edit'
  | 'pages:publish'
  | 'pages:approve'
  | 'pages:schedule'
  | 'pages:bulk-publish'
  | 'media:upload'
  | 'analytics:view';

export type WorkflowState = 'draft' | 'pendingReview' | 'scheduled' | 'published';

export type PageStatus = 'draft' | 'preview' | 'published' | 'unlinked';

export interface WorkflowEvent {
  id: string;
  type: 'submitted' | 'reviewed' | 'approved' | 'rejected' | 'published' | 'scheduled' | 'cancelled';
  actor?: string | null;
  timestamp: string;
  notes?: string | null;
}

export interface PageWorkflowMeta {
  state: WorkflowState;
  assigned_to?: string | null;
  scheduled_for?: string | null;
  draft_id?: string | null;
  events?: WorkflowEvent[];
}

export interface PageContent {
  id: number;
  slug: string;
  title: Localized<string | null>;
  content_blocks: ContentBlock[];
  content: ContentBlock[];
  status?: PageStatus;
  draft_updated_at?: string | null;
  published_at?: string | null;
  preview_url?: string | null;
  last_edited_by?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  workflow?: PageWorkflowMeta | null;
}

export interface PageHistoryEntry {
  id: number;
  version: number;
  status: PageStatus;
  created_at: string;
  updated_at?: string | null;
  editor?: string | null;
  notes?: string | null;
}

export interface PublishingQueueItem {
  slug: string;
  title: string;
  state: WorkflowState;
  draft_id?: string | null;
  scheduled_for?: string | null;
  last_updated?: string | null;
  submitted_by?: string | null;
  approved_by?: string | null;
  progress?: number;
}

export interface WebsiteReportSection {
  slug: string;
  title: string;
  status: PageStatus;
  completion: number;
  updated_at: string | null;
  edit_frequency?: number;
  pending_approvals?: number;
}

export interface WebsiteReportSummary {
  completionRate: number;
  completedPages: number;
  totalPages: number;
  pendingDrafts: number;
  lastEditedAt: string | null;
  apiHealthy: boolean;
  sections: WebsiteReportSection[];
  editFrequencyPerPage?: Array<{ slug: string; edits: number }>;
  timeSinceLastPublish?: Array<{ slug: string; minutes: number }>;
  pendingApprovals?: number;
  mediaStorageUsage?: { used: number; quota: number } | null;
}

export interface TeamMemberApi {
  id: number;
  name: Localized<string>;
  position: Localized<string>;
  bio: Localized<string | null>;
  highlights: Localized<string[]>;
  image: string | null;
}

export interface AchievementApi {
  id: number;
  title: Localized<string>;
  number: number;
}

export interface TestimonialApi {
  id: number;
  name: Localized<string>;
  quote: Localized<string>;
  position: Localized<string | null>;
  avatar: string | null;
}

export interface ArticleApi {
  id: number;
  title: Localized<string>;
  tag: Localized<string | null>;
  summary: Localized<string | null>;
  body: Localized<string>;
  slug: string;
  cover_image: string | null;
}
