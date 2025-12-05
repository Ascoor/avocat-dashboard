export interface LegalSession {
  id: number;
  court_session?: string;
  legal_session_type_id: string;
  leg_case_id: string;
  court_id: string;
  session_date: string;
  cost1?: number;
  cost2?: number;
  cost3?: number;
  session_roll?: string;
  Judgment_operative?: string;
  status: 'تمت' | 'لم ينفذ' | 'جارى التنفيذ';
  lawyer_id: string;
  orders?: string;
  result?: string;
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}
