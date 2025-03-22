import { useQuery } from '@tanstack/react-query'
import { useUser } from './useUser'
import { UserService } from '../services/UserService'
import { UserData } from '../pages/Account/models/UserData'

export function useUserData (username: string | undefined) {
  const { user, isSessionActive } = useUser()

  const fetchUserData = async (): Promise<UserData> => {
    if (!username) {
      return UserData.default
    }

    if (username === 'me') {
      if (!isSessionActive()) {
        return UserData.default
      }

      return new UserData({
        id: user!.id,
        name: user!.name,
        imageId: user!.imageId,
        imageUrl: user!.imageUrl,
        description: user!.description,
        date: user!.getDate(),
        postsAmount: await user!.getPostsAmount(),
        followersAmount: await user!.getFollowersAmount(),
        followingAmount: await user!.getFollowingAmount(),
        isLogged: true
      })
    }

    const newUser = await UserService.getByName({ name: username })

    if (!newUser) {
      return UserData.default
    }

    return new UserData({
      id: newUser.id,
      name: newUser.name,
      imageId: newUser.imageId,
      imageUrl: newUser.imageUrl,
      description: newUser.description,
      date: newUser.getDate(),
      postsAmount: await newUser.getPostsAmount(),
      followersAmount: await newUser.getFollowersAmount(),
      followingAmount: await newUser.getFollowingAmount(),
      isLogged: newUser.name === user?.name
    })
  }

  const query = useQuery({
    queryKey: ['userData', username],
    queryFn: fetchUserData,
    staleTime: 1000 * 60 * 5,
    retry: 1
  })

  return {
    userData: query.data ?? UserData.default,
    isLoading: query.isLoading,
    isError: query.isError
  }
}
