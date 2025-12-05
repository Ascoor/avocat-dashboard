export interface ServiceProcedure {
  id: number;
  service_id?: number;
  title?: string;
  lawyer_id: number;
  job?: string;
  procedure_place_name?: string;
  procedure_place_type_id?: number;
  result?: string;
  note?: string;
  status: 'تمت' | 'لم ينفذ' | 'جارى التنفيذ';
  event_id?: number;
  date_start: string;
  date_end: string;
  cost1?: number;
  cost2?: number;
  cost3?: number;
  created_by: number;
  updated_by?: number;
  created_at: string;
  updated_at: string;
}
