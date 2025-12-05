// ----------------------
// أنواع فرعية
// ----------------------
export interface Client {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  slug?: string;
}

export interface Court {
  id: string;
  name: string;
  city?: string;
  department?: string;
  case_number?: string;
  case_year?: string;
  court_level_id?: string;
  court_level?: {
    id: string;
    name: string;
  };
}

export interface Lawyer {
  id: string;
  name: string;
  licenseNo?: string;
  phone?: string;
}

export interface CaseSubType {
  id: string;
  name: string;
  case_type_id?: string;
}

export interface CaseType {
  id: string;
  name: string;
  description?: string;
  case_sub_types?: CaseSubType[];
}

// ----------------------
// القضايا
// ----------------------
export interface LegalCase {
  id: string;
  slug: string; // رقم الملف
  title: string; // موضوع القضية
  description?: string;
  status: string; // الحالة
  client_capacity?: string; // صفة الموكل
  case_type_id?: string;
  case_sub_type_id?: string;
  case_type?: CaseType;
  case_sub_type?: CaseSubType;
  clients?: Client[];
  courts?: Court[];
  lawyers?: Lawyer[];
  litigants_name?: string;
  litigants_phone?: string;
  litigants_lawyer_name?: string;
  litigants_lawyer_phone?: string;
  created_by?: string;
  updated_by?: string;
  createdAt?: string;
  updatedAt?: string;
}

// DTOs (Data Transfer Objects) لعمليات CRUD
export interface LegalCaseCreateDTO {
  slug: string;
  title: string;
  description?: string;
  client_capacity?: string;
  case_type_id?: string;
  case_sub_type_id?: string;
  clients?: string[];
  courts?: string[];
  lawyers?: string[];
  litigants_name?: string;
  litigants_phone?: string;
  litigants_lawyer_name?: string;
  litigants_lawyer_phone?: string;
  created_by?: string;
}

export interface LegalCaseUpdateDTO extends Partial<LegalCaseCreateDTO> {
  updated_by?: string;
}

// ----------------------
// الإجراءات
// ----------------------
export interface ProcedureType {
  id: string;
  name: string;
}

export interface ProcedurePlaceType {
  id: string;
  name: string;
}

export interface Procedure {
  id: string;
  job: string;
  date_start?: string;
  date_end?: string;
  cost?: number;
  cost2?: number;
  cost3?: number;
  status?: string;
  result?: string;
  procedure_type_id?: string;
  procedure_place_type_id?: string;
  procedure_place_name?: string;
  lawyer_id?: string;
  leg_case_id?: string;
  created_by?: string;
  updated_by?: string;
  lawyer?: Lawyer;
  procedure_type?: ProcedureType;
  procedure_place_type?: ProcedurePlaceType;
}

export type ProcedurePayload = Omit<Procedure, 'id' | 'lawyer' | 'procedure_type'>;

// ----------------------
// الجلسات
// ----------------------
export interface LegalSessionType {
  id: string;
  name: string;
}

export interface LegalSession {
  id: string;
  session_date?: string;
  session_roll?: string;
  cost1?: number;
  cost2?: number;
  cost3?: number;
  court_id?: string;
  court_department?: string;
  legal_session_type_id?: string;
  lawyer_id?: string;
  result?: string;
  orders?: string;
  notes?: string;
  status?: string;
  Judgment_operative?: string;
  leg_case_id?: string;
  created_by?: string;
  updated_by?: string;
  court?: Court;
  lawyer?: Lawyer;
  legal_session_type?: LegalSessionType;
}

export type LegalSessionPayload = Omit<LegalSession, 'id' | 'court' | 'lawyer' | 'legal_session_type'>;

// ----------------------
// الإعلانات القانونية
// ----------------------
export interface LegalAdType {
  id: string;
  name: string;
}

export interface LegalAd {
  id: string;
  legal_ad_type_id?: string;
  leg_case_id?: string;
  number?: string;
  date?: string;
  details?: string;
  status?: string;
  description?: string;
  send_date?: string;
  receive_date?: string;
  lawyer_send?: Lawyer;
  lawyer_receive?: Lawyer;
  created_by?: string;
  updated_by?: string;
  legal_ad_type?: LegalAdType;
}

export type LegalAdPayload = Omit<LegalAd, 'id' | 'legal_ad_type'>;
