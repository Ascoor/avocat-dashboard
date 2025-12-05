export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  role: '1' | '2' | '3';
  password: string;
  remember_token?: string;
  created_at: string;
  updated_at: string;
}
