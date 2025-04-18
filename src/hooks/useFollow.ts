import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { useSettings } from './useSettings'
import { User } from '../models/User'
import { useSession } from './useSession'
import { QUERY_KEYS } from '../constants/QUERY_KEYS'

export function useFollow (following: User | null) {
  const queryClient = useQueryClient()
  const { openModal } = useSettings()
  const { loggedUser: follower } = useSession()
  const queryKey = [follower?.id, QUERY_KEYS.Follow, following?.id]

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

  const follow = useMutation({
    mutationFn: async () => {
      if (follower && following && following.id) {
        return await follower.follow({ userId: following.id })
      } else {
        return false
      }
    },
    onMutate: () => {
      queryClient.invalidateQueries({ queryKey })

      queryClient.setQueryData(
        queryKey,
        (oldIsFollowing?: boolean) => !oldIsFollowing
      )

      queryClient.setQueryData(
        [QUERY_KEYS.User, follower?.id],
        (prevUser?: User) => {
          if (!prevUser) return prevUser

          return prevUser.update({
            followingAmount: (prevUser.followingAmount ?? 0) + 1
          })
        }
      )

      queryClient.setQueryData(
        [QUERY_KEYS.User, following?.id],
        (prevUser?: User) => {
          if (!prevUser) return prevUser

          return prevUser.update({
            followersAmount: (prevUser.followersAmount ?? 0) + 1
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
    onMutate: () => {
      queryClient.invalidateQueries({ queryKey })

      queryClient.setQueryData(
        queryKey,
        (oldIsFollowing?: boolean) => !oldIsFollowing
      )

      queryClient.setQueryData(
        [QUERY_KEYS.User, follower?.id],
        (prevUser?: User) => {
          if (!prevUser) return prevUser

          return prevUser.update({
            followingAmount: Math.max((prevUser.followingAmount ?? 0) - 1, 0)
          })
        }
      )

      queryClient.setQueryData(
        [QUERY_KEYS.User, following?.id],
        (prevUser?: User) => {
          if (!prevUser) return prevUser

          return prevUser.update({
            followersAmount: Math.max((prevUser.followersAmount ?? 0) - 1, 0)
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
