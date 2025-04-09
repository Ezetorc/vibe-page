import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Post } from '../models/Post'
import { useSettings } from './useSettings'
import { CommentService } from '../services/CommentService'
import { Comment } from '../models/Comment'
import { NewCommentEvent } from '../models/NewCommentEvent'
import { useLoggedUser } from './useLoggedUser'
import { QUERY_KEYS } from '../constants/QUERY_KEYS'
import { User } from '../models/User'

export function useComment (post: Post) {
  const { loggedUser, isSessionActive } = useLoggedUser()
  const { openModal, closeModal } = useSettings()
  const queryClient = useQueryClient()
  const queryKey = [QUERY_KEYS.Post, post.id]

  const updateComments = (updater: (comments: Comment[]) => Comment[]) => {
    queryClient.setQueryData(queryKey, (prevPost?: Post) => {
      if (!prevPost?.comments) return prevPost

      return prevPost.update({
        comments: updater(prevPost.comments)
      })
    })
  }

  const updatePostsAmount = (type: 'create' | 'delete') => {
    queryClient.setQueryData(['user', post.user.id], (prevUser?: User) => {
      if (!prevUser) return prevUser

      if (type == 'create') {
        return prevUser.update({
          postsAmount: prevUser.postsAmount + 1
        })
      } else {
        return prevUser.update({
          postsAmount: prevUser.postsAmount - 1
        })
      }
    })
  }

  const createComment = useMutation({
    mutationFn: async (event: NewCommentEvent) => {
      if (!isSessionActive()) return null

      return await CommentService.create({
        userId: loggedUser!.id,
        postId: event.postId,
        content: event.content,
        loggedUser
      })
    },
    onSuccess: newComment => {
      if (!newComment) {
        openModal('connection')
        return
      }

      post.comments = [...post.comments, newComment]
      closeModal()
      updateComments(comments => [...comments, newComment])
      updatePostsAmount('create')
    },
    onError: () => openModal('connection')
  })

  const deleteComment = useMutation({
    mutationFn: (commentId: number) =>
      CommentService.delete({ commentId, loggedUser }),
    onMutate: (commentId: number) => {
      post.comments = post.comments.filter(comment => comment.id !== commentId)
    },
    onSuccess: deletedComment => {
      if (!deletedComment) return

      closeModal()
      updateComments(comments =>
        comments.filter(comment => comment.id !== deletedComment.id)
      )
      updatePostsAmount('delete')
    },
    onError: () => openModal('connection')
  })

  return {
    createComment: createComment.mutate,
    deleteComment: deleteComment.mutate,
    isCreating: createComment.isPending,
    isDeleting: deleteComment.isPending,
    errorCreating: createComment.error,
    errorDeleting: deleteComment.error
  }
}
