import { useEffect, useState } from 'react'
import { format, parse } from '@formkit/tempo'
import { Post } from '../models/Post'
import { LikeIcon } from './Icons'
import { Like } from '../models/Like'
import { User } from '../models/User'

export function PostDisplay ({ post }: { post: Post }) {
  const [likes, setLikes] = useState<Like[] | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [hasUserLikedPost, setHasUserLikedPost] = useState<boolean>(false)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const storedDate: string = post.createdAt
  const parsedDate: Date = parse(storedDate, 'yyyy-MM-dd HH:mm:ss')
  const formattedDate: string = format(parsedDate, 'DD/MM/YYYY')

  const handleLike = async () => {
    if (isProcessing || !user) return

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
    <article className='w-[clamp(300px,100%,600px)] py-[10px] px-[20px] rounded-vibe border-vibe border-caribbean-current overflow-hidden'>
      <header className='w-full h-[70px] grid grid-cols-2 items-center'>
        <div className='flex items-center gap-x-[10px]'>
          <img className='rounded-full w-[50px] aspect-square bg-orange-crayola' />
          <h3 className='text-orange-crayola font-poppins-regular text-[clamp(10px,7vw,20px)]'>
            {user?.name || 'Loading...'}
          </h3>
        </div>
        <span className='text-caribbean-current text-right font-poppins-light text-[clamp(5px,6vw,20px)]'>
          {formattedDate}
        </span>
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
            {likes === null ? 'Loading...' : likes.length}
          </span>
        </div>
      </footer>
    </article>
  )
}
