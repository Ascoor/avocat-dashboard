import api from '@/api/axiosConfig';
import { isAxiosError } from 'axios';
import type {
  AchievementApi,
  ArticleApi,
  Localized,
  PageContent,
  PageHistoryEntry,
  PageStatus,
  PublishingQueueItem,
  TeamMemberApi,
  TestimonialApi,
  WebsiteReportSummary,
  WorkflowState,
} from '@/types/website';
import type { ActivityLogEntry } from '@/types/notifications';

const unwrap = <T>(payload: unknown): T => {
  if (payload && typeof payload === 'object' && 'data' in (payload as Record<string, unknown>)) {
    return (payload as Record<string, unknown>).data as T;
  }

  return payload as T;
};

const hasValidSessionToken = (): boolean => {
  try {
    const storedToken = sessionStorage.getItem('token');
    if (!storedToken) {
      return false;
    }

    const parsed = JSON.parse(storedToken) as unknown;
    return typeof parsed === 'string' && parsed.length > 0;
  } catch (error) {
    console.warn('Failed to read auth token from sessionStorage', error);
    return false;
  }
};

const unwrapCollection = <T>(payload: unknown): T[] => {
  const data = unwrap<unknown>(payload);
  if (Array.isArray(data)) {
    return data as T[];
  }

  return [];
};

export interface AdminContentBlockPayload {
  key: string;
  type?: string | null;
  value: Localized<unknown>;
}

export interface PageUpdatePayload {
  title_en?: string | null;
  title_ar?: string | null;
  content_blocks?: AdminContentBlockPayload[];
  status?: PageStatus | null;
  workflow_state?: WorkflowState | null;
}

export interface WorkflowRequestPayload {
  notes?: string | null;
  draft_id?: string | null;
}

export interface SchedulePayload extends WorkflowRequestPayload {
  scheduled_for: string;
}

export const listWebsitePages = async (): Promise<PageContent[]> => {
  const { data } = await api.get('/api/admin/website/pages');
  return unwrapCollection<PageContent>(data);
};

export const getWebsitePage = async (slug: string): Promise<PageContent> => {
  const { data } = await api.get(`/api/admin/website/pages/${slug}`);
  return unwrap<PageContent>(data);
};

export const updateWebsitePage = async (slug: string, payload: PageUpdatePayload): Promise<PageContent> => {
  const { data } = await api.put(`/api/admin/website/pages/${slug}`, payload);
  return unwrap<PageContent>(data);
};

export const previewWebsitePage = async (slug: string, payload?: PageUpdatePayload): Promise<PageContent> => {
  const { data } = await api.post(`/api/admin/website/pages/${slug}/preview`, payload ?? {});
  return unwrap<PageContent>(data);
};

export const publishWebsitePage = async (slug: string): Promise<PageContent> => {
  const { data } = await api.post(`/api/admin/website/pages/${slug}/publish`);
  return unwrap<PageContent>(data);
};

export const publishAllWebsitePages = async (): Promise<void> => {
  await api.post('/api/admin/website/pages/publish-all');
};

export const requestPageApproval = async (slug: string, payload: WorkflowRequestPayload): Promise<PageContent> => {
  const { data } = await api.post(`/api/admin/website/pages/${slug}/request-approval`, payload);
  return unwrap<PageContent>(data);
};

export const approveWebsitePage = async (slug: string, payload?: WorkflowRequestPayload): Promise<PageContent> => {
  const { data } = await api.post(`/api/admin/website/pages/${slug}/approve`, payload ?? {});
  return unwrap<PageContent>(data);
};

export const scheduleWebsitePage = async (slug: string, payload: SchedulePayload): Promise<PageContent> => {
  const { data } = await api.post(`/api/admin/website/pages/${slug}/schedule`, payload);
  return unwrap<PageContent>(data);
};

export const cancelScheduledWebsitePage = async (slug: string): Promise<PageContent> => {
  const { data } = await api.delete(`/api/admin/website/pages/${slug}/schedule`);
  return unwrap<PageContent>(data);
};

export const getPublishingQueue = async (): Promise<PublishingQueueItem[]> => {
  const { data } = await api.get('/api/admin/website/pages/publishing-queue');
  return unwrapCollection<PublishingQueueItem>(data);
};

export const getWebsitePageHistory = async (slug: string): Promise<PageHistoryEntry[]> => {
  const { data } = await api.get(`/api/admin/website/pages/${slug}/history`);
  return unwrapCollection<PageHistoryEntry>(data);
};

export interface UploadMediaResult {
  url: string;
  size: number;
  filename?: string;
  mime_type?: string;
}

export const uploadWebsiteMedia = async (file: File): Promise<UploadMediaResult> => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await api.post('/api/website/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return unwrap<UploadMediaResult>(data);
};

export const getWebsiteReport = async (): Promise<WebsiteReportSummary> => {
  const { data } = await api.get('/api/admin/website/report');
  return unwrap<WebsiteReportSummary>(data);
};

export const getActivityLog = async (params?: { limit?: number }): Promise<ActivityLogEntry[]> => {
  if (!hasValidSessionToken()) {
    const { data } = await api.get('/api/website/activity', { params });
    return unwrapCollection<ActivityLogEntry>(data);
  }

  try {
    const { data } = await api.get('/api/admin/website/activity', { params });
    return unwrapCollection<ActivityLogEntry>(data);
  } catch (error) {
    if (isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
      const { data } = await api.get('/api/website/activity', { params });
      return unwrapCollection<ActivityLogEntry>(data);
    }

    throw error;
  }
};

export const getWebsiteSettings = async (): Promise<PageContent> => getWebsitePage('settings');

export interface TeamMemberInput {
  name_ar: string;
  name_en: string;
  position_ar: string;
  position_en: string;
  bio_ar?: string | null;
  bio_en?: string | null;
  highlights_ar?: string[];
  highlights_en?: string[];
  image?: string | null;
}

export const listTeamMembers = async (): Promise<TeamMemberApi[]> => {
  const { data } = await api.get('/api/admin/website/team');
  return unwrapCollection<TeamMemberApi>(data);
};

export const createTeamMember = async (payload: TeamMemberInput): Promise<TeamMemberApi> => {
  const { data } = await api.post('/api/admin/website/team', payload);
  return unwrap<TeamMemberApi>(data);
};

export const updateTeamMember = async (id: number, payload: TeamMemberInput): Promise<TeamMemberApi> => {
  const { data } = await api.put(`/api/admin/website/team/${id}`, payload);
  return unwrap<TeamMemberApi>(data);
};

export const deleteTeamMember = async (id: number): Promise<void> => {
  await api.delete(`/api/admin/website/team/${id}`);
};

export interface AchievementInput {
  title_ar: string;
  title_en: string;
  number?: number | null;
}

export const listAchievements = async (): Promise<AchievementApi[]> => {
  const { data } = await api.get('/api/admin/website/achievements');
  return unwrapCollection<AchievementApi>(data);
};

export const createAchievement = async (payload: AchievementInput): Promise<AchievementApi> => {
  const { data } = await api.post('/api/admin/website/achievements', payload);
  return unwrap<AchievementApi>(data);
};

export const updateAchievement = async (id: number, payload: AchievementInput): Promise<AchievementApi> => {
  const { data } = await api.put(`/api/admin/website/achievements/${id}`, payload);
  return unwrap<AchievementApi>(data);
};

export const deleteAchievement = async (id: number): Promise<void> => {
  await api.delete(`/api/admin/website/achievements/${id}`);
};

export interface ArticleInput {
  title_en: string;
  title_ar: string;
  summary_en?: string | null;
  summary_ar?: string | null;
  body_en: string;
  body_ar: string;
  tag_en?: string | null;
  tag_ar?: string | null;
  cover_image?: string | null;
}

export const listArticles = async (): Promise<ArticleApi[]> => {
  const { data } = await api.get('/api/admin/website/articles');
  return unwrapCollection<ArticleApi>(data);
};

export const createArticle = async (payload: ArticleInput): Promise<ArticleApi> => {
  const { data } = await api.post('/api/admin/website/articles', payload);
  return unwrap<ArticleApi>(data);
};

export const updateArticle = async (id: number, payload: ArticleInput): Promise<ArticleApi> => {
  const { data } = await api.put(`/api/admin/website/articles/${id}`, payload);
  return unwrap<ArticleApi>(data);
};

export const deleteArticle = async (id: number): Promise<void> => {
  await api.delete(`/api/admin/website/articles/${id}`);
};

export interface TestimonialInput {
  name_en: string;
  name_ar: string;
  quote_en: string;
  quote_ar: string;
  position_en?: string | null;
  position_ar?: string | null;
  avatar?: string | null;
}

export const listTestimonials = async (): Promise<TestimonialApi[]> => {
  const { data } = await api.get('/api/admin/website/testimonials');
  return unwrapCollection<TestimonialApi>(data);
};

export const createTestimonial = async (payload: TestimonialInput): Promise<TestimonialApi> => {
  const { data } = await api.post('/api/admin/website/testimonials', payload);
  return unwrap<TestimonialApi>(data);
};

export const updateTestimonial = async (id: number, payload: TestimonialInput): Promise<TestimonialApi> => {
  const { data } = await api.put(`/api/admin/website/testimonials/${id}`, payload);
  return unwrap<TestimonialApi>(data);
};

export const deleteTestimonial = async (id: number): Promise<void> => {
  await api.delete(`/api/admin/website/testimonials/${id}`);
};
