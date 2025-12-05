import api from './axiosConfig';
import type {
  ServiceRecord,
  ServiceFormInput,
  ServiceTypeOption,
} from '@/components/services/types';

interface ServicesResponse {
  services: ServiceRecord[];
}

interface ServiceResponse {
  service: ServiceRecord;
}

interface ServiceTypesResponse {
  data: ServiceTypeOption[];
}

export const getServices = () => api.get<ServicesResponse>('/api/services');

export const getServiceById = (id: string) =>
  api.get<ServiceResponse>(`/api/services/${id}`);

export const createService = (data: ServiceFormInput) =>
  api.post<ServiceRecord>('/api/services', data);

export const updateService = (id: string, data: ServiceFormInput) =>
  api.put<ServiceRecord>(`/api/services/${id}`, data);

export const deleteService = (id: string) =>
  api.delete(`/api/services/${id}`);

export const getServiceTypes = () =>
  api.get<ServiceTypesResponse>('/api/service-types');
