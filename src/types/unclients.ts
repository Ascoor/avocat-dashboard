export interface Unclient {
  id: number;
  slug: string;
  name: string;
  email?: string;
  phone_number: string;
  address?: string;
  work?: string;
  emergency_number?: string;
  date_of_birth: string;
  gender?: 'ذكر' | 'أنثى';
  religion?: 'مسلم' | 'مسيحي';
  identity_number: string;
  created_at: string;
  updated_at: string;
}
