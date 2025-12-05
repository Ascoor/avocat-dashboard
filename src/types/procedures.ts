export interface Procedure {
  id: number;
  procedure_type_id: string;
  leg_case_id: string;
  procedure_place_name?: string;
  procedure_place_type_id?: number;
  lawyer_id?: string;
  job: string;
  result?: string;
  note?: string;
  status: 'تمت' | 'لم ينفذ' | 'جاري التنفيذ';
  event_id?: number;
  date_start?: string;
  date_end?: string;
  cost1?: number;
  cost2?: number;
  cost3?: number;
  created_by: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}
