import { apiClient } from "../lib/api-client";

export const createPost = async (content) => {
  const { data } = await apiClient.post(
    `/posts/post`,
    new URLSearchParams({
      content: content,
    })
  );

  return data;
};

export const deletePost = async (postId) => {
  await apiClient.post(`/posts/${postId}/delete`);

  return true;
};
