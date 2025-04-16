import { useState } from 'react'
import { LikeIcon } from './Icons'
import { useSettings } from '../hooks/useSettings'
import { Comment } from '../models/Comment'
import { useLike } from '../hooks/useLike'
import { useSession } from '../hooks/useSession'

export function CommentFooter (props: { comment: Comment }) {
  const { dictionary, openModal } = useSettings()
  const [loading, setLoading] = useState<boolean>(false)
  const { isSessionActive } = useSession()
  const { like, dislike } = useLike(props.comment)

  const handleLike = async () => {
    if (!isSessionActive) {
      openModal('session')
      return
    }

    setLoading(true)

    try {
      if (props.comment.userLiked === true) {
        dislike()
      } else if (props.comment.userLiked === false) {
        like()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className='flex items-center gap-x-[3%]'>
      <div className='flex items-center gap-x-[5px]'>
        <button
          className='cursor-pointer'
          onClick={handleLike}
          disabled={loading}
          title='Like'
        >
          <LikeIcon filled={props.comment.userLiked ?? false} />
        </button>
        <span className='text-verdigris font-poppins-semibold'>
          {props.comment.likes === null
            ? dictionary.loading
            : props.comment.likes}
        </span>
      </div>
    </footer>
  )
}
