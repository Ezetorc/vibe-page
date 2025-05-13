import { useLike } from '../hooks/useLike'
import { useSettings } from '../hooks/useSettings'
import { LikeIcon } from './Icons'
import { Comment } from '../models/Comment'
import { Post } from '../models/Post'

export function LikeButton (props: { target: Comment | Post }) {
  const { dictionary } = useSettings()
  const { handleLike, hasUserLiked, isLoading } = useLike(props.target)
  const title = hasUserLiked ? dictionary.dislike : dictionary.like

  return (
    <div className='flex items-center gap-x-[5px]'>
      <button
        className='cursor-pointer'
        onClick={handleLike}
        disabled={isLoading}
        title={title}
      >
        <LikeIcon filled={hasUserLiked} />
      </button>

      <span className='text-verdigris font-poppins-semibold'>
        {props.target.likes}
      </span>
    </div>
  )
}
