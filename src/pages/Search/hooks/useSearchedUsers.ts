import { useQuery } from '@tanstack/react-query'
import { UserService } from '../../../services/UserService'

export function useSearchedUsers (searchQuery?: string) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['users', searchQuery],
    queryFn: () =>
      searchQuery ? UserService.search({ query: searchQuery }) : [],
    enabled: Boolean(searchQuery),
    staleTime: 1000 * 60 * 5
  })

  return {
    users: data || [],
    isLoading,
    isError
  }
}
