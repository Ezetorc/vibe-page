import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useSession } from '../../../hooks/useSession'
import { useSettings } from '../../../hooks/useSettings'
import { useValidation } from '../../../hooks/useValidation'
import { Post } from '../../../models/Post'
import { UserInteractions } from '../../../models/UserInteractions'
import { FollowService } from '../../../services/FollowService'
import { PostService } from '../../../services/PostService'
import { QUERY_KEYS } from '../../../constants/QUERY_KEYS'

export function usePostCreator () {
  const { isSessionActive, loggedUser } = useSession()
  const queryClient = useQueryClient()
  const { openModal } = useSettings()
  const { validatePost, error, setError } = useValidation()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [postContent, setPostContent] = useState<string>('')

  const updateCache = () => {
    queryClient.setQueryData<UserInteractions>(
      QUERY_KEYS.userInteractions(loggedUser?.id),
      prevUserInteractions => {
        if (!prevUserInteractions || !('update' in prevUserInteractions))
          return prevUserInteractions

        return prevUserInteractions.update({
          postsAmount: prevUserInteractions.postsAmount + 1
        })
      }
    )

    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.posts(),
      exact: false
    })

    queryClient.refetchQueries({
      queryKey: QUERY_KEYS.posts(),
      exact: false
    })
  }

  const sendNotifications = async (newPost: Post) => {
    const postUserFollowersIds =
      await FollowService.getFollowersIdsOfLoggedUser()

    postUserFollowersIds.forEach(followerId => {
      newPost.createNotification({
        owner: newPost.user,
        followerId
      })
    })
  }

  const isPostValid = () => {
    if (!isSessionActive) {
      openModal('session')
      setIsLoading(false)
      return false
    }

    const isValid = validatePost({ postContent })

    if (!isValid) {
      setIsLoading(false)
      return false
    }

    return true
  }

  const createPost = async () => {
    if (isLoading) return false

    setIsLoading(true)

    if (!isPostValid()) return false

    const newPost = await PostService.create({
      userId: loggedUser!.id,
      content: postContent
    })

    if (newPost) {
      updateCache()
      setIsLoading(false)
      sendNotifications(newPost)
      setPostContent('')
      return true
    } else {
      setIsLoading(false)
      return false
    }
  }

  return {
    post: {
      content: postContent,
      setContent: setPostContent,
      create: createPost
    },
    error: {
      get: () => error,
      set: setError
    },
    sendNotifications,
    isLoading
  }
}
