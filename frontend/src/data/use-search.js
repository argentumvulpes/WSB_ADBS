import { apiClient } from '../lib/api-client';
import { useQuery } from '@tanstack/react-query';

export const SEARCH_QUERY_KEY = 'post-comments-count';

export const getSearchResult = async (query) => {
  const { data } = await apiClient.get(`/search`, {params: {query}});

  return data || null;
};

export default function useSearch(query) {
  return useQuery([SEARCH_QUERY_KEY, query], () => getSearchResult(query));
}