import { useCallback } from 'react'
import { UserStore } from '../models/UserStore'
import { getUserStore } from '../stores/getUserStore'
import { jwtDecode } from 'jwt-decode'
import { UserService } from '../services/UserService'
import { SessionItem } from '../models/SessionItem'
import { SessionService } from '../services/SessionService'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants/QUERY_KEYS'

export function useLoggedUser () {
  const userStore: UserStore = getUserStore()
  const queryClient = useQueryClient()
  const { loggedUser, setLoggedUser } = userStore

  const updateUser = useCallback(
    async (userId: number): Promise<boolean> => {
      const newLoggedUser = await UserService.getById({ userId })

      if (newLoggedUser) {
        setLoggedUser(newLoggedUser)
        return true
      } else {
        return false
      }
    },
    [setLoggedUser]
  )

  const logout = () => {
    if (!loggedUser) return

    queryClient.resetQueries({ queryKey: [QUERY_KEYS.User, loggedUser.id] })
    queryClient.removeQueries({ queryKey: [QUERY_KEYS.User, loggedUser.id] })
    SessionService.remove()
    setLoggedUser(null)
  }

  const handleSession = useCallback(async (): Promise<boolean> => {
    const decodedSessionItem = SessionService.get()

    if (!decodedSessionItem) return false

    try {
      const session: SessionItem = jwtDecode(decodedSessionItem)

      if (session.isExpired) {
        SessionService.remove()
        return false
      } else {
        const userUpdate = await updateUser(Number(session.userId))

        return userUpdate
      }
    } catch {
      SessionService.remove()
      return false
    }
  }, [updateUser])

  const isSessionActive = (): boolean => {
    return Boolean(loggedUser)
  }

  return { ...userStore, isSessionActive, handleSession, updateUser, logout }
}
