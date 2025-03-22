import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Post } from '../models/Post'
import { PostData } from '../models/PostData'
import { UserService } from '../services/UserService'
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

  const fetchPostData = async () => {
    const [newUser, newLikes, newComments, newUserLiked] = await Promise.all([
      UserService.getById({ userId: post.userId }),
      post.getLikesAmount(),
      post.getComments(),
      user?.hasLikedPost({ postId: post.id })
    ])

    const newPostData = new PostData({
      user: newUser,
      likes: newLikes,
      comments: newComments,
      userLiked: Boolean(newUserLiked),
      id: post.id,
      date: post.getDate(),
      content: post.content
    })

    return newPostData
  }

  const query = useQuery({
    queryKey,
    queryFn: fetchPostData,
    enabled: post.id >= 0
  })

  const likeMutation = useMutation({
    mutationFn: (signal: AbortSignal) =>
      user!.likePost({ postId: post.id, signal }),
    onMutate: () => {
      queryClient.setQueryData(
        queryKey,
        (oldPostData: PostData | undefined) => {
          if (!oldPostData) return oldPostData

          const updatedPostData = new PostData({
            ...oldPostData,
            likes: (oldPostData.likes ?? 0) + 1,
            userLiked: true
          })

          return updatedPostData
        }
      )
    },
    onError: () => {
      queryClient.setQueryData(
        queryKey,
        (oldPostData: PostData | undefined) => {
          if (!oldPostData) return oldPostData

          const updatedPostData = new PostData({
            ...oldPostData,
            likes: (oldPostData.likes ?? 0) - 1,
            userLiked: false
          })

          return updatedPostData
        }
      )

      openModal('connection')
    }
  })

  const dislikeMutation = useMutation({
    mutationFn: (signal: AbortSignal) =>
      user!.dislikePost({ postId: post.id, signal }),
    onMutate: () => {
      queryClient.setQueryData(
        queryKey,
        (oldPostData: PostData | undefined) => {
          if (!oldPostData) return oldPostData

          const updatedPostData = new PostData({
            ...oldPostData,
            likes: (oldPostData.likes ?? 0) - 1,
            userLiked: false
          })

          return updatedPostData
        }
      )
    },
    onError: () => {
      queryClient.setQueryData(
        queryKey,
        (oldPostData: PostData | undefined) => {
          if (!oldPostData) return oldPostData

          const updatedPostData = new PostData({
            ...oldPostData,
            likes: (oldPostData.likes ?? 0) + 1,
            userLiked: true
          })

          return updatedPostData
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
        (oldPostData: PostData | undefined) => {
          if (!oldPostData?.comments) return oldPostData

          const updatedPostData = new PostData({
            ...oldPostData,
            comments: [...oldPostData.comments, newComment]
          })

          return updatedPostData
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
        (oldPostData: PostData | undefined) => {
          if (!oldPostData?.comments) return oldPostData

          const updatedPostData = new PostData({
            ...oldPostData,
            comments: [...oldPostData.comments].filter(
              comment => comment.id !== newComment.id
            )
          })

          return updatedPostData
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
