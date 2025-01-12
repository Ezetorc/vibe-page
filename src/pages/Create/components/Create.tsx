import { FormEvent, useRef, useState } from 'react'
import { Button } from '../../../components/Button'
import { Nav } from '../../../components/Nav'
import { useUser } from '../../../hooks/useUser'
import { useValidation } from '../../../hooks/useValidation'
import { Post } from '../../../models/Post'
import { useNavigate } from 'react-router'

export default function Create () {
  const navigate = useNavigate()
  const { user } = useUser()
  const { errorMessage, setErrorMessage, validatePost } = useValidation()
  const [post, setPost] = useState<string>('')
  const spanRef = useRef<HTMLSpanElement | null>(null)

  if (!user) return

  const handleWrite = (event: FormEvent<HTMLTextAreaElement>): void => {
    const text: string = event.currentTarget.value.slice(0, 200)

    spanRef.current!.textContent = `${text.length}/200`

    setErrorMessage(null)
    setPost(text)
  }

  const handlePost = async (): Promise<void> => {
    const isPostValid: boolean = validatePost(post)

    if (isPostValid) {
      const success: boolean = await Post.create(user.id, post)

      if (success) {
        navigate('/')
      } else {
        setErrorMessage('Something went wrong, try again')
      }
    }
  }

  return (
    <section className='pb-nav w-[clamp(320px,100%,700px)] gap-y-[20px] p-[clamp(5px,3%,10px)] grid grid-rows-[1fr,6fr,1fr] h-screen'>
      <header className='w-full h-full flex items-center gap-x-[10px] my-[20px]'>
        <img className='rounded-full w-[50px] aspect-square bg-orange-crayola' />
        <h3 className='text-orange-crayola font-poppins-regular text-[clamp(10px,7vw,20px)]'>
          {user.name || 'Loading...'}
        </h3>
      </header>

      <main className='relative w-full h-full border-vibe border-caribbean-current rounded-vibe p-[10px]'>
        <textarea
          onInput={handleWrite}
          maxLength={200}
          placeholder='Yesterday I went to my grandma’s house and...'
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
        <Button onClick={handlePost} text='Post' />
      </footer>

      <Nav />
    </section>
  )
}
