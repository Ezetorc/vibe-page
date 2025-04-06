import { useCallback } from 'react'
import { UserStore } from '../models/UserStore'
import { getUserStore } from '../stores/getUserStore'
import { jwtDecode } from 'jwt-decode'
import { UserService } from '../services/UserService'
import { SessionItem } from '../models/SessionItem'
import { SessionService } from '../services/SessionService'
import { useQueryClient } from '@tanstack/react-query'

export function useUser () {
  const userStore: UserStore = getUserStore()
  const queryClient = useQueryClient()
  const { user, setUser } = userStore

  const updateUser = useCallback(
    async (userId: number): Promise<boolean> => {
      const newUser = await UserService.getById({ userId })

      if (newUser) {
        setUser(newUser)
        return true
      } else {
        return false
      }
    },
    [setUser]
  )

  const logout = () => {
    queryClient.resetQueries({ queryKey: ['userData', user?.id] })
    queryClient.removeQueries({ queryKey: ['userData', user?.id] })
    SessionService.remove()
    setUser(null)
  }

  const handleSession = useCallback(async (): Promise<boolean> => {
    const decodedSessionItem = SessionService.get()

    if (!decodedSessionItem) return false

    try {
      const session: SessionItem = jwtDecode(decodedSessionItem)

      if (session.isExpired) {
        SessionService.remove()
        return false
      }

      const userUpdate = await updateUser(Number(session.userId))

      return userUpdate
    } catch {
      SessionService.remove()
      return false
    }
  }, [updateUser])

  const isSessionActive = (): boolean => {
    return Boolean(user)
  }

  return { ...userStore, isSessionActive, handleSession, updateUser, logout }
}
