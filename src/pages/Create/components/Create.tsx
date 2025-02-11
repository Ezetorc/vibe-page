import { FormEvent, useRef, useState } from 'react'
import { Button } from '../../../components/Button'
import { Nav } from '../../../components/Nav'
import { useUser } from '../../../hooks/useUser'
import { useValidation } from '../../../hooks/useValidation'
import { useNavigate } from 'react-router'
import { useSettings } from '../../../hooks/useSettings'
import { Section } from '../../../components/Section'
import { getRandomNumber } from '../utilities/getRandomNumber'
import { Username } from '../../../components/Username'
import { PostService } from '../../../services/PostService'

export default function Create () {
  const navigate = useNavigate()
  const { user } = useUser()
  const { dictionary } = useSettings()
  const { errorMessage, setErrorMessage, validatePost } = useValidation()
  const [post, setPost] = useState<string>('')
  const spanRef = useRef<HTMLSpanElement | null>(null)
  const randomPlaceholderIndex = useRef<number>(getRandomNumber(0, 10))
  const placeholder: string =
    dictionary[`createPlaceholder${randomPlaceholderIndex.current}`]?.value ||
    ''

  if (!user) return

  const handleWrite = (event: FormEvent<HTMLTextAreaElement>) => {
    const text: string = event.currentTarget.value.slice(0, 200)

    spanRef.current!.textContent = `${text.length}/200`

    setErrorMessage(null)
    setPost(text)
  }

  const handlePost = async () => {
    const isPostValid: boolean = validatePost(post)

    if (isPostValid) {
      const success: boolean = await PostService.create(user.id, post)

      if (success) {
        navigate('/')
      } else {
        setErrorMessage(dictionary.somethingWentWrong?.value)
      }
    }
  }

  return (
    <Section className='grid grid-rows-[1fr,6fr,1fr] h-screen'>
      <header className='w-full h-full flex items-center gap-x-[10px] my-[20px]'>
        <img className='rounded-full w-[50px] aspect-square bg-orange-crayola' />
        <Username username={user.name} />
      </header>

      <main className='relative w-full h-full border-vibe border-caribbean-current rounded-vibe p-[10px]'>
        <textarea
          onInput={handleWrite}
          maxLength={200}
          placeholder={placeholder}
          className='text-[clamp(25px,7vw,30px)] outline-none resize-none w-full h-full bg-transparent font-poppins-regular'
        ></textarea>
        <span
          ref={spanRef}
          className='absolute bottom-0 right-0 m-[10px] text-caribbean-current font-poppins-light'
        >
          0/200
        </span>
      </main>

      <footer className='w-full h-full'>
        <div className='text-red-400 font-poppins-light w-full h-[30px]'>
          {errorMessage}
        </div>
        <Button onClick={handlePost} text={dictionary.post?.value} />
      </footer>

      <Nav />
    </Section>
  )
}
