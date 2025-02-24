import { Dispatch, useState } from 'react'
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
  const { dictionary, setVisibleModal } = useSettings()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { isSessionActive, user } = useUser()

  const handleLike = async () => {
    if (isLoading || !props.postData.user) return

    if (!isSessionActive()) {
      setVisibleModal({ name: 'session' })
      return
    }

    setIsLoading(true)

    if (!props.postData.id) return

    if (props.postData.userLiked) {
      await props.postData.user.unlikePost({ postId: props.postData.id })

      props.setPostData(prevPostData => ({
        ...prevPostData,
        userLiked: false,
        likes:
          prevPostData.likes?.filter(like => like.userId !== user?.id) ?? []
      }))
    } else {
      await props.postData.user.likePost({ postId: props.postData.id })

      props.setPostData(prevPostData => ({
        ...prevPostData,
        userLiked: true
      }))

      // AÑADIR LIKE DEL USUARIO A postData.likes
      console.log("ACA")
    }

    setIsLoading(false)
  }

  const handleOpenComments = () => {
    props.setCommentsOpened(prevCommentsOpened => !prevCommentsOpened)
  }

  return (
    <footer className='flex items-center gap-x-[3%]'>
      <div className='flex items-center gap-x-[5px]'>
        <button
          className='cursor-pointer'
          onClick={handleLike}
          disabled={isLoading}
        >
          <LikeIcon filled={props.postData.userLiked ?? false} />
        </button>
        <span className='text-verdigris font-poppins-semibold'>
          {props.postData.likes === null
            ? dictionary.loading
            : props.postData.likes.length}
        </span>
      </div>

      <div className='flex items-center gap-x-[5px]'>
        <button
          className='cursor-pointer'
          onClick={handleOpenComments}
          disabled={isLoading}
        >
          <CommentIcon filled={props.commentsOpened} />
        </button>
        <span className='text-verdigris font-poppins-semibold'>
          {props.postData.comments === null
            ? dictionary.loading
            : props.postData.comments.length}
        </span>
      </div>
    </footer>
  )
}
