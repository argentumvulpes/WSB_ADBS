import { apiClient } from '../lib/api-client';
import { useQuery } from '@tanstack/react-query';

export const POST_COMMENTS_COUNT_QUERY_KEY = 'post-comments-count';

export const getPostCommentsCount = async (postId) => {
  const { data } = await apiClient.get(`/comments/post/${postId}`);

  return data.count || 0;
};

export default function usePostCommentsCount(postId) {
  return useQuery([POST_COMMENTS_COUNT_QUERY_KEY, postId], () => getPostCommentsCount(postId));
}