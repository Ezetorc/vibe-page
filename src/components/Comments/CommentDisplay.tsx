import { useState, useCallback, useEffect } from 'react'
import { useSettings } from '../../hooks/useSettings'
import { useUser } from '../../hooks/useUser'
import { CommentDisplayProps } from '../../models/Props/CommentDisplayProps'
import { Like } from '../../models/Like'
import { User } from '../../models/User'
import { UserService } from '../../services/UserService'
import { LikeIcon } from '../Icons'
import { Loading } from '../Loading'
import { PostMenu } from '../Posts/PostMenu'
import { Username } from '../Username'

export function CommentDisplay (props: CommentDisplayProps) {
  const { isSessionActive, user } = useUser()
  const { openModal, dictionary } = useSettings()
  const [hasUserLikedComment, setHasUserLikedComment] = useState<boolean>(false)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [commentData, setCommentData] = useState<{
    user: User | null
    likes: Like[] | null
    date: string | null
  }>({
    user: null,
    likes: [],
    date: props.comment.getDate()
  })

  const handleDelete = async () => {
    const deleted = await props.comment.delete()

    if (deleted.success) {
      props.onDelete(props.comment.id)
    }
  }

  const handleUpdatedLikes = useCallback(async () => {
    const updatedLikes = await props.comment.getLikes()

    if (!updatedLikes.value) return

    setCommentData({ ...commentData, likes: updatedLikes.value })
    setHasUserLikedComment(!hasUserLikedComment)
    setIsProcessing(false)
  }, [hasUserLikedComment, props.comment, commentData])

  const handleLike = useCallback(async () => {
    if (isProcessing || !commentData.user) return

    if (!isSessionActive()) {
      openModal("session")
      return
    }

    setIsProcessing(true)

    if (hasUserLikedComment) {
      await commentData.user.unlikeComment({ commentId: props.comment.id })
    } else {
      await commentData.user.likeComment({ commentId: props.comment.id })
    }

    handleUpdatedLikes()
  }, [
    props.comment.id,
    commentData.user,
    handleUpdatedLikes,
    hasUserLikedComment,
    isSessionActive,
    isProcessing,
    openModal
  ])

  const fetchCommentData = useCallback(async () => {
    const [newCommentUser, newLikes] = await Promise.all([
      UserService.getById({ userId: props.comment.userId }),
      props.comment.getLikes()
    ])

    setCommentData(prev => ({
      ...prev,
      user: newCommentUser.value ?? prev.user,
      likes: newLikes.value ?? prev.likes
    }))

    if (newCommentUser.value) {
      const newHasUserLikedComment = await newCommentUser.value.hasLikedComment(
        {
          commentId: props.comment.id
        }
      )

      if (newHasUserLikedComment.value) {
        setHasUserLikedComment(newHasUserLikedComment.value)
      }
    }
  }, [props.comment])

  useEffect(() => {
    fetchCommentData()
  }, [fetchCommentData])

  return (
    <article className='w-[95%] py-[10px] px-[20px] rounded-vibe border-vibe border-caribbean-current overflow-hidden'>
      <header className='w-full h-[70px] grid grid-cols-[10fr_10fr_1fr] items-center'>
        <div className='flex items-center gap-x-[10px]'>
          <img className='rounded-full w-[50px] aspect-square bg-orange-crayola' />
          {commentData.user ? (
            <Username>{commentData.user.name}</Username>
          ) : (
            <Loading />
          )}
        </div>
        <span className='text-caribbean-current text-right font-poppins-light text-[clamp(5px,6vw,20px)]'>
          {commentData.date}
        </span>

        {user?.isOwnerOfComment({ comment: props.comment }) && (
          <div className='flex justify-end items-center'>
            <PostMenu onDelete={handleDelete} />
          </div>
        )}
      </header>

      <main className='w-full flex flex-col'>
        <p className='break-words text-white text-[clamp(5px,6vw,20px)] font-poppins-regular'>
          {props.comment.content}
        </p>
      </main>

      <footer className='flex items-center gap-x-[1%]'>
        <button
          className='cursor-pointer'
          onClick={handleLike}
          disabled={isProcessing}
        >
          <LikeIcon filled={hasUserLikedComment} />
        </button>
        <span className='text-verdigris font-poppins-semibold'>
          {commentData.likes === null
            ? dictionary.loading
            : commentData.likes.length}
        </span>
      </footer>
    </article>
  )
}
