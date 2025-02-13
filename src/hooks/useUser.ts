import { useCallback } from 'react'
import { UserStore } from '../models/UserStore'
import { getUserStore } from '../stores/getUserStore'
import { jwtDecode } from 'jwt-decode'
import { getAccessToken } from '../utilities/getAccessToken'
import { AccessToken } from '../models/AccessToken'
import { UserService } from '../services/UserService'

export function useUser () {
  const userStore: UserStore = getUserStore()
  const { user, setUser } = userStore

  const updateUser = useCallback(
    async (userId: number): Promise<boolean> => {
      const newUser = await UserService.getById({ userId })

      if (!newUser.value) return false

      setUser(newUser.value)
      return true
    },
    [setUser]
  )

  const handleSession = useCallback(async (): Promise<boolean> => {
    const accessToken = getAccessToken()

    if (!accessToken) return false

    try {
      const session: AccessToken = jwtDecode(accessToken)

      if ('id' in session.user) {
        updateUser(session.user.id)
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
