import { jwtDecode as getDecodedJWT } from 'jwt-decode'
import { UserService } from '../services/UserService'
import { SessionItem } from '../models/SessionItem'
import { SessionService } from '../services/SessionService'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { SessionStore } from '../models/SessionStore'
import { getSessionStore } from '../stores/getSessionStore'
import { useSettings } from './useSettings'
import { PATHS } from '../constants/PATHS'
import { useLocation } from 'wouter'
import { QUERY_KEYS } from '../constants/QUERY_KEYS'

export function useSession () {
  const sessionStore: SessionStore = getSessionStore()
  const queryClient = useQueryClient()
  const { loggedUser, setLoggedUser, isActive, setIsActive } = sessionStore
  const { openModal } = useSettings()
  const [, navigate] = useLocation()

  const updateLoggedUser = async (
    userId: number | string
  ): Promise<boolean> => {
    const newLoggedUser = await UserService.getById({ userId: Number(userId) })

    if (newLoggedUser) {
      setLoggedUser(newLoggedUser)
      return true
    } else {
      return false
    }
  }

  useEffect(() => {
    const active = Boolean(loggedUser) && SessionService.get() !== null

    setIsActive(active)
  }, [loggedUser, setIsActive])

  const logout = () => {
    if (!loggedUser) return

    queryClient.resetQueries({ queryKey: QUERY_KEYS.user(loggedUser.id) })
    queryClient.removeQueries({ queryKey:  QUERY_KEYS.user(loggedUser.id) })
    SessionService.remove()
    setLoggedUser(null)
  }

  const handleSession = async (): Promise<boolean> => {
    const codedSessionItem = SessionService.get()

    if (!codedSessionItem) return false

    try {
      const session: SessionItem = getDecodedJWT(codedSessionItem)

      if (session.isExpired) {
        SessionService.remove()
        return false
      } else {
        const userUpdate = await updateLoggedUser(session.userId)

        return userUpdate
      }
    } catch {
      SessionService.remove()
      return false
    }
  }

  const handleSessionSuccess = async () => {
    const sessionSuccess = await handleSession()

    if (sessionSuccess) {
      navigate(PATHS.accountSection)
    } else {
      openModal('connection')
    }
  }

  return {
    ...sessionStore,
    handleSession,
    updateLoggedUser,
    logout,
    handleSessionSuccess,
    isSessionActive: isActive
  }
}
