import api from './axiosConfig';
import { Court } from '@/types/legalCase';

export const getCourts = () => api.get<Court[]>('/api/courts');

export const getCourtById = (id: string) =>
  api.get<Court>(`/api/courts/${id}`);

export const createCourt = (data: Omit<Court, 'id'>) =>
  api.post<Court>('/api/courts', data);

export const updateCourt = (id: string, data: Partial<Court>) =>
  api.put<Court>(`/api/courts/${id}`, data);

export const deleteCourt = (id: string) =>
  api.delete(`/api/courts/${id}`);
