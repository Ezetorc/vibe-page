import { Dispatch, useState } from 'react'
import { LikeIcon } from '../Icons'
import { useSettings } from '../../hooks/useSettings'
import { useUser } from '../../hooks/useUser'
import { CommentData } from '../../models/CommentData'

export function CommentFooter (props: {
  commentData: CommentData
  setCommentData: Dispatch<React.SetStateAction<CommentData>>
}) {
  const { dictionary, openModal } = useSettings()
  const [loading, setLoading] = useState<boolean>(false)
  const { isSessionActive, user } = useUser()

  const handleLike = async () => {
    if (!isSessionActive()) {
      openModal('session')
      return
    }

    setLoading(true)

    try {
      if (props.commentData.userLiked === true) {
        unlikeComment()
      } else if (props.commentData.userLiked === false) {
        likeComment()
      }
    } finally {
      setLoading(false)
    }
  }

  const likeComment = async () => {
    if (!props.commentData.id) return

    const newLike = await user!.likeComment({ commentId: props.commentData.id })

    if (!newLike || !newLike.value) return

    props.setCommentData(prevPostData => {
      if (prevPostData.likes === null) return prevPostData

      const newLikes = [...prevPostData.likes, newLike.value!]

      return {
        ...prevPostData,
        userLiked: true,
        likes: newLikes
      }
    })
  }

  const unlikeComment = async () => {
    if (!props.commentData.id) return

    const commentUnliked = await user!.unlikeComment({
      commentId: props.commentData.id
    })

    if (commentUnliked.success) {
      props.setCommentData(prevCommentData => {
        if (prevCommentData.likes === null) return prevCommentData

        const newLikes = prevCommentData.likes.filter(
          like => like.userId === user!.id
        )

        return {
          ...prevCommentData,
          userLiked: false,
          likes: newLikes
        }
      })
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
            : props.commentData.likes.length}
        </span>
      </div>
    </footer>
  )
}
