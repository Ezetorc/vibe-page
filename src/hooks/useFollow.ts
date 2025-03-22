import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { useSettings } from './useSettings'
import { useUser } from './useUser'
import { UserData } from '../pages/Account/models/UserData'
import { UserService } from '../services/UserService'

export function useFollow (userId: number) {
  const { openModal } = useSettings()
  const { isSessionActive, user } = useUser()
  const queryClient = useQueryClient()
  const queryKey = ['isFollowing', userId]

  const onError = () => {
    openModal('connection')
  }

  const onMutate = () => {
    queryClient.setQueryData(
      queryKey,
      (oldData: boolean | undefined) => !oldData
    )
  }

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      if (!isSessionActive()) {
        openModal('session')
        return false
      }

      const isFollowing = await user!.isFollowing({ userId })

      return isFollowing
    }
  })

  const follow = useMutation({
    mutationFn: async () => {
      if (!isSessionActive()) {
        openModal('session')
        return false
      }

      return await user!.follow({ userId })
    },
    onMutate,
    onSuccess: async () => {
      const userToFollow = await UserService.getById({ userId })

      if (!user) return

      queryClient.setQueryData(['userData', 'me'], (oldUserData: UserData) => {
        if (!oldUserData.followingAmount) return oldUserData

        return new UserData({
          ...oldUserData,
          followingAmount: oldUserData.followingAmount + 1
        })
      })

      queryClient.setQueryData(
        ['userData', userToFollow?.name],
        (oldUserData: UserData) => {
          if (!oldUserData.followingAmount) return oldUserData

          return new UserData({
            ...oldUserData,
            followersAmount: oldUserData.followingAmount + 1
          })
        }
      )
    },
    onError
  })

  const unfollow = useMutation({
    mutationFn: async () => {
      if (!isSessionActive()) {
        openModal('session')
        return false
      }

      return await user!.unfollow({ userId })
    },
    onMutate,
    onSuccess: async () => {
      const userToFollow = await UserService.getById({ userId })

      if (!user) return

      queryClient.setQueryData(['userData', 'me'], (oldUserData: UserData) => {
        if (!oldUserData.followingAmount) return oldUserData

        return new UserData({
          ...oldUserData,
          followingAmount: oldUserData.followingAmount - 1
        })
      })

      queryClient.setQueryData(
        ['userData', userToFollow?.name],
        (oldUserData: UserData) => {
          if (!oldUserData.followingAmount) return oldUserData

          return new UserData({
            ...oldUserData,
            followersAmount: oldUserData.followingAmount - 1
          })
        }
      )
    },
    onError
  })

  return {
    isFollowing: query.data,
    follow: follow.mutate,
    unfollow: unfollow.mutate
  }
}
