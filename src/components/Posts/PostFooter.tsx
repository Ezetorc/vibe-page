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
  const [loading, setLoading] = useState<boolean>(false)
  const { isSessionActive, user } = useUser()

  const handleLike = async () => {
    if (!isSessionActive()) {
      setVisibleModal({ name: 'session' })
      return
    }

    setLoading(true)

    try {
      if (props.postData.userLiked === true) {
        unlikePost()
      } else if (props.postData.userLiked === false) {
        likePost()
      }
    } finally {
      setLoading(false)
    }
  }

  const likePost = async () => {
    if (!props.postData.id) return

    const newLike = await user!.likePost({ postId: props.postData.id })

    if (!newLike || !newLike.value) return

    props.setPostData(prevPostData => {
      if (prevPostData.likes === null) return prevPostData

      const newLikes = [...prevPostData.likes, newLike.value!]

      return {
        ...prevPostData,
        userLiked: true,
        likes: newLikes
      }
    })
  }

  const unlikePost = async () => {
    if (!props.postData.id) return

    const postUnliked = await user!.unlikePost({ postId: props.postData.id })

    if (postUnliked.success) {
      props.setPostData(prevPostData => {
        if (prevPostData.likes === null) return prevPostData

        const newLikes = prevPostData.likes.filter(
          like => like.userId === user!.id
        )

        return {
          ...prevPostData,
          userLiked: false,
          likes: newLikes
        }
      })
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
          onClick={handleLike}
          disabled={loading}
          title='Like'
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
          disabled={loading}
          title='Comments'
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
