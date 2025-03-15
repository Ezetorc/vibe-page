import { useQuery } from '@tanstack/react-query'
import { useUser } from '../../../hooks/useUser'
import { UserService } from '../../../services/UserService'
import { AccountData } from '../models/AccountData'

export function useAccountData (username: string | undefined): AccountData {
  const { user, isSessionActive } = useUser()

  const fetchAccount = async () => {
    if (username === 'me' && isSessionActive()) {
      return {
        postsAmount: await user!.getPostsAmount(),
        followersAmount: await user!.getFollowersAmount(),
        followingAmount: await user!.getFollowingAmount(),
        user
      } as AccountData
    }
    if (username) {
      const newUser = await UserService.getByName({ name: username })

      if (newUser) {
        return {
          user: newUser,
          postsAmount: await newUser.getPostsAmount(),
          followersAmount: await newUser!.getFollowersAmount(),
          followingAmount: await newUser!.getFollowingAmount()
        } as AccountData
      }
    }

    throw new Error('User not found')
  }

  const {
    data: accountData,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['accountData', username],
    queryFn: fetchAccount,
    staleTime: 1000 * 60 * 5,
    retry: 1
  })

  return {
    isLoading,
    isError,
    postsAmount: accountData?.postsAmount ?? -1,
    user: accountData?.user ?? null,
    isUser: user?.id === accountData?.user?.id,
    followersAmount: accountData?.followersAmount ?? -1,
    followingAmount: accountData?.followingAmount ?? -1
  }
}
