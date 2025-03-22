import { usePaginatedUsers } from "./usePaginatedUsers"
import { useSearchedUsers } from "./useSearchedUsers"

export function useUsers (searchQuery?: string) {
  const pagination = usePaginatedUsers()
  const search = useSearchedUsers(searchQuery)

  return searchQuery
    ? {
        ...search,
        deleteUser: pagination.deleteUser,
        ref: null,
        hasMore: false
      }
    : { ...pagination }
}
