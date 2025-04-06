import { CommentData } from './../models/CommentData'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useUser } from './useUser'
import { useSettings } from './useSettings'
import { Comment } from '../models/Comment'

export function useCommentData (comment: Comment) {
  const { user } = useUser()
  const { openModal } = useSettings()
  const queryClient = useQueryClient()
  const queryKey = ['commentData', comment.id]

  const query = useQuery({
    queryKey,
    queryFn: () => CommentData.getFromComment({ comment, loggedUser: user }),
    enabled: comment.id >= 0
  })

  const likeMutation = useMutation({
    mutationFn: () => user!.likeComment({ commentId: comment.id }),
    onMutate: () => {
      queryClient.setQueryData(queryKey, (prevCommentData?: CommentData) => {
        if (!prevCommentData) return prevCommentData

        return prevCommentData.update({
          likes: (prevCommentData.likes ?? 0) + 1,
          userLiked: true
        })
      })
    },
    onError: () => {
      queryClient.setQueryData(queryKey, (prevCommentData?: CommentData) => {
        if (!prevCommentData) return prevCommentData

        return prevCommentData.update({
          likes: (prevCommentData.likes ?? 0) - 1,
          userLiked: false
        })
      })

      openModal('connection')
    }
  })

  const dislikeMutation = useMutation({
    mutationFn: () => user!.dislikeComment({ commentId: comment.id }),
    onMutate: () => {
      queryClient.setQueryData(
        queryKey,
        (prevCommentData: CommentData | undefined) => {
          if (!prevCommentData) return prevCommentData

          return prevCommentData.update({
            likes: (prevCommentData.likes ?? 0) - 1,
            userLiked: false
          })
        }
      )
    },
    onError: () => {
      queryClient.setQueryData(
        queryKey,
        (prevCommentData: CommentData | undefined) => {
          if (!prevCommentData) return prevCommentData

          return prevCommentData.update({
            likes: (prevCommentData.likes ?? 0) + 1,
            userLiked: true
          })
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
