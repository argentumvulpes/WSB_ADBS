import { apiClient } from '../lib/api-client';
import { useQuery } from '@tanstack/react-query';

export const USER_FOLLOWERS_COUNT_QUERY_KEY = 'user-followers-count';

export const getUserFollowersCount = async (username) => {
  const { data } = await apiClient.get(`/followers/followers/${username}`);

  return data.followers || 0;
};

export default function useUserFollowersCount(username) {
  return useQuery([USER_FOLLOWERS_COUNT_QUERY_KEY, username], () => getUserFollowersCount(username));
}