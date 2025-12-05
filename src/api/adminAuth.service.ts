import api from '@/api/axiosConfig';
import type { Permission, Role } from '@/types/website';

interface ApiResponse<T> {
  data: T;
}

const unwrap = <T>(payload: ApiResponse<T> | T): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiResponse<T>).data;
  }

  return payload as T;
};

export interface AdminProfile {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  roles: Role[];
  permissions?: Permission[];
  last_login_at?: string | null;
}

export const getAdminProfile = async (): Promise<AdminProfile> => {
  const { data } = await api.get('/api/admin/auth/me');
  return unwrap<AdminProfile>(data);
};

export const getAdminPermissions = async (): Promise<Permission[]> => {
  const profile = await getAdminProfile();
  return profile.permissions ?? [];
};
