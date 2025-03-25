import { FormEvent, useRef, useState } from 'react'
import { getRandomNumber } from '../utilities/getRandomNumber'
import { useSettings } from '../../../hooks/useSettings'
import { Button } from '../../../components/Button'
import { useNavigate } from 'react-router'
import { useUser } from '../../../hooks/useUser'
import { useValidation } from '../../../hooks/useValidation'
import { PostService } from '../../../services/PostService'
import { InfiniteData, useQueryClient } from '@tanstack/react-query'
import { Post } from '../../../models/Post'
import { UserData } from '../../Account/models/UserData'

export function PostCreator () {
  const navigate = useNavigate()
  const { user } = useUser()
  const queryClient = useQueryClient()
  const { dictionary, openModal } = useSettings()
  const { validatePost, errorMessage, setErrorMessage } = useValidation()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [postContent, setPostContent] = useState<string>('')
  const randomPlaceholderIndex = useRef<number>(getRandomNumber(0, 10))
  const spanRef = useRef<HTMLSpanElement>(null)
  const placeholder =
    dictionary[`createPlaceholder${randomPlaceholderIndex.current}`] || ''

  const updateQueryData = (postCreated: Post | null) => {
    queryClient.setQueriesData(
      { queryKey: ['posts'] },
      (data: InfiniteData<Post[]> | undefined) => {
        if (!data) return data

        return {
          ...data,
          pages: [[postCreated, ...data.pages[0]], ...data.pages.slice(1)],
          pageParams: data.pageParams
        }
      }
    )

    queryClient.setQueryData(['userData', 'me'], (oldUserData: UserData) => {
      if (!oldUserData?.postsAmount) return oldUserData

      return new UserData({
        ...oldUserData,
        postsAmount: oldUserData.postsAmount + 1
      })
    })
  }

  const handleCreatePost = async () => {
    if (isLoading) return

    setIsLoading(true)

    if (!user) {
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
      userId: user.id,
      content: postContent
    })

    console.log('postCreated: ', postCreated, user.id, postContent)

    if (postCreated !== null) {
      updateQueryData(postCreated)
      setPostContent('')
      navigate('/')
    } else {
      setErrorMessage(dictionary.somethingWentWrong)
    }

    setIsLoading(false)
  }

  const handleWrite = (event: FormEvent<HTMLTextAreaElement>) => {
    const newPostContent = event.currentTarget.value.slice(0, 200)
    spanRef.current!.textContent = `${newPostContent.length}/200`

    setErrorMessage(null)
    setPostContent(newPostContent)
  }

  return (
    <article className='relative w-full h-full border-vibe border-caribbean-current rounded-vibe'>
      <textarea
        onInput={handleWrite}
        maxLength={200}
        placeholder={placeholder}
        className='p-[10px] text-[clamp(25px,7vw,30px)] outline-hidden resize-none w-full h-full bg-transparent font-poppins-regular'
      ></textarea>
      <span
        ref={spanRef}
        className='absolute bottom-0 right-0 m-[10px] text-caribbean-current font-poppins-light'
      >
        0/200
      </span>

      <div className='text-red-400 font-poppins-light w-full h-[30px]'>
        {errorMessage}
      </div>

      <Button onClick={handleCreatePost} text={dictionary.post} />
    </article>
  )
}
