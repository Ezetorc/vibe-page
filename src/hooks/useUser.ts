import { useCallback } from 'react'
import { UserStore } from '../models/UserStore'
import { getUserStore } from '../stores/getUserStore'
import { jwtDecode } from 'jwt-decode'
import { getAccessToken } from '../utilities/getAccessToken'
import { User } from '../models/User'
import { AccessToken } from '../models/AccessToken'
import { UserService } from '../services/UserService'

export function useUser () {
  const userStore: UserStore = getUserStore()
  const { user, setUser } = userStore

  const updateUser = useCallback(
    async (userId: number) => {
      const newUser: User | null = await UserService.getById({userId})

      setUser(newUser)
    },
    [setUser]
  )

  const handleSession = useCallback(async (): Promise<void> => {
    const accessToken: string | undefined = getAccessToken()

    if (!accessToken) return

    try {
      const session: AccessToken = jwtDecode(accessToken)

      if ('id' in session.user) {
        updateUser(session.user.id)
      }
    } catch (error) {
      console.error('Error decoding token:', error)
    }
  }, [updateUser])

  const isSessionActive = (): boolean => {
    return Boolean(user)
  }

  return { ...userStore, isSessionActive, handleSession, updateUser }
}
