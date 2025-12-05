export interface Job {
  id: number;
  queue: string;
  payload: string;
  attempts: number;
  reserved_at?: number;
  available_at: number;
  created_at: number;
}
