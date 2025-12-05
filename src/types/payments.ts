export interface Payment {
  id: number;
  invoice_id: number;
  payment_date: string;
  payment_method: 'Cash' | 'Card' | 'Bank Transfer';
  amount: number;
  created_at: string;
  updated_at: string;
}
