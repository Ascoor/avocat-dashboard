export interface Service {
  id: number;
  slug: string;
  description?: string;
  service_place_name?: string;
  service_year?: string;
  created_by: number;
  updated_by?: number;
  created_at: string;
  updated_at: string;
  status: 'قيد التنفيذ' | 'جارى التنفيذ' | 'منتهية' | 'متداولة' | 'استيفاء';
  service_type_id: string;
}
