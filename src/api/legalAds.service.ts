import api from './axiosConfig';
import { LegalAd, LegalAdPayload, LegalAdType } from '@/types/legalCase';

export const getLegalAds = () => api.get<LegalAd[]>('/api/legal-ads');

export const getLegalAdsByLegCaseId = (legCaseId: string) =>
  api.get<LegalAd[]>(`/api/legal-ads/${legCaseId}`);

export const getLegalAdTypes = () =>
  api.get<LegalAdType[]>('/api/legal_ad_types');

export const createLegalAd = (data: LegalAdPayload) =>
  api.post<LegalAd>('/api/legal-ads', data);

export const updateLegalAd = (id: string, data: LegalAdPayload) =>
  api.put<LegalAd>(`/api/legal-ads/${id}`, data);

export const deleteLegalAd = (id: string) =>
  api.delete(`/api/legal-ads/${id}`);

export const createLegalAdType = (data: Omit<LegalAdType, 'id'>) =>
  api.post<LegalAdType>('/api/legal_ad_types', data);
