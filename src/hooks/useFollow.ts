import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { UserData } from '../pages/Account/models/UserData'
import { useSettings } from './useSettings'
import { useUser } from './useUser'
import { User } from '../models/User'

export function useFollow (following: User | null) {
  const queryClient = useQueryClient()
  const { openModal } = useSettings()
  const { user: follower } = useUser()
  const queryKey = ['isFollowing', follower?.id, following?.id]

  const isFollowingQuery = useQuery({
    queryKey,
    queryFn: async () => {
      if (!!follower && !!following && !!following.id) {
        return await follower.isFollowing({ userId: following.id })
      } else {
        return false
      }
    }
  })

  const onMutate = () => {
    queryClient.setQueryData(
      queryKey,
      (oldIsFollowingData: boolean | undefined) => !oldIsFollowingData
    )
  }

  const follow = useMutation({
    mutationFn: async () => {
      if (follower && following && following.id) {
        return await follower.follow({ userId: following.id })
      } else {
        return false
      }
    },
    onMutate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })

      queryClient.setQueryData(
        ['userData', follower?.id],
        (prevUserData?: UserData) => {
          if (!prevUserData) return prevUserData

          return prevUserData.update({
            followingAmount: (prevUserData.followingAmount ?? 0) + 1
          })
        }
      )

      queryClient.setQueryData(
        ['userData', following?.id],
        (prevUserData?: UserData) => {
          if (!prevUserData) return prevUserData

          return prevUserData.update({
            followersAmount: (prevUserData.followersAmount ?? 0) + 1
          })
        }
      )
    },
    onError: () => openModal('connection'),
    onSettled: () => queryClient.invalidateQueries({ queryKey })
  })

  const unfollow = useMutation({
    mutationFn: async () => {
      if (follower && following && following.id) {
        return await follower.unfollow({ userId: following.id })
      } else {
        return false
      }
    },
    onMutate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })

      queryClient.setQueryData(
        ['userData', follower?.id],
        (prevUserData?: UserData) => {
          if (!prevUserData) return prevUserData

          return prevUserData.update({
            followingAmount: Math.max(
              (prevUserData.followingAmount ?? 0) - 1,
              0
            )
          })
        }
      )

      queryClient.setQueryData(
        ['userData', following?.id],
        (prevUserData?: UserData) => {
          if (!prevUserData) return prevUserData

          return prevUserData.update({
            followersAmount: Math.max(
              (prevUserData.followersAmount ?? 0) - 1,
              0
            )
          })
        }
      )
    },
    onError: () => openModal('connection'),
    onSettled: () => queryClient.invalidateQueries({ queryKey })
  })

  return {
    isFollowing:
      isFollowingQuery.data === undefined ? null : isFollowingQuery.data,
    follow: follow.mutate,
    unfollow: unfollow.mutate
  }
}
