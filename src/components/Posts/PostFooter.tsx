import { Dispatch, useRef } from 'react'
import { LikeIcon, CommentIcon } from '../Icons'
import { useSettings } from '../../hooks/useSettings'
import { PostData } from '../../models/PostData'
import { useUser } from '../../hooks/useUser'

export function PostFooter (props: {
  postData: PostData
  commentsOpened: boolean
  setCommentsOpened: Dispatch<React.SetStateAction<boolean>>
  likePost: (signal: AbortSignal) => void
  dislikePost: (signal: AbortSignal) => void
  isLoading: boolean
}) {
  const { openModal } = useSettings()
  const { isSessionActive } = useUser()

  const abortControllerRef = useRef<AbortController | null>(null)

  const handleClickLike = async () => {
    if (!isSessionActive()) {
      openModal('session')
      return
    }

    const controller = handleController()

    if (props.postData.id !== null || props.postData.likes !== null) {
      if (props.postData.userLiked) {
        props.dislikePost(controller.signal)
      } else {
        props.likePost(controller.signal)
      }
    }
  }

  const handleController = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    return controller
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
          disabled={props.isLoading}
          title='Like'
        >
          <LikeIcon filled={props.postData.userLiked ?? false} />
        </button>
        <span className='text-verdigris font-poppins-semibold'>
          {props.postData.likes}
        </span>
      </div>

      <div className='flex items-center gap-x-[5px]'>
        <button
          className='cursor-pointer'
          onClick={handleOpenComments}
          disabled={props.isLoading}
          title='Comments'
        >
          <CommentIcon filled={props.commentsOpened} />
        </button>
        <span className='text-verdigris font-poppins-semibold'>
          {props.postData.comments?.length}
        </span>
      </div>
    </footer>
  )
}
