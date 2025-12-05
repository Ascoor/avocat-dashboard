export type ClientFormMode = 'create' | 'edit' | 'view';

export interface Client {
  id: number;
  slug: string;
  name: string;
  email?: string;
  phone_number?: string;
  address: string;
  nationality?: string;
  work?: string;
  emergency_number?: string;
  date_of_birth?: string;
  gender: 'ذكر' | 'أنثى';
  religion: 'مسلم' | 'مسيحي';
  identity_number?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}
