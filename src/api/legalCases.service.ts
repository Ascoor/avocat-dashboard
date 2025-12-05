import api from './axiosConfig';
import {
  LegalCase,
  LegalCaseCreateDTO,
  LegalCaseUpdateDTO,
  CaseType,
  CaseSubType,
} from '@/types/legalCase';

// ----------------------
// CRUD القضايا
// ----------------------
export const getLegCases = () => api.get<LegalCase[]>('/api/legal-cases');

export const getLegCaseById = (id: string) =>
  api.get<{ leg_case: LegalCase }>(`/api/legal-cases/${id}`);

export const createLegCase = (data: LegalCaseCreateDTO) =>
  api.post<LegalCase>('/api/legal-cases', data);

export const updateLegCase = (id: string, data: LegalCaseUpdateDTO) =>
  api.put<LegalCase>(`/api/legal-cases/${id}`, data);

export const deleteLegCase = (id: string) =>
  api.delete(`/api/legal-cases/${id}`);

export const searchLegCase = (query: string) =>
  api.get<LegalCase[]>(`/api/legal-case-search`, { params: { query } });

// ----------------------
// علاقات (Clients, Courts, Lawyers)
// ----------------------
export const addLegalCaseClients = (
  caseId: string,
  clients: Array<{ client_id: string }>,
) => api.post(`/api/legal-cases/${caseId}/add_clients`, { clients });

export const removeLegalCaseClient = (caseId: string, clientId: string) =>
  api.delete(`/api/legal-cases/${caseId}/clients/${clientId}`);

export const addLegalCaseCourts = (
  caseId: string,
  courts: Array<{
    case_number: string;
    case_year: string;
    court_level_id: string;
    court_id: string;
  }>,
) => api.post(`/api/legal-cases/add_courts`, { leg_case_id: caseId, courts });

export const removeLegalCaseCourt = (caseId: string, courtId: string) =>
  api.delete(`/api/leg-case/remove-court`, {
    data: { leg_case_id: caseId, court_id: courtId },
  });

// ----------------------
// أنواع القضايا
// ----------------------
export const getCaseTypes = () => api.get<CaseType[]>('/api/case_types');

export const getCaseTypeById = (id: string) =>
  api.get<CaseType>(`/api/case_types/${id}`);

export const createCaseType = (data: Omit<CaseType, 'id'>) =>
  api.post<CaseType>('/api/case_types', data);

export const updateCaseType = (id: string, data: Partial<CaseType>) =>
  api.put<CaseType>(`/api/case_types/${id}`, data);

export const deleteCaseType = (id: string) =>
  api.delete(`/api/case_types/${id}`);

// ----------------------
// الأنواع الفرعية للقضايا
// ----------------------
export const getCaseSubTypes = () => api.get<CaseSubType[]>('/api/case_sub_types');

export const getCaseSubTypeById = (id: string) =>
  api.get<CaseSubType>(`/api/case_sub_types/${id}`);

export const createCaseSubType = (data: Omit<CaseSubType, 'id'>) =>
  api.post<CaseSubType>('/api/case_sub_types', data);

export const updateCaseSubType = (id: string, data: Partial<CaseSubType>) =>
  api.put<CaseSubType>(`/api/case_sub_types/${id}`, data);

export const deleteCaseSubType = (id: string) =>
  api.delete(`/api/case_sub_types/${id}`);
