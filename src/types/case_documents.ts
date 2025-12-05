export interface CaseDocument {
  id: number;
  leg_case_id: number;
  client_id?: number;
  unclient_id?: number;
  description: string;
  file_path: string;
  created_at: string;
  updated_at: string;
}
