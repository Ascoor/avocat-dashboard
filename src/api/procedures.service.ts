import api from './axiosConfig';
import {
  Procedure,
  ProcedurePayload,
  ProcedureType,
  ProcedurePlaceType,
} from '@/types/legalCase';

export const getProcedures = () => api.get<Procedure[]>('/api/procedures');

export const getProcedureById = (id: string) =>
  api.get<Procedure>(`/api/procedures/${id}`);

export const createProcedure = (data: ProcedurePayload) =>
  api.post<Procedure>('/api/procedures', data);

export const updateProcedure = (id: string, data: ProcedurePayload) =>
  api.put<Procedure>(`/api/procedures/${id}`, data);

export const deleteProcedure = (id: string) =>
  api.delete(`/api/procedures/${id}`);

export const getProceduresByLegCaseId = (legCaseId: string) =>
  api.get<Procedure[]>(`/api/procedures/leg-case/${legCaseId}`);

export const getProcedureTypes = () =>
  api.get<ProcedureType[]>('/api/procedure_types');

export const getProcedurePlaceTypes = () =>
  api.get<ProcedurePlaceType[]>('/api/procedure_place_types');
