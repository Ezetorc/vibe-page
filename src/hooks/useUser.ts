import { useCallback } from 'react'
import { UserStore } from '../models/UserStore'
import { getUserStore } from '../stores/getUserStore'
import { jwtDecode } from 'jwt-decode'
import { UserService } from '../services/UserService'
import { SessionItem } from '../models/SessionItem'
import { Session } from '../models/Session'

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
    const sessionItem = Session.get()

    console.log('sessionItem: ', sessionItem)

    if (!sessionItem) return false

    try {
      const session: SessionItem = jwtDecode(sessionItem)

      console.log('session: ', session)

      return await updateUser(Number(session.userId))
    } catch {
      console.error('Error decoding token')
      return false
    }
  }, [updateUser])

  const isSessionActive = (): boolean => {
    return Boolean(user)
  }

  return { ...userStore, isSessionActive, handleSession, updateUser }
}
