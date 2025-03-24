import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { useSettings } from './useSettings'
import { UserData } from '../pages/Account/models/UserData'
import { UserService } from '../services/UserService'

export function useFollow (followerId: number | undefined, followingId: number) {
  const { openModal } = useSettings()
  const queryClient = useQueryClient()
  const queryKey = ['isFollowing', followerId, followingId]

  const { data: follower, isLoading: followerIsLoading } = useQuery({
    queryKey: ['user', followerId],
    queryFn: async () => {
      if (!followerId) return null
      return await UserService.getById({ userId: followerId })
    },
    enabled: !!followerId
  })

  const { data: following, isLoading: followingIsLoading } = useQuery({
    queryKey: ['user', followingId],
    queryFn: async () => {
      if (!followingId) return null
      return await UserService.getById({ userId: followingId })
    },
    enabled: !!followingId
  })

  const isFollowingQuery = useQuery({
    queryKey,
    queryFn: async () => {
      if (!follower) {
        openModal('session')
        return false
      }

      return await follower.isFollowing({ userId: followingId })
    },
    enabled: !!follower
  })

  const onMutate = () => {
    queryClient.setQueryData(
      queryKey,
      (oldData: boolean | undefined) => !oldData
    )
  }

  const follow = useMutation({
    mutationFn: async () => {
      if (!follower) {
        openModal('session')
        return false
      }

      return await follower.follow({ userId: followingId })
    },
    onMutate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })

      queryClient.setQueryData(['userData', 'me'], (oldUserData?: UserData) => {
        if (!oldUserData) return oldUserData

        return new UserData({
          ...oldUserData,
          followingAmount: (oldUserData.followingAmount ?? 0) + 1
        })
      })

      queryClient.setQueryData(
        ['userData', following?.name],
        (oldUserData?: UserData) => {
          if (!oldUserData) return oldUserData

          return new UserData({
            ...oldUserData,
            followersAmount: (oldUserData.followersAmount ?? 0) + 1
          })
        }
      )
    },
    onError: () => openModal('connection'),
    onSettled: () => queryClient.invalidateQueries({ queryKey })
  })

  const unfollow = useMutation({
    mutationFn: async () => {
      if (!follower) {
        openModal('session')
        return false
      }

      return await follower.unfollow({ userId: followingId })
    },
    onMutate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })

      queryClient.setQueryData(['userData', 'me'], (oldUserData?: UserData) => {
        if (!oldUserData) return oldUserData

        return new UserData({
          ...oldUserData,
          followingAmount: Math.max((oldUserData.followingAmount ?? 0) - 1, 0)
        })
      })

      queryClient.setQueryData(
        ['userData', following?.name],
        (oldUserData?: UserData) => {
          if (!oldUserData) return oldUserData

          return new UserData({
            ...oldUserData,
            followersAmount: Math.max((oldUserData.followersAmount ?? 0) - 1, 0)
          })
        }
      )
    },
    onError: () => openModal('connection'),
    onSettled: () => queryClient.invalidateQueries({ queryKey })
  })

  return {
    isFollowing: followerIsLoading || followingIsLoading ? undefined : isFollowingQuery.data,
    follow: follow.mutate,
    unfollow: unfollow.mutate
  }
}
