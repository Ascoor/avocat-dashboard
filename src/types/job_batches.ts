export interface JobBatch {
  id: string;
  name: string;
  total_jobs: number;
  pending_jobs: number;
  failed_jobs: number;
  failed_job_ids: string;
  options?: string;
  cancelled_at?: number;
  created_at: number;
  finished_at?: number;
}
