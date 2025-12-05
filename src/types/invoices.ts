export interface Invoice {
  id: number;
  leg_case_id?: number;
  service_id?: number;
  invoice_number: string;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
  issue_date: string;
  due_date: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
}
