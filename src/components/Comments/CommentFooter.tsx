import { useState } from 'react'
import { LikeIcon } from '../Icons'
import { useSettings } from '../../hooks/useSettings'
import { useUser } from '../../hooks/useUser'
import { CommentData } from '../../models/CommentData'

export function CommentFooter (props: {
  commentData: CommentData
  likeComment: () => void
  dislikeComment: () => void
}) {
  const { dictionary, openModal } = useSettings()
  const [loading, setLoading] = useState<boolean>(false)
  const { isSessionActive } = useUser()

  const handleLike = async () => {
    if (!isSessionActive()) {
      openModal('session')
      return
    }

    setLoading(true)

    try {
      if (props.commentData.userLiked === true) {
        props.dislikeComment()
      } else if (props.commentData.userLiked === false) {
        props.likeComment()
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
          <LikeIcon filled={props.commentData.userLiked ?? false} />
        </button>
        <span className='text-verdigris font-poppins-semibold'>
          {props.commentData.likes === null
            ? dictionary.loading
            : props.commentData.likes}
        </span>
      </div>
    </footer>
  )
}
