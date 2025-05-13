import { useState } from 'react'
import { useSettings } from './useSettings'
import { useValidation } from './useValidation'
import { EVENT_EMITTER } from '../constants/EVENT_EMITTER'
import { NewCommentEvent } from '../models/NewCommentEvent'
import { useSession } from './useSession'

export function useCommentCreator () {
  const { openModal, modal } = useSettings()
  const { validateComment, error, setError } = useValidation()
  const { isSessionActive } = useSession()
  const [content, setContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const isValid = () => {
    if (isLoading) return false

    if (!isSessionActive) {
      openModal('session')
      return false
    }

    const isCommentValid = validateComment({ commentContent: content })

    return isCommentValid && modal.has('postId')
  }

  const createComment = async () => {
    if (!isValid()) return

    setIsLoading(true)

    const event: NewCommentEvent = {
      content,
      postId: modal.data!.postId!
    }

    EVENT_EMITTER.emit('commentCreated', event)
  }

  return {
    comment: {
      create: createComment,
      setContent,
      content
    },
    isLoading,
    error: {
      set: setError,
      get: () => error
    }
  }
}
