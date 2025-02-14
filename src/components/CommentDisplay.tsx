import { CommentDisplayProps } from '../models/CommentDisplayProps'
import { useCallback, useEffect, useState } from 'react'
import { LikeIcon } from './Icons'
import { Like } from '../models/Like'
import { User } from '../models/User'
import { useUser } from '../hooks/useUser'
import { useSettings } from '../hooks/useSettings'
import { Username } from './Username'
import { Loading } from './Loading'
import { PostMenu } from './PostMenu'
import { UserService } from '../services/UserService'

export function CommentDisplay ({ comment, onDelete }: CommentDisplayProps) {
  const { isSessionActive, user } = useUser()
  const { setVisibleModal, dictionary } = useSettings()
  const [hasUserLikedComment, setHasUserLikedComment] = useState<boolean>(false)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [commentData, setCommentData] = useState<{
    user: User | null
    likes: Like[] | null
    date: string | null
  }>({
    user: null,
    likes: [],
    date: comment.getDate()
  })

  const handleDelete = async () => {
    const deleted = await comment.delete()

    if (deleted.success) {
      onDelete(comment.id)
    }
  }

  const handleUpdatedLikes = useCallback(async () => {
    const updatedLikes = await comment.getLikes()

    if (!updatedLikes.value) return

    setCommentData({ ...commentData, likes: updatedLikes.value })
    setHasUserLikedComment(!hasUserLikedComment)
    setIsProcessing(false)
  }, [hasUserLikedComment, comment, commentData])

  const handleLike = useCallback(async () => {
    if (isProcessing || !commentData.user) return

    if (!isSessionActive()) {
      setVisibleModal({ name: 'session' })
      return
    }

    setIsProcessing(true)

    if (hasUserLikedComment) {
      await commentData.user.unlikeComment({ commentId: comment.id })
    } else {
      await commentData.user.likeComment({ commentId: comment.id })
    }

    handleUpdatedLikes()
  }, [
    comment.id,
    commentData.user,
    handleUpdatedLikes,
    hasUserLikedComment,
    isSessionActive,
    isProcessing,
    setVisibleModal
  ])

  const fetchCommentData = useCallback(async () => {
    const [newCommentUser, newLikes] = await Promise.all([
      UserService.getById({ userId: comment.userId }),
      comment.getLikes()
    ])

    setCommentData(prev => ({
      ...prev,
      user: newCommentUser.value ?? prev.user,
      likes: newLikes.value ?? prev.likes
    }))

    if (newCommentUser.value) {
      const newHasUserLikedComment = await newCommentUser.value.hasLikedComment(
        {
          commentId: comment.id
        }
      )

      if (newHasUserLikedComment.value) {
        setHasUserLikedComment(newHasUserLikedComment.value)
      }
    }
  }, [comment])

  useEffect(() => {
    fetchCommentData()
  }, [fetchCommentData])

  return (
    <article className='w-[clamp(300px,100%,700px)] py-[10px] px-[20px] rounded-vibe border-vibe border-caribbean-current overflow-hidden'>
      <header className='w-full h-[70px] grid grid-cols-[10fr_10fr_1fr] items-center'>
        <div className='flex items-center gap-x-[10px]'>
          <img className='rounded-full w-[50px] aspect-square bg-orange-crayola' />
          {commentData.user ? (
            <Username username={commentData.user.name} />
          ) : (
            <Loading />
          )}
        </div>
        <span className='text-caribbean-current text-right font-poppins-light text-[clamp(5px,6vw,20px)]'>
          {commentData.date}
        </span>

        {user?.isOwnerOfComment({ comment }) && (
          <div className='flex justify-end items-center'>
            <PostMenu onDelete={handleDelete} />
          </div>
        )}
      </header>

      <main className='w-full flex flex-col'>
        <p className='break-words text-white text-[clamp(5px,6vw,20px)] font-poppins-regular'>
          {comment.content}
        </p>
      </main>

      <footer className='flex items-center gap-x-[3%]'>
        <div className='flex items-center gap-x-[5px]'>
          <button onClick={handleLike} disabled={isProcessing}>
            <LikeIcon filled={hasUserLikedComment} />
          </button>
          <span className='text-verdigris font-poppins-semibold'>
            {commentData.likes === null
              ? dictionary.loading
              : commentData.likes.length}
          </span>
        </div>
      </footer>
    </article>
  )
}
