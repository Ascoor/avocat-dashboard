export interface LegalAd {
  id: number;
  description: string;
  results?: string;
  send_date: string;
  receive_date?: string;
  lawyer_send_id: string;
  legal_ad_type_id: number;
  lawyer_receive_id?: string;
  status: 'قيد التجهيز' | 'تم التسليم' | 'تم الإستلام';
  leg_case_id: number;
  court_id: number;
  cost1?: number;
  cost2?: number;
  cost3?: number;
  created_by: number;
  updated_by?: number;
  created_at: string;
  updated_at: string;
}
