export interface ServiceTypeOption {
  id: string;
  name: string;
}

export interface ServiceAssociation {
  id: string;
  name: string;
}

export interface ServiceRecord {
  id: number;
  slug: string;
  description: string;
  service_place_name: string;
  service_year: string;
  status: string;
  service_type?: ServiceTypeOption;
  service_type_id?: string;
  clients?: ServiceAssociation[];
  unclients?: ServiceAssociation[];
  created_at?: string;
  updated_at?: string;
}

export interface ServiceFormInput {
  slug: string;
  service_type_id: string;
  description: string;
  service_place_name: string;
  service_year: string;
  status: string;
  client_id?: string | null;
  unclient_id?: string | null;
  created_by?: number | string;
  updated_by?: number | string;
}

export type ServiceDialogMode = 'create' | 'edit' | 'view';
