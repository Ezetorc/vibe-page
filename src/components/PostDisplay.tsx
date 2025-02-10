import { useEffect, useState } from 'react'
import { LikeIcon } from './Icons'
import { Like } from '../models/Like'
import { User } from '../models/User'
import { useUser } from '../hooks/useUser'
import { useSettings } from '../hooks/useSettings'
import { PostDisplayProps } from '../models/PostDisplayProps'
import { Username } from './Username'
import { Loading } from './Loading'
import { PostMenu } from './PostMenu'

export function PostDisplay ({ post, onDelete }: PostDisplayProps) {
  const { isSessionActive, user } = useUser()
  const { setSessionModalVisible, dictionary } = useSettings()
  const [likes, setLikes] = useState<Like[] | null>(null)
  const [postUser, setPostUser] = useState<User | null>(null)
  const [hasUserLikedPost, setHasUserLikedPost] = useState<boolean>(false)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const postDate: string = post.getDate()

  const handleDelete = async () => {
    await post.delete()
    onDelete(post.id)
  }

  const handleLike = async () => {
    if (isProcessing || !postUser) return

    if (!isSessionActive()) {
      setSessionModalVisible(true)
      return
    }

    setIsProcessing(true)
    try {
      if (hasUserLikedPost) {
        await postUser.unlikePost(post.id)
      } else {
        await postUser.likePost(post.id)
      }

      const updatedLikes = await post.getLikes()
      setLikes(updatedLikes)
      setHasUserLikedPost(!hasUserLikedPost)
    } catch (error) {
      console.error('Error while toggling like:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user: User = await User.getById(post.userId)
        setPostUser(user)

        const likes: Like[] = await post.getLikes()
        setLikes(likes)

        const userLiked: boolean = await user.hasLikedPost(post.id)
        setHasUserLikedPost(userLiked)
      } catch (error) {
        console.error('Error fetching post data:', error)
        setLikes([])
      }
    }

    fetchData()
  }, [post])

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

        {user?.isOwnerOf(post) && (
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
            {likes === null ? dictionary.loading?.value : likes.length}
          </span>
        </div>
      </footer>
    </article>
  )
}
