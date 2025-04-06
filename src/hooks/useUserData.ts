import { useQuery } from '@tanstack/react-query'
import { useUser } from './useUser'
import { UserService } from '../services/UserService'
import { UserData } from '../pages/Account/models/UserData'

export function useUserData (userId: string | undefined) {
  const { user, isSessionActive } = useUser()
  const queryKey = userId ? ['userData', userId] : ['userData', user?.id]

  const fetchUserData = async (): Promise<UserData> => {
    if (userId === undefined) {
      if (!isSessionActive()) {
        return UserData.default
      }

      return await UserData.getFromUser({ user: user!, isLogged: true })
    } else {
      const newUser = await UserService.getById({ userId: Number(userId) })

      if (!newUser) {
        return UserData.default
      }

      return await UserData.getFromUser({
        user: newUser,
        isLogged: newUser.name === user?.name
      })
    }
  }

  const query = useQuery({
    queryKey,
    queryFn: fetchUserData,
    staleTime: 1000 * 60 * 5,
    retry: 1
  })

  return {
    userData: query.data ?? UserData.default,
    isLoading: query.isLoading,
    isError: query.isError || !query.data?.id
  }
}
