import { useState, useRef, FormEvent } from 'react'
import { useSettings } from '../hooks/useSettings'
import { useValidation } from '../hooks/useValidation'
import { getRandomNumber } from '../pages/Create/utilities/getRandomNumber'
import { Button } from './Button'
import eventEmitter from '../constants/EVENT_EMITTER'
import { NewCommentEvent } from '../models/NewCommentEvent'
import { useLoggedUser } from '../hooks/useLoggedUser'

export function CommentCreator () {
  const { isSessionActive } = useLoggedUser()
  const { dictionary, openModal, activeModal } = useSettings()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { validateComment, errorMessage, setErrorMessage } = useValidation()
  const [commentContent, setCommentContent] = useState<string>('')
  const randomPlaceholderIndex = useRef<number>(getRandomNumber(0, 10))
  const spanRef = useRef<HTMLSpanElement>(null)
  const placeholder =
    dictionary[`createPlaceholder${randomPlaceholderIndex.current}`] || ''

  const handleCreateComment = async () => {
    if (isLoading) return

    if (!isSessionActive()) {
      openModal('session')
      return
    }

    setIsLoading(true)

    const isCommentValid = validateComment({ comment: commentContent })

    if (isCommentValid && 'postId' in activeModal.data!) {
      const event: NewCommentEvent = {
        content: commentContent,
        postId: activeModal.data.postId as number
      }

      eventEmitter.emit('commentCreated', event)
    } else {
      setIsLoading(false)
    }
  }

  const handleWrite = (event: FormEvent<HTMLTextAreaElement>) => {
    const newCommentContent = event.currentTarget.value.slice(0, 200)
    spanRef.current!.textContent = `${newCommentContent.length}/200`

    setErrorMessage(null)
    setCommentContent(newCommentContent)
  }

  return (
    <article className='relative flex flex-col gap-y-[10px] w-full h-[500px]'>
      <div className='p-[10px] relative text-[clamp(25px,7vw,30px)] bg-transparent rounded-vibe border-vibe border-verdigris outline-hidden resize-none w-full h-full '>
        <textarea
          onInput={handleWrite}
          maxLength={200}
          placeholder={placeholder}
          className='p-[10px] text-[clamp(25px,7vw,30px)] bg-transparent outline-hidden resize-none w-full h-full'
        ></textarea>

        <span
          ref={spanRef}
          className='absolute bottom-0 right-0 m-[10px] text-verdigris font-poppins-light'
        >
          0/200
        </span>
      </div>

      <div className='text-red-500 font-poppins-light w-full h-[30px]'>
        {errorMessage}
      </div>

      <Button
        onClick={handleCreateComment}
        disabled={isLoading}
        text={dictionary.comment}
      />
    </article>
  )
}
