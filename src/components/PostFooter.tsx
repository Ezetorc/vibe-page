import { Dispatch } from 'react'
import { LikeIcon, CommentIcon } from './Icons'
import { useSettings } from '../hooks/useSettings'
import { Post } from '../models/Post'
import { useLike } from '../hooks/useLike'
import { useSession } from '../hooks/useSession'

export function PostFooter (props: {
  post: Post
  commentsOpened: boolean
  setCommentsOpened: Dispatch<React.SetStateAction<boolean>>
}) {
  const { openModal, dictionary } = useSettings()
  const { like, dislike } = useLike(props.post)
  const { isSessionActive } = useSession()

  const handleClickLike = async () => {
    if (!isSessionActive) {
      openModal('session')
      return
    }

    if (props.post.id !== null || props.post.likes !== null) {
      if (props.post.userLiked) {
        dislike()
      } else {
        like()
      }
    }
  }

  const handleOpenComments = () => {
    props.setCommentsOpened(prevCommentsOpened => !prevCommentsOpened)
  }

  return (
    <footer className='flex items-center gap-x-[3%]'>
      <div className='flex items-center gap-x-[5px]'>
        <button
          className='cursor-pointer'
          onClick={handleClickLike}
          title='Like'
        >
          <LikeIcon filled={props.post.userLiked ?? false} />
        </button>
        <span className='text-verdigris font-poppins-semibold'>
          {props.post.likes}
        </span>
      </div>

      <div className='flex items-center gap-x-[5px]'>
        <button
          className='cursor-pointer'
          onClick={handleOpenComments}
          title={dictionary.comment}
        >
          <CommentIcon filled={props.commentsOpened} />
        </button>
        <span className='text-verdigris font-poppins-semibold'>
          {typeof props.post.comments === 'number' && props.post.comments}
        </span>
      </div>
    </footer>
  )
}
