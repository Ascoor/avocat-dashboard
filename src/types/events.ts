export interface Event {
  id: number;
  user_id: number;
  date: string;
  title?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}
