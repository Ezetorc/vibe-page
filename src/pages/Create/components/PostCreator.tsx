import { FormEvent, useState } from 'react'
import { ErrorMessage } from '../../../components/ErrorMessage'
import { usePostCreator } from '../hooks/usePostCreator'
import { Button } from '../../../components/Button'
import { useSettings } from '../../../hooks/useSettings'
import { PATHS } from '../../../constants/PATHS'
import { useLocation } from 'wouter'
import { getRandomNumber } from '../utilities/getRandomNumber'

export function PostCreator () {
  const [, navigate] = useLocation()
  const { dictionary } = useSettings()
  const [randomNumber] = useState<number>(getRandomNumber(0, 10))
  const placeholder = dictionary[`createPlaceholder${randomNumber}`] || ''
  const { post, isLoading, error } = usePostCreator()

  const handleInput = (event: FormEvent<HTMLTextAreaElement>) => {
    const newContent = event.currentTarget.value.slice(0, 200)

    error.set(null)
    post.setContent(newContent)
  }

  const handleSubmit = async () => {
    const success = await post.create()

    if (success) {
      navigate(PATHS.homeSection)
    }
  }

  return (
    <article className='relative w-full mobile:h-[clamp(200px,50%,300px)] desktop:h-[clamp(400px,100%,600px)] border-vibe border-caribbean-current rounded-vibe'>
      <textarea
        onInput={handleInput}
        maxLength={200}
        value={post.content}
        placeholder={placeholder}
        className='p-[10px] text-[clamp(25px,15vw,35px)] outline-hidden resize-none w-full h-full bg-transparent'
      ></textarea>
      <span className='absolute bottom-0 right-0 m-[10px] text-caribbean-current font-poppins-light'>
        {`${post.content.length}/200`}
      </span>

      <ErrorMessage value={error.get()} />

      <Button
        classname='w-full'
        loading={isLoading}
        onClick={handleSubmit}
        text={dictionary.post}
      />
    </article>
  )
}
