import { Dispatch, useRef, useState } from 'react'
import { LikeIcon, CommentIcon } from '../Icons'
import { useSettings } from '../../hooks/useSettings'
import { PostData } from '../../models/PostData'
import { useUser } from '../../hooks/useUser'

export function PostFooter (props: {
  postData: PostData
  commentsOpened: boolean
  setCommentsOpened: Dispatch<React.SetStateAction<boolean>>
  setPostData: Dispatch<React.SetStateAction<PostData>>
}) {
  const { openModal } = useSettings()
  const [loading, setLoading] = useState<boolean>(false)
  const { isSessionActive, user } = useUser()

  const abortControllerRef = useRef<AbortController | null>(null)

  const handleClickLike = async () => {
    if (!isSessionActive()) {
      openModal('session')
      return
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    setLoading(true)

    try {
      if (props.postData.id === null || props.postData.likes === null) return

      if (props.postData.userLiked) {
        await unlikePost(controller.signal)
      } else {
        await likePost(controller.signal)
      }
    } finally {
      setLoading(false)
    }
  }

  const likePost = async (signal: AbortSignal) => {
    props.setPostData(prevPostData => ({
      ...prevPostData,
      likes: prevPostData.likes! + 1,
      userLiked: true
    }))

    try {
      const likeSuccess = await user!.likePost({
        postId: props.postData.id!,
        signal
      })
      if (!likeSuccess) throw new Error()
    } catch {
      if (signal.aborted) return 

      props.setPostData(prevPostData => ({
        ...prevPostData,
        likes: prevPostData.likes! - 1,
        userLiked: false
      }))
      openModal('connection')
    }
  }

  const unlikePost = async (signal: AbortSignal) => {
    props.setPostData(prevPostData => ({
      ...prevPostData,
      likes: prevPostData.likes! - 1,
      userLiked: false
    }))

    try {
      const dislikeSuccess = await user!.dislikePost({
        postId: props.postData.id!,
        signal
      })
      if (!dislikeSuccess) throw new Error()
    } catch {
      if (signal.aborted) return 

      props.setPostData(prevPostData => ({
        ...prevPostData,
        likes: prevPostData.likes! + 1,
        userLiked: true
      }))
      openModal('connection')
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
          disabled={loading}
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
          disabled={loading}
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
