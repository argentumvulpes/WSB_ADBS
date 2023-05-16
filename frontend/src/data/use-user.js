import { apiClient } from '../lib/api-client';
import { useQuery } from '@tanstack/react-query';

export const USER_QUERY_KEY = 'user';

export const getUser = async (username) => {
  const { data } = await apiClient.get(`/users/${username}`);

  return data || null;
};

export default function useUser(username) {
  return useQuery([USER_QUERY_KEY, username], () => getUser(username));
}