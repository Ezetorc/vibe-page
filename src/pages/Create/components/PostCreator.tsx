import { FormEvent, useRef, useState } from 'react'
import { getRandomNumber } from '../utilities/getRandomNumber'
import { useSettings } from '../../../hooks/useSettings'
import { Button } from '../../../components/Button'
import { useValidation } from '../../../hooks/useValidation'
import { PostService } from '../../../services/PostService'
import { InfiniteData, useQueryClient } from '@tanstack/react-query'
import { Post } from '../../../models/Post'
import { PATHS } from '../../../constants/PATHS'
import { User } from '../../../models/User'
import { useSession } from '../../../hooks/useSession'
import { QUERY_KEYS } from '../../../constants/QUERY_KEYS'
import { useLocation } from 'wouter'
import { ErrorMessage } from '../../../components/ErrorMessage'

export function PostCreator () {
  const [, navigate] = useLocation()
  const { loggedUser } = useSession()
  const queryClient = useQueryClient()
  const { dictionary, openModal } = useSettings()
  const { validatePost, error, setError } = useValidation()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [postContent, setPostContent] = useState<string>('')
  const randomPlaceholderIndex = useRef<number>(getRandomNumber(0, 10))
  const spanRef = useRef<HTMLSpanElement>(null)
  const placeholder =
    dictionary[`createPlaceholder${randomPlaceholderIndex.current}`] || ''

  const updateQueryData = (postCreated: Post | null) => {
    queryClient.setQueriesData(
      { queryKey: [QUERY_KEYS.Posts] },
      (data: InfiniteData<Post[]> | undefined) => {
        if (!data) return data

        return {
          ...data,
          pages: [[postCreated, ...data.pages[0]], ...data.pages.slice(1)],
          pageParams: data.pageParams
        }
      }
    )

    queryClient.setQueryData(
      [QUERY_KEYS.User, loggedUser?.id],
      (prevUser?: User) => {
        if (!prevUser?.postsAmount) return prevUser

        return prevUser.update({ postsAmount: prevUser.postsAmount + 1 })
      }
    )
  }

  const handleCreatePost = async () => {
    if (isLoading) return

    setIsLoading(true)

    if (!loggedUser) {
      openModal('session')
      setIsLoading(false)
      return
    }

    const isPostValid = validatePost({ post: postContent })

    if (!isPostValid) {
      setIsLoading(false)
      return
    }

    const postCreated = await PostService.create({
      userId: loggedUser.id,
      content: postContent,
      loggedUser
    })

    if (postCreated !== null) {
      updateQueryData(postCreated)
      setPostContent('')
      navigate(PATHS.homeSection)
    } else {
      setError(dictionary.somethingWentWrong)
    }

    setIsLoading(false)
  }

  const handleWrite = (event: FormEvent<HTMLTextAreaElement>) => {
    const newPostContent = event.currentTarget.value.slice(0, 200)
    spanRef.current!.textContent = `${newPostContent.length}/200`

    setError(null)
    setPostContent(newPostContent)
  }

  return (
    <article className='relative w-full mobile:h-[clamp(200px,50%,300px)] desktop:h-[clamp(400px,100%,600px)] border-vibe border-caribbean-current rounded-vibe'>
      <textarea
        onInput={handleWrite}
        maxLength={200}
        placeholder={placeholder}
        className='p-[10px] text-[clamp(25px,7vw,30px)] outline-hidden resize-none w-full h-full bg-transparent '
      ></textarea>
      <span
        ref={spanRef}
        className='absolute bottom-0 right-0 m-[10px] text-caribbean-current font-poppins-light'
      >
        0/200
      </span>

      <ErrorMessage value={error} />

      <Button onClick={handleCreatePost} text={dictionary.post} />
    </article>
  )
}
