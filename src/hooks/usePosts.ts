import { usePaginatedPosts } from './usePaginatedPosts'
import { useSearchedPosts } from './useSearchedPosts'

export function usePosts (searchQuery?: string) {
  const pagination = usePaginatedPosts()
  const search = useSearchedPosts(searchQuery)

  return searchQuery
    ? { ...search, deletePost: pagination.deletePost, ref: null, hasMore: false }
    : { ...pagination }
}
