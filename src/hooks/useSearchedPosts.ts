import { useQuery } from '@tanstack/react-query'
import { PostService } from '../services/PostService'

export function useSearchedPosts (searchQuery?: string) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['posts', searchQuery],
    queryFn: () =>
      searchQuery ? PostService.search({ query: searchQuery }) : [],
    enabled: Boolean(searchQuery),
    staleTime: 1000 * 60 * 5
  })

  return {
    posts: data || [],
    isLoading,
    isError
  }
}
