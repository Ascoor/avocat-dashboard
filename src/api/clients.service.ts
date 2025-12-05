import type { AxiosResponse } from 'axios';

import api from './axiosConfig';
import type { Client } from '@/types/clients';

type ClientsResponse = Client[] | { clients: Client[] } | { data: Client[] };

const normaliseClients = (payload: ClientsResponse): Client[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === 'object') {
    if ('clients' in payload && Array.isArray(payload.clients)) {
      return payload.clients;
    }

    if ('data' in payload && Array.isArray(payload.data)) {
      return payload.data;
    }
  }

  return [];
};

export const getClients = async (): Promise<AxiosResponse<Client[]>> => {
  const response = await api.get<ClientsResponse>('/api/clients');
  response.data = normaliseClients(response.data);
  return response as AxiosResponse<Client[]>;
};

export const getClientById = (id: string) =>
  api.get<Client>(`/api/clients/${id}`);

export const createClient = (data: Partial<Client>) =>
  api.post<Client>('/api/clients', data);

export const updateClient = (id: string, data: Partial<Client>) =>
  api.put<Client>(`/api/clients/${id}`, data);

export const deleteClient = (id: string) =>
  api.delete(`/api/clients/${id}`);
