import { useQuery } from '@tanstack/react-query'
import { NotificationService } from '../services/NotificationService'
import { useSession } from './useSession'
import { QUERY_KEYS } from '../constants/QUERY_KEYS'

export function useHasNotifications () {
  const { loggedUser } = useSession()
  
  const query = useQuery({
    queryKey: QUERY_KEYS.hasNotifications(),
    queryFn: () => NotificationService.loggedUserHasNotifications(),
    enabled: Boolean(loggedUser)
  })

  return { hasNotifications: query.data }
}
