import { useEffect, useState } from 'react'
import { LikeIcon } from './Icons'
import { Like } from '../models/Like'
import { User } from '../models/User'
import { useUser } from '../hooks/useUser'
import { useSettings } from '../hooks/useSettings'
import { PostDisplayProps } from '../models/PostDisplayProps'
import { Link } from 'react-router'

export function PostDisplay ({ post, onDelete }: PostDisplayProps) {
  const { isSessionActive } = useUser()
  const { setSessionModalVisible, dictionary } = useSettings()
  const [likes, setLikes] = useState<Like[] | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [hasUserLikedPost, setHasUserLikedPost] = useState<boolean>(false)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const postDate: string = post.getDate()

  const handleDelete = async () => {
    await post.delete()
    onDelete(post.id)
  }

  const handleLike = async () => {
    if (isProcessing || !user) return

    if (!isSessionActive()) {
      setSessionModalVisible(true)
      return
    }

    setIsProcessing(true)
    try {
      if (hasUserLikedPost) {
        await user.unlikePost(post.id)
      } else {
        await user.likePost(post.id)
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
        setUser(user)

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
      <header className='w-full h-[70px] grid grid-cols-2 items-center'>
        <div className='flex items-center gap-x-[10px]'>
          <img className='rounded-full w-[50px] aspect-square bg-orange-crayola' />
          {user ? (
            <Link
              className='text-orange-crayola font-poppins-regular content-end text-[clamp(20px,7vw,25px)]'
              to={`/account/${user.name}`}
            >
              {user.name}
            </Link>
          ) : (
            <h3>{dictionary.loading?.value}</h3>
          )}
        </div>
        <span className='text-caribbean-current text-right font-poppins-light text-[clamp(5px,6vw,20px)]'>
          {postDate}
        </span>

        {user?.id === post.userId && (
          <button onClick={handleDelete}>delete</button>
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
