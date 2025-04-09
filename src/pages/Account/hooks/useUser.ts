import { useQuery } from '@tanstack/react-query'
import { UserService } from '../../../services/UserService'
import { useLoggedUser } from '../../../hooks/useLoggedUser'
import { QUERY_KEYS } from '../../../constants/QUERY_KEYS'

export function useUser (userId?: string | number) {
  const { loggedUser } = useLoggedUser()
  const queryKey = [QUERY_KEYS.User, userId ?? loggedUser?.id]

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      if (userId) {
        return await UserService.getById({ userId: Number(userId) })
      } else {
        return loggedUser
      }
    },
    enabled: !!(userId || loggedUser)
  })

  return {
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError || !query.data
  }
}
