import { apiClient } from '../lib/api-client';

export const likePost = async (postId) => {
  await apiClient.post(`/likes/post/${postId}/like`);

  return true;
};

export const unlikePost = async (postId) => {
  await apiClient.post(`/likes/post/${postId}/unlike`);

  return true;
};

export const likeComment = async (comment) => {
  await apiClient.post(`/likes/comment/${comment}/like`);

  return true;
};

export const unlikeComment = async (comment) => {
  await apiClient.post(`/likes/comment/${comment}/unlike`);

  return true;
};
