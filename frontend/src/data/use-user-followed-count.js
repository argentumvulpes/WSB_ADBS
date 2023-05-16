import { apiClient } from '../lib/api-client';
import { useQuery } from '@tanstack/react-query';

export const USER_FOLLOWED_COUNT_QUERY_KEY = 'user-followed-count';

export const getUserFollowedCount = async (username) => {
  const { data } = await apiClient.get(`/followers/followed/${username}`);

  return data.followed || 0;
};

export default function useUserFollowedCount(username) {
  return useQuery([USER_FOLLOWED_COUNT_QUERY_KEY, username], () => getUserFollowedCount(username));
}