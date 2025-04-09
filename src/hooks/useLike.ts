import { useQueryClient, useMutation } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants/QUERY_KEYS'
import { Comment } from '../models/Comment'
import { Post } from '../models/Post'
import { useLoggedUser } from './useLoggedUser'
import { useSettings } from './useSettings'
import { LikeType } from '../models/LikeType'

interface UseLikeReturnType {
  like: () => void
  dislike: () => void
}

export function useLike(target: Comment): UseLikeReturnType
export function useLike(target: Post): UseLikeReturnType

export function useLike (target: Comment | Post): UseLikeReturnType {
  const { loggedUser } = useLoggedUser()
  const { openModal } = useSettings()
  const queryClient = useQueryClient()
  const type: LikeType = target instanceof Comment ? 'comment' : 'post'
  const queryKey = [
    type == 'comment' ? QUERY_KEYS.Comment : QUERY_KEYS.Post,
    target.id
  ]

  const updateTarget = (liked: boolean) => {
    const delta = liked ? 1 : -1
    target.userLiked = liked
    target.likes += delta

    queryClient.setQueryData(queryKey, (prevTarget?: Post | Comment) => {
      if (!prevTarget) return prevTarget

      return prevTarget.update({
        likes: prevTarget.likes + delta,
        userLiked: liked
      })
    })
  }

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!loggedUser) {
        openModal('session')
        return false
      }

      if (type == 'post') {
        return await loggedUser.likePost({ postId: target.id })
      } else {
        return await loggedUser.likeComment({ commentId: target.id })
      }
    },
    onMutate: () => updateTarget(true),
    onError: () => updateTarget(false)
  })

  const dislikeMutation = useMutation({
    mutationFn: async () => {
      if (!loggedUser) {
        openModal('session')
        return false
      }

      if (type == 'post') {
        return await loggedUser.dislikePost({ postId: target.id, loggedUser })
      } else {
        return await loggedUser.dislikeComment({
          commentId: target.id,
          loggedUser
        })
      }
    },
    onMutate: () => updateTarget(false),
    onError: () => updateTarget(true)
  })

  return {
    like: likeMutation.mutate,
    dislike: dislikeMutation.mutate
  }
}
