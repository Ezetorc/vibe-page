import { useCallback } from 'react'
import { UserStore } from '../models/UserStore'
import { getUserStore } from '../stores/getUserStore'
import { jwtDecode } from 'jwt-decode'
import { UserService } from '../services/UserService'
import { getSessionCookie } from '../utilities/getSessionCookie'
import { SessionCookie } from '../models/SessionCookie'

export function useUser () {
  const userStore: UserStore = getUserStore()
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

  const handleSession = useCallback(async (): Promise<boolean> => {
    const sessionCookie = getSessionCookie()

    if (!sessionCookie) return false

    try {
      const session: SessionCookie = jwtDecode(sessionCookie)
      if ('id' in session.user) {
        await updateUser(session.user.id)
        return true
      }

      return false
    } catch (error) {
      console.error('Error decoding token:', error)
      return false
    }
  }, [updateUser])

  const isSessionActive = (): boolean => {
    return Boolean(user)
  }

  return { ...userStore, isSessionActive, handleSession, updateUser }
}
