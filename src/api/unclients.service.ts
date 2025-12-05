import type { AxiosResponse } from 'axios';

import api from './axiosConfig';
import type { Unclient } from '@/types/unclients';

type UnclientsResponse = Unclient[] | { unclients: Unclient[] } | { data: Unclient[] };

const normaliseUnclients = (payload: UnclientsResponse): Unclient[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === 'object') {
    if ('unclients' in payload && Array.isArray(payload.unclients)) {
      return payload.unclients;
    }

    if ('data' in payload && Array.isArray(payload.data)) {
      return payload.data;
    }
  }

  return [];
};

export const getUnclients = async (): Promise<AxiosResponse<Unclient[]>> => {
  const response = await api.get<UnclientsResponse>('/api/unclients');
  response.data = normaliseUnclients(response.data);
  return response as AxiosResponse<Unclient[]>;
};

export const getUnclientById = (id: string) =>
  api.get<Unclient>(`/api/unclients/${id}`);

export const createUnclient = (data: Partial<Unclient>) =>
  api.post<Unclient>('/api/unclients', data);

export const updateUnclient = (id: string, data: Partial<Unclient>) =>
  api.put<Unclient>(`/api/unclients/${id}`, data);

export const deleteUnclient = (id: string) =>
  api.delete(`/api/unclients/${id}`);
