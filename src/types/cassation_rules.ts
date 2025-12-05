export interface CassationRule {
  id: number;
  appeal_type_id: number;
  appeal_sub_type_id: number;
  appeal_number: string;
  appeal_year: string;
  session_date: string;
  cassation_rule_subjects_id: number;
  legal_summary?: string;
  created_at: string;
  updated_at: string;
}
