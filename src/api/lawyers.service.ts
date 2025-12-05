import api from './axiosConfig';
import { Lawyer } from '@/types/lawyers';

export type LawyerPayload = {
  name: string;
  birthdate: string;
  identity_number: string;
  law_reg_num: string;
  lawyer_class: Lawyer['lawyer_class'];
  email: string;
  phone_number?: string;
  gender: Lawyer['gender'];
  address?: string;
  religion: Lawyer['religion'];
};

export const getLawyers = () => api.get<Lawyer[]>('/api/lawyers');

export const getLawyerById = (id: string) =>
  api.get<Lawyer>(`/api/lawyers/${id}`);

export const createLawyer = (data: LawyerPayload) =>
  api.post<Lawyer>('/api/lawyers', data);

export const updateLawyer = (id: string, data: Partial<LawyerPayload>) =>
  api.put<Lawyer>(`/api/lawyers/${id}`, data);

export const deleteLawyer = (id: string) =>
  api.delete(`/api/lawyers/${id}`);
