import { apiClient } from '../lib/api-client';
import { useQuery } from '@tanstack/react-query';

export const AUTH_QUERY_KEY = 'auth-user';

export const getAuthUser = async () => {
  const { data } = await apiClient.get(`/auth/user`);

  return data || null;
};

export default function useAuthUser() {
  return useQuery([AUTH_QUERY_KEY], () => getAuthUser());
}