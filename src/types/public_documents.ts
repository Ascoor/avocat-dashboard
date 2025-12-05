export interface PublicDocument {
  id: number;
  title: string;
  description?: string;
  service_id?: number;
  file_path: string;
  created_at: string;
  updated_at: string;
  leg_case_id?: number;
}
