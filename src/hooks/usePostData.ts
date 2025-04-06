import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Post } from '../models/Post'
import { PostData } from '../models/PostData'
import { useUser } from './useUser'
import { useSettings } from './useSettings'
import { CommentService } from '../services/CommentService'
import { Comment } from '../models/Comment'
import { NewCommentEvent } from '../models/NewCommentEvent'

export function usePostData (post: Post) {
  const { user, isSessionActive } = useUser()
  const { openModal, closeModal } = useSettings()
  const queryClient = useQueryClient()
  const queryKey = ['postData', post.id]
  const query = useQuery({
    queryKey,
    queryFn: () => PostData.getFromPost({ post, loggedUser: user }),
    enabled: post.id >= 0
  })

  const likeMutation = useMutation({
    mutationFn: (signal: AbortSignal) =>
      user!.likePost({ postId: post.id, signal }),
    onMutate: () => {
      queryClient.setQueryData(queryKey, (prevPostData?: PostData) => {
        if (!prevPostData) return prevPostData

        return prevPostData.update({
          likes: (prevPostData.likes ?? 0) + 1,
          userLiked: true
        })
      })
    },
    onError: () => {
      queryClient.setQueryData(queryKey, (prevPostData?: PostData) => {
        if (!prevPostData) return prevPostData

        return prevPostData.update({
          likes: (prevPostData.likes ?? 0) - 1,
          userLiked: false
        })
      })

      openModal('connection')
    }
  })

  const dislikeMutation = useMutation({
    mutationFn: (signal: AbortSignal) =>
      user!.dislikePost({ postId: post.id, signal }),
    onMutate: () => {
      queryClient.setQueryData(
        queryKey,
        (prevPostData: PostData | undefined) => {
          if (!prevPostData) return prevPostData

          return prevPostData.update({
            likes: (prevPostData.likes ?? 0) - 1,
            userLiked: false
          })
        }
      )
    },
    onError: () => {
      queryClient.setQueryData(
        queryKey,
        (prevPostData: PostData | undefined) => {
          if (!prevPostData) return prevPostData

          return prevPostData.update({
            likes: (prevPostData.likes ?? 0) + 1,
            userLiked: true
          })
        }
      )

      openModal('connection')
    }
  })

  const createComment = useMutation({
    mutationFn: async (event: NewCommentEvent) => {
      if (!isSessionActive()) return null

      return await CommentService.create({
        userId: user!.id,
        postId: event.postId,
        content: event.content
      })
    },
    onSuccess: (newComment: Comment | null) => {
      if (!newComment) return

      closeModal()

      queryClient.setQueryData(
        queryKey,
        (prevPostData: PostData | undefined) => {
          if (!prevPostData?.comments) return prevPostData

          return prevPostData.update({
            comments: [...prevPostData.comments, newComment]
          })
        }
      )
    },
    onError: () => openModal('connection')
  })

  const deleteComment = useMutation({
    mutationFn: (commentId: number) => CommentService.delete({ commentId }),
    onSuccess: (newComment: Comment | null) => {
      if (!newComment) return

      closeModal()

      queryClient.setQueryData(
        ['postData', post.id],
        (prevPostData: PostData | undefined) => {
          if (!prevPostData?.comments) return prevPostData

          return prevPostData.update({
            comments: [...prevPostData.comments].filter(
              comment => comment.id !== newComment.id
            )
          })
        }
      )
    },
    onError: () => openModal('connection')
  })

  return {
    postData: query.data ?? PostData.default,
    isLoading: query.isLoading,
    likePost: (signal: AbortSignal) => likeMutation.mutate(signal),
    dislikePost: (signal: AbortSignal) => dislikeMutation.mutate(signal),
    createComment: (event: NewCommentEvent) => createComment.mutate(event),
    deleteComment: (commentId: number) => deleteComment.mutate(commentId)
  }
}
