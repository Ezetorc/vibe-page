import { useCallback } from 'react'
import { UserStore } from '../models/UserStore'
import { getUserStore } from '../stores/getUserStore'
import { UserEndpoint } from '../models/UserEndpoint'
import { getAdaptedUser } from '../adapters/getAdaptedUser'
import { JwtPayload, jwtDecode } from 'jwt-decode'
import { getAccessToken } from '../utilities/getAccessToken'
import { User } from '../models/User'

export function useUser () {
  const userStore: UserStore = getUserStore()
  const { user, setUser } = userStore

  const adaptUser = useCallback(
    (userEndpoint: UserEndpoint): void => {
      const adaptedUser: User = getAdaptedUser(userEndpoint)

      setUser(adaptedUser)
    },
    [setUser]
  )

  const handleToken = useCallback((): void => {
    const accessToken: string | undefined = getAccessToken()

    if (!accessToken) return

    try {
      const user: JwtPayload = jwtDecode(accessToken)

      if ('user' in user) {
        adaptUser(user.user as UserEndpoint)
      }
    } catch (error) {
      console.error('Error decoding token:', error)
    }
  }, [adaptUser])

  const isSessionActive = (): boolean => {
    return Boolean(user)
  }

  return { ...userStore, isSessionActive, handleToken }
}
