export interface PowerOfAttorney {
  id: number;
  attorney_num: string;
  attorney_date: string;
  attorney_chart: string;
  attorney_place: string;
  title: string;
  description?: string;
  client_id: number;
  lawyer_insert: string;
  image?: string;
  created_by: number;
  updated_by?: number;
  created_at: string;
  updated_at: string;
  attorney_type_id: number;
}
