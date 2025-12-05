export interface ServiceDocument {
  id: number;
  service_id: number;
  client_id?: number;
  file_path: string;
  created_at: string;
  updated_at: string;
}
