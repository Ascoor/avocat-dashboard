export interface Revenue {
  id: number;
  client_id?: number;
  service_id?: number;
  leg_case_id?: number;
  amount: number;
  from_client: boolean;
  from_unclients: boolean;
  created_at: string;
  updated_at: string;
}
