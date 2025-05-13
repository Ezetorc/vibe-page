import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '../../../constants/QUERY_KEYS'
import { useSession } from '../../../hooks/useSession'
import { useSettings } from '../../../hooks/useSettings'
import { useValidation } from '../../../hooks/useValidation'
import { SessionService } from '../../../services/SessionService'

export function useAccountDeleter (canDelete: boolean) {
  const { error, setError } = useValidation()
  const { loggedUser, isSessionActive } = useSession()
  const queryClient = useQueryClient()
  const { dictionary, openModal } = useSettings()

  const isValid = () => {
    if (!isSessionActive) {
      openModal('session')
      return false
    }

    if (!canDelete) {
      setError(dictionary.youMustUnderstandAction)
      return false
    }

    return true
  }

  const updateData = () => {
    SessionService.remove()
    queryClient.removeQueries({ queryKey: QUERY_KEYS.user(loggedUser?.id) })
    location.reload()
  }

  const deleteAccount = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (!isValid()) return

    const success = await loggedUser!.delete()

    if (success >= 0) {
      updateData()
    } else {
      openModal('connection')
    }
  }

  return { error, deleteAccount }
}
