import api from './axiosConfig';
import {
  LegalSession,
  LegalSessionPayload,
  LegalSessionType,
} from '@/types/legalCase';

export const getAllSessions = () =>
  api.get<LegalSession[]>('/api/legal_sessions');

export const getSessionsByLegCaseId = (legCaseId: string) =>
  api.get<{ data: LegalSession[] }>(`/api/legal_sessions/leg-case/${legCaseId}`);

export const getLegalSessionTypes = () =>
  api.get<LegalSessionType[]>('/api/legal_session_types/');

export const getSessionsByCourtId = (courtId: string) =>
  api.get<LegalSession[]>(`/api/legal_sessions/court/${courtId}`);

export const getSessionsByLawyerId = (lawyerId: string) =>
  api.get<LegalSession[]>(`/api/legal_sessions/lawyer/${lawyerId}`);

export const createSession = (sessionData: LegalSessionPayload) =>
  api.post<LegalSession>('/api/legal_sessions', sessionData);

export const updateSession = (id: string, sessionData: LegalSessionPayload) =>
  api.put<LegalSession>(`/api/legal_sessions/${id}`, sessionData);

export const deleteSession = (id: string) =>
  api.delete(`/api/legal_sessions/${id}`);
