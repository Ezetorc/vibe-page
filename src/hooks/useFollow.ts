import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { useSettings } from './useSettings'
import { User } from '../models/User'
import { useSession } from './useSession'
import { FollowService } from '../services/FollowService'
import { UserInteractions } from '../models/UserInteractions'
import { QUERY_KEYS } from '../constants/QUERY_KEYS'

export function useFollow (following: User | null) {
  const queryClient = useQueryClient()
  const { openModal } = useSettings()
  const { loggedUser: follower, isSessionActive } = useSession()
  const queryKey = QUERY_KEYS.isFollowing(follower?.id, following?.id)

  const query = useQuery({
    queryKey,
    queryFn: () => follower!.isFollowing({ userId: following!.id }),
    enabled: Boolean(follower) && Boolean(following)
  })

  const follow = useMutation({
    mutationFn: async () => {
      if (follower && following) {
        return await follower.follow({ userId: following.id })
      } else {
        return false
      }
    },
    onMutate: () => {
      queryClient.setQueryData(
        queryKey,
        (oldIsFollowing?: boolean) => !oldIsFollowing
      )

      queryClient.setQueryData(
        QUERY_KEYS.userInteractions(follower?.id),
        (prevUserInteractions?: UserInteractions) => {
          if (!prevUserInteractions) return prevUserInteractions

          return prevUserInteractions.update({
            followingAmount: prevUserInteractions.followingAmount + 1
          })
        }
      )

      queryClient.setQueryData(
        QUERY_KEYS.userInteractions(following?.id),
        (prevUserInteractions?: UserInteractions) => {
          if (!prevUserInteractions) return prevUserInteractions

          return prevUserInteractions.update({
            followersAmount: prevUserInteractions.followersAmount + 1
          })
        }
      )
    },

    onSuccess: () => {
      if (follower && following) {
        FollowService.createNotification({ follower, following })
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    }
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
      queryClient.setQueryData(
        queryKey,
        (oldIsFollowing?: boolean) => !oldIsFollowing
      )

      queryClient.setQueryData(
        QUERY_KEYS.userInteractions(follower?.id),
        (prevUserInteractions?: UserInteractions) => {
          if (!prevUserInteractions) return prevUserInteractions

          return prevUserInteractions.update({
            followingAmount: prevUserInteractions.followingAmount - 1
          })
        }
      )

      queryClient.setQueryData(
        QUERY_KEYS.userInteractions(following?.id),
        (prevUserInteractions?: UserInteractions) => {
          if (!prevUserInteractions) return prevUserInteractions

          return prevUserInteractions.update({
            followersAmount: prevUserInteractions.followersAmount - 1
          })
        }
      )
    },
    onError: () => openModal('connection'),

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    }
  })

  const handleFollow = () => {
    if (!isSessionActive) {
      openModal('session')
      return
    }

    if (query.data) {
      unfollow.mutate()
    } else {
      follow.mutate()
    }
  }

  return {
    isFollowing: query.data,
    follow: follow.mutate,
    unfollow: unfollow.mutate,
    isLoading: query.isLoading,
    handleFollow
  }
}
