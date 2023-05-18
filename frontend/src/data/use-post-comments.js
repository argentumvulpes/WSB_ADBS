import { apiClient } from '../lib/api-client';
import { useQuery } from '@tanstack/react-query';

export const POST_COMMENTS_QUERY_KEY = 'post-comments';

export const getPostComments = async (postId) => {
  const { data } = await apiClient.get(`/comments/post/${postId}`);

  return data || 0;
};

export default function usePostComments(postId) {
  return useQuery([POST_COMMENTS_QUERY_KEY, postId], () => getPostComments(postId));
}