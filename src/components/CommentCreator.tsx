import { FormEvent, useState } from 'react'
import { useSettings } from '../hooks/useSettings'
import { getRandomNumber } from '../pages/Create/utilities/getRandomNumber'
import { Button } from './Button'
import { ErrorMessage } from './ErrorMessage'
import { useCommentCreator } from '../hooks/useCommentCreator'

export function CommentCreator () {
  const { dictionary } = useSettings()
  const [randomNumber] = useState<number>(getRandomNumber(0, 10))
  const placeholder = dictionary[`createPlaceholder${randomNumber}`] || ''
  const { comment, error, isLoading } = useCommentCreator()

  const handleWrite = (event: FormEvent<HTMLTextAreaElement>) => {
    const newContent = event.currentTarget.value.slice(0, 200)

    error.set(null)
    comment.setContent(newContent)
  }

  return (
    <article className='relative flex flex-col gap-y-[10px] w-full h-[500px]'>
      <div className='p-[10px] relative text-[clamp(25px,7vw,30px)] bg-transparent rounded-vibe border-vibe border-verdigris outline-hidden resize-none w-full h-full '>
        <textarea
          onInput={handleWrite}
          value={comment.content}
          maxLength={200}
          placeholder={placeholder}
          className='p-[10px] text-[clamp(25px,7vw,30px)] bg-transparent outline-hidden resize-none w-full h-full'
        ></textarea>

        <span className='absolute bottom-0 right-0 m-[10px] text-verdigris font-poppins-light'>
          {`${comment.content.length}/200`}
        </span>
      </div>

      <ErrorMessage value={error.get()} />

      <Button
        classname='w-full'
        onClick={comment.create}
        loading={isLoading}
        text={dictionary.comment}
      />
    </article>
  )
}
