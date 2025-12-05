export interface Lawyer {
  id: number;
  name: string;
  birthdate: string;
  identity_number: string;
  law_reg_num: string;
  lawyer_class: 'نقض' | 'إستئناف' | 'إبتدائي' | 'جدول عام';
  email: string;
  phone_number?: string;
  gender: 'ذكر' | 'أنثى';
  address?: string;
  religion: 'مسلم' | 'مسيحى';
  user_id?: number;
  created_at: string;
  updated_at: string;
}
