import {
  useQueryClient,
  useMutation,
  useQuery,
  InfiniteData
} from '@tanstack/react-query'
import { Comment } from '../models/Comment'
import { Post } from '../models/Post'
import { useSession } from './useSession'
import { useSettings } from './useSettings'
import { LikeType } from '../models/LikeType'
import { QUERY_KEYS } from '../constants/QUERY_KEYS'

export function useLike (target: Comment | Post) {
  const { loggedUser, isSessionActive } = useSession()
  const { openModal } = useSettings()
  const queryClient = useQueryClient()
  const type: LikeType = target instanceof Comment ? 'comment' : 'post'
  const queryKey = QUERY_KEYS.userLiked(loggedUser?.id, target)

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      if (type === 'comment') {
        return await loggedUser?.hasLikedComment({ commentId: target.id })
      } else {
        return await loggedUser?.hasLikedPost({ postId: target.id })
      }
    },
    enabled: Boolean(loggedUser)
  })

  const updateCache = (liked: boolean) => {
    const delta = liked ? 1 : -1

    queryClient.setQueryData(queryKey, liked)

    queryClient.setQueriesData<InfiniteData<Post[]>>(
      {
        queryKey: QUERY_KEYS.posts(),
        exact: false
      },
      prev => {
        if (!prev) return prev

        return {
          ...prev,
          pages: prev.pages.map(postsPage =>
            postsPage.map(post =>
              post.id === target.id
                ? post.update({ likes: post.likes + delta })
                : post
            )
          )
        }
      }
    )
  }

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!loggedUser) {
        openModal('session')
        return null
      }

      if (type == 'post') {
        return await loggedUser.likePost({ postId: target.id })
      } else {
        return await loggedUser.likeComment({ commentId: target.id })
      }
    },
    onSuccess: newLike => {
      updateCache(true)

      if (loggedUser && newLike && loggedUser.id !== target.user.id) {
        newLike.createNotification({ sender: loggedUser, target })
      }
    },
    onError: () => updateCache(false)
  })

  const dislikeMutation = useMutation({
    mutationFn: async () => {
      if (!loggedUser) {
        openModal('session')
        return false
      }

      if (type == 'post') {
        return await loggedUser.dislikePost({ postId: target.id })
      } else {
        return await loggedUser.dislikeComment({
          commentId: target.id
        })
      }
    },
    onSuccess: () => updateCache(false),
    onError: () => updateCache(true)
  })

  const handleLike = () => {
    if (!isSessionActive) {
      openModal('session')
      return
    }

    if (query.isLoading) return

    if (query.data === true) {
      dislikeMutation.mutate()
    } else {
      likeMutation.mutate()
    }
  }

  return {
    hasUserLiked: query.data ?? false,
    like: likeMutation.mutate,
    dislike: dislikeMutation.mutate,
    handleLike,
    isLoading: query.isLoading
  }
}
