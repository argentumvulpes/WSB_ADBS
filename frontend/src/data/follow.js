import { apiClient } from '../lib/api-client';

export const followUser = async (userName) => {
  await apiClient.post(`/users/${userName}/follow`);

  return true;
};

export const unfollowUser = async (userName) => {
  await apiClient.post(`/users/${userName}/unfollow`);

  return true;
};
