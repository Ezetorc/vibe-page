import { useState, useRef, FormEvent } from 'react'
import { useSettings } from '../hooks/useSettings'
import { useValidation } from '../hooks/useValidation'
import { getRandomNumber } from '../pages/Create/utilities/getRandomNumber'
import { Button } from './Button'
import EVENT_EMITTER from '../constants/EVENT_EMITTER'
import { NewCommentEvent } from '../models/NewCommentEvent'
import { ErrorMessage } from './ErrorMessage'
import { useSession } from '../hooks/useSession'

export function CommentCreator () {
  const { dictionary, openModal, activeModal } = useSettings()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { validateComment, error, setError } = useValidation()
  const { isSessionActive } = useSession()
  const [commentContent, setCommentContent] = useState<string>('')
  const randomPlaceholderIndex = useRef<number>(getRandomNumber(0, 10))
  const spanRef = useRef<HTMLSpanElement>(null)
  const placeholder =
    dictionary[`createPlaceholder${randomPlaceholderIndex.current}`] || ''

  const handleCreateComment = async () => {
    if (isLoading) return

    if (!isSessionActive) {
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

      EVENT_EMITTER.emit('commentCreated', event)
    } else {
      setIsLoading(false)
    }
  }

  const handleWrite = (event: FormEvent<HTMLTextAreaElement>) => {
    const newCommentContent = event.currentTarget.value.slice(0, 200)
    spanRef.current!.textContent = `${newCommentContent.length}/200`

    setError(null)
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

      <ErrorMessage value={error} />

      <Button
        onClick={handleCreateComment}
        loading={isLoading}
        text={dictionary.comment}
      />
    </article>
  )
}
