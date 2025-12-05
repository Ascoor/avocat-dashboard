export interface PersonalAccessToken {
  id: number;
  tokenable_type: string;
  tokenable_id: number;
  name: string;
  token: string;
  abilities?: string;
  last_used_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}
