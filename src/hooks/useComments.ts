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
import { UserInteractions } from '../models/UserInteractions'
import { QUERY_KEYS } from '../constants/QUERY_KEYS'

export function useComments (post: Post) {
  const { loggedUser, isSessionActive } = useSession()
  const { openModal, closeModal } = useSettings()
  const queryClient = useQueryClient()

  const pagination = useInfiniteQuery({
    queryKey: QUERY_KEYS.comments(post.id),
    queryFn: async ({ pageParam }) => {
      if (typeof post.comments === 'number' && post.comments === 0) {
        return []
      } else {
        return await CommentService.getAllOfPost({
          postId: post.id,
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
    queryClient.setQueryData(QUERY_KEYS.post(post.id), (prevPost?: Post) => {
      if (!prevPost?.comments || typeof prevPost.comments === 'number')
        return prevPost

      return prevPost.update({
        comments: updater(prevPost.comments)
      })
    })
  }

  const updatePostsAmount = (type: 'create' | 'delete') => {
    queryClient.setQueryData(
      QUERY_KEYS.userInteractions(post.user.id),
      (prevUserInteractions?: UserInteractions) => {
        if (!prevUserInteractions) return prevUserInteractions

        if (type == 'create') {
          return prevUserInteractions.update({
            postsAmount: prevUserInteractions.postsAmount + 1
          })
        } else {
          return prevUserInteractions.update({
            postsAmount: prevUserInteractions.postsAmount - 1
          })
        }
      }
    )
  }

  const createComment = useMutation({
    mutationFn: async (event: NewCommentEvent) => {
      if (!isSessionActive) return null

      return await CommentService.create({
        userId: loggedUser!.id,
        postId: event.postId,
        content: event.content
      })
    },
    onSuccess: newComment => {
      if (!newComment || !loggedUser) {
        openModal('connection')
        return
      }

      if (loggedUser.id !== post.user.id) {
        newComment.createNotification({ post, sender: loggedUser })
      }

      post.comments = [...comments, newComment]
      closeModal()
      updateComments(comments => [...comments, newComment])
      updatePostsAmount('create')
    },
    onError: () => openModal('connection')
  })

  const deleteComment = useMutation({
    mutationFn: (commentId: number) => CommentService.delete({ commentId }),
    onMutate: (commentId: number) => {
      post.comments = comments.filter(comment => comment.id !== commentId)
    },
    onSuccess: deletedCommentId => {
      if (!deletedCommentId) return

      closeModal()
      updateComments(comments =>
        comments.filter(comment => comment.id !== deletedCommentId)
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
