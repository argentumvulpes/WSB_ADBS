import { apiClient } from '../lib/api-client';
import { useQuery } from '@tanstack/react-query';

export const COMMENT_LIKES_COUNT_QUERY_KEY = 'comment-likes-count';

export const getCommentLikesCount = async (commentId) => {
  const { data } = await apiClient.get(`/likes/comment/${commentId}`);

  return data.likes || 0;
};

export default function useCommentLikesCount(commentId) {
  return useQuery([COMMENT_LIKES_COUNT_QUERY_KEY, commentId], () => getCommentLikesCount(commentId));
}