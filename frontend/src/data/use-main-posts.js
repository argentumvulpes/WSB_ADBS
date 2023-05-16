import { apiClient } from '../lib/api-client';
import { useQuery } from '@tanstack/react-query';

export const MAIN_POSTS = 'main-posts';

export const getMainPosts = async () => {
  const { data } = await apiClient.get(`/posts/main`);

  return data.posts || 0;
};

export default function useMainPosts() {
  return useQuery([MAIN_POSTS], () => getMainPosts());
}