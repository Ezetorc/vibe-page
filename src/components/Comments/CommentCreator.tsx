import { useState, useRef, FormEvent } from 'react'
import { useSettings } from '../../hooks/useSettings'
import { useUser } from '../../hooks/useUser'
import { useValidation } from '../../hooks/useValidation'
import { getRandomNumber } from '../../pages/Create/utilities/getRandomNumber'
import { CommentService } from '../../services/CommentService'
import { Button } from '../Button'
import { CommentCreatorProps } from '../../models/Props/CommentCreatorProps'

export function CommentCreator (props: CommentCreatorProps) {
  const { user } = useUser()
  const { dictionary, openModal, closeModal } = useSettings()
  const { validateComment, errorMessage, setErrorMessage } = useValidation()
  const [commentContent, setCommentContent] = useState<string>('')
  const randomPlaceholderIndex = useRef<number>(getRandomNumber(0, 10))
  const spanRef = useRef<HTMLSpanElement>(null)
  const placeholder =
    dictionary[`createPlaceholder${randomPlaceholderIndex.current}`] || ''

  const handleCreateComment = async () => {
    if (!user) {
      openModal('session')
      return
    }

    const isCommentValid = validateComment({ comment: commentContent })

    if (!isCommentValid) return

    const creation = await CommentService.create({
      userId: user.id,
      postId: props.postId,
      content: commentContent
    })

    if (creation.success) {
      closeModal({ newCommentContent: commentContent })
    } else {
      setErrorMessage(dictionary.somethingWentWrong)
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
      <div className='p-[10px] relative text-[clamp(25px,7vw,30px)] bg-transparent rounded-vibe border-vibe border-verdigris outline-hidden resize-none w-full h-full font-poppins-regular'>
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

      <Button onClick={handleCreateComment} text={dictionary.comment} />
    </article>
  )
}
