import { apiClient } from '../lib/api-client';
import { useQuery } from '@tanstack/react-query';

export const RECOMMENDATION_USERS = 'recommendation-users';

export const getUserRecommendations = async () => {
  const { data } = await apiClient.get(`/recommendation/users`);

  return data;
};

export default function useUserRecommendations() {
  return useQuery([RECOMMENDATION_USERS], () => getUserRecommendations());
}