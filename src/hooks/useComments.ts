import {
  useInfiniteQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'
import { Post } from '../models/Post'
import { useSettings } from './useSettings'
import { CommentService } from '../services/CommentService'
import { Comment } from '../models/Comment'
import { NewCommentEvent } from '../models/NewCommentEvent'
import { useSession } from './useSession'
import { QUERY_KEYS } from '../constants/QUERY_KEYS'
import { User } from '../models/User'

export function useComments (post: Post) {
  const { loggedUser, isSessionActive } = useSession()
  const { openModal, closeModal } = useSettings()
  const queryClient = useQueryClient()
  const queryKey = [QUERY_KEYS.Post, post.id]

  const pagination = useInfiniteQuery({
    queryKey: [QUERY_KEYS.Comments, post.id],
    queryFn: async ({ pageParam }) => {
      if (typeof post.comments === 'number' && post.comments === 0) {
        return []
      } else {
        return await CommentService.getAllOfPost({
          postId: post.id,
          loggedUser,
          page: pageParam
        })
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.length ? allPages.length + 1 : undefined
  })

  const comments = pagination.data?.pages.flat() ?? []

  const updateComments = (updater: (comments: Comment[]) => Comment[]) => {
    queryClient.setQueryData(queryKey, (prevPost?: Post) => {
      if (!prevPost?.comments || typeof prevPost.comments === 'number')
        return prevPost

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
      if (!isSessionActive) return null

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

      post.comments = [...comments, newComment]
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
      post.comments = comments.filter(comment => comment.id !== commentId)
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
    comments,
    createComment: createComment.mutate,
    deleteComment: deleteComment.mutate,
    isLoading: createComment.isPending || pagination.isFetching
  }
}
