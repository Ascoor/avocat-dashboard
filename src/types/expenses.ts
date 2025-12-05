export interface Expense {
  id: number;
  service_id?: number;
  leg_case_id?: number;
  created_by?: number;
  legal_session_id?: number;
  expense_category_id: number;
  client_id?: number;
  unclients_id?: number;
  description?: string;
  note?: string;
  expense_date?: string;
  amount?: Record<string, any>;
  created_at: string;
  updated_at: string;
}
