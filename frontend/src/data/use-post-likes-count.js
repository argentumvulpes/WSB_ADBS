import { apiClient } from '../lib/api-client';
import { useQuery } from '@tanstack/react-query';

export const POST_LIKES_COUNT_QUERY_KEY = 'post-likes-count';

export const getPostLikesCount = async (postId) => {
  const { data } = await apiClient.get(`/likes/post/${postId}`);

  return data.likes || 0;
};

export default function usePostLikesCount(postId) {
  return useQuery([POST_LIKES_COUNT_QUERY_KEY, postId], () => getPostLikesCount(postId));
}