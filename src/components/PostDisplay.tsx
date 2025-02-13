import { useCallback, useEffect, useState } from 'react'
import { LikeIcon } from './Icons'
import { Like } from '../models/Like'
import { User } from '../models/User'
import { useUser } from '../hooks/useUser'
import { useSettings } from '../hooks/useSettings'
import { PostDisplayProps } from '../models/PostDisplayProps'
import { Username } from './Username'
import { Loading } from './Loading'
import { PostMenu } from './PostMenu'
import { UserService } from '../services/UserService'

export function PostDisplay ({ post, onDelete }: PostDisplayProps) {
  const { isSessionActive, user } = useUser()
  const { setVisibleModal, dictionary } = useSettings()
  const [likes, setLikes] = useState<Like[]>([])
  const [postUser, setPostUser] = useState<User>()
  const [hasUserLikedPost, setHasUserLikedPost] = useState<boolean>(false)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const postDate: string = post.getDate()

  const handleDelete = async () => {
    const deleted = await post.delete()

    if (deleted.success) {
      onDelete(post.id)
    }
  }

  const handleLike = async () => {
    if (isProcessing || !postUser) return

    if (!isSessionActive()) {
      setVisibleModal({
        name: 'session'
      })
      return
    }

    setIsProcessing(true)

    if (hasUserLikedPost) {
      await postUser.unlikePost({ postId: post.id })
    } else {
      await postUser.likePost({ postId: post.id })
    }

    handleUpdatedLikes()
  }

  const handleUpdatedLikes = async () => {
    const updatedLikes = await post.getLikes()

    if (!updatedLikes.value) return

    setLikes(updatedLikes.value)
    setHasUserLikedPost(!hasUserLikedPost)
    setIsProcessing(false)
  }

  const handlePostUser = useCallback(async () => {
    const newPostUser = await UserService.getById({
      userId: post.userId
    })

    if (newPostUser.value) {
      setPostUser(newPostUser.value)

      const newHasUserLikedPost = await newPostUser.value.hasLikedPost({
        postId: post.id
      })

      if (newHasUserLikedPost.value) {
        setHasUserLikedPost(newHasUserLikedPost.value)
      }
    }
  }, [post.id, post.userId])

  const handleNewLikes = useCallback(async () => {
    const newLikes = await post.getLikes()

    if (newLikes.value) {
      setLikes(newLikes.value)
    }
  }, [post])

  const fetchData = useCallback(async () => {
    handlePostUser()
    handleNewLikes()
  }, [handlePostUser, handleNewLikes])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <article className='w-[clamp(300px,100%,700px)] py-[10px] px-[20px] rounded-vibe border-vibe border-caribbean-current overflow-hidden'>
      <header className='w-full h-[70px] grid grid-cols-[10fr,10fr,1fr] items-center'>
        <div className='flex items-center gap-x-[10px]'>
          <img className='rounded-full w-[50px] aspect-square bg-orange-crayola' />
          {postUser ? <Username username={postUser.name} /> : <Loading />}
        </div>
        <span className='text-caribbean-current text-right font-poppins-light text-[clamp(5px,6vw,20px)]'>
          {postDate}
        </span>

        {user?.isOwnerOf({ post }) && (
          <div className='flex justify-end items-center'>
            <PostMenu onDelete={handleDelete} />
          </div>
        )}
      </header>

      <main className='w-full flex flex-col'>
        <p className='break-words text-white text-[clamp(5px,6vw,20px)] font-poppins-regular'>
          {post.content}
        </p>
      </main>

      <footer>
        <div className='flex items-center gap-x-[1%]'>
          <button onClick={handleLike} disabled={isProcessing}>
            <LikeIcon filled={hasUserLikedPost} />
          </button>
          <span className='text-verdigris font-poppins-semibold'>
            {likes === null ? dictionary.loading : likes.length}
          </span>
        </div>
      </footer>
    </article>
  )
}
