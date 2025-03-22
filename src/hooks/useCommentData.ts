import { CommentData } from './../models/CommentData'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { UserService } from '../services/UserService'
import { useUser } from './useUser'
import { useSettings } from './useSettings'
import { Comment } from '../models/Comment'
import { useCallback } from 'react'

export function useCommentData (comment: Comment) {
  const { user } = useUser()
  const { openModal } = useSettings()
  const queryClient = useQueryClient()
  const queryKey = ['commentData', comment.id]

  const fetchCommentData = useCallback(async () => {
    const [newCommentUser, newLikes, newUserLiked] = await Promise.all([
      UserService.getById({ userId: comment.userId }),
      comment.getLikesAmount(),
      user?.hasLikedComment({ commentId: comment.id })
    ])

    return new CommentData({
      user: newCommentUser,
      likes: newLikes,
      userLiked: newUserLiked,
      id: comment.id,
      date: comment.getDate(),
      content: comment.content
    })
  }, [comment, user])

  const query = useQuery({
    queryKey,
    queryFn: () => fetchCommentData(),
    enabled: comment.id >= 0
  })

  const likeMutation = useMutation({
    mutationFn: () => user!.likeComment({ commentId: comment.id }),
    onMutate: () => {
      queryClient.setQueryData(
        queryKey,
        (oldCommentData: CommentData | undefined) => {
          if (!oldCommentData) return oldCommentData

          const updatedCommentData = new CommentData({
            ...oldCommentData,
            likes: (oldCommentData.likes ?? 0) + 1,
            userLiked: true
          })

          return updatedCommentData
        }
      )
    },
    onError: () => {
      queryClient.setQueryData(
        queryKey,
        (oldCommentData: CommentData | undefined) => {
          if (!oldCommentData) return oldCommentData

          const updatedCommentData = new CommentData({
            ...oldCommentData,
            likes: (oldCommentData.likes ?? 0) - 1,
            userLiked: false
          })

          return updatedCommentData
        }
      )

      openModal('connection')
    }
  })

  const dislikeMutation = useMutation({
    mutationFn: () => user!.dislikeComment({ commentId: comment.id }),
    onMutate: () => {
      queryClient.setQueryData(
        queryKey,
        (oldCommentData: CommentData | undefined) => {
          if (!oldCommentData) return oldCommentData

          const updatedCommentData = new CommentData({
            ...oldCommentData,
            likes: (oldCommentData.likes ?? 0) - 1,
            userLiked: false
          })

          return updatedCommentData
        }
      )
    },
    onError: () => {
      queryClient.setQueryData(
        queryKey,
        (oldCommentData: CommentData | undefined) => {
          if (!oldCommentData) return oldCommentData

          const updatedCommentData = new CommentData({
            ...oldCommentData,
            likes: (oldCommentData.likes ?? 0) + 1,
            userLiked: true
          })

          return updatedCommentData
        }
      )

      openModal('connection')
    }
  })

  return {
    commentData: query.data ?? CommentData.default,
    isLoading: query.isLoading,
    likeComment: likeMutation.mutate,
    dislikeComment: dislikeMutation.mutate
  }
}
