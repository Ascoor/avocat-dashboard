export interface LegalDoc {
  id: number;
  path: string;
  thumbnail_path?: string;
  word_path?: string;
  pdf_path?: string;
  description?: string;
  doc_type_id: number;
  doc_sub_type_id: number;
  created_at: string;
  updated_at: string;
}
