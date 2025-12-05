export interface LegCase {
  id: number;
  is_deleted: boolean;
  slug: string;
  title?: string;
  description?: string;
  fees?: number;
  total_expenses?: number;
  total_payments?: number;
  expenses?: number;
  case_type_id: string;
  case_sub_type_id: string;
  created_by: number;
  updated_by?: number;
  litigants_name?: string;
  litigants_address?: string;
  litigants_phone?: string;
  litigants_lawyer_name?: string;
  litigants_lawyer_phone?: string;
  client_capacity: 'مدعى عليه' | 'مجنى عليه' | 'مدعى' | 'متهم';
  status: 'قيد التجهيز' | 'متداولة' | 'منتهية' | 'معلقة';
  created_at: string;
  updated_at: string;
}
