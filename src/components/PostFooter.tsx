import { Dispatch } from 'react'
import { CommentIcon } from './Icons'
import { useSettings } from '../hooks/useSettings'
import { Post } from '../models/Post'
import { LikeButton } from './LikeButton'

export function PostFooter (props: {
  post: Post
  commentsOpened: boolean
  setCommentsOpened: Dispatch<React.SetStateAction<boolean>>
}) {
  const { dictionary } = useSettings()

  const handleOpenComments = () => {
    props.setCommentsOpened(prev => !prev)
  }

  return (
    <footer className='flex items-center gap-x-[3%]'>
      <LikeButton target={props.post} />

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
