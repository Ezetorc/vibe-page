import { UserData } from './../models/UserData'
import { usePaginatedUserPosts } from './usePaginatedUserPosts'
import { useSearchedUserPosts } from './useSearchedUserPosts'

export function useUserPosts (userData: UserData, searchQuery?: string) {
  const pagination = usePaginatedUserPosts(userData)
  const search = useSearchedUserPosts(userData, searchQuery)

  return searchQuery
    ? {
        ...search,
        deletePost: pagination.deletePost,
        ref: null,
        hasMore: false
      }
    : { ...pagination }
}
