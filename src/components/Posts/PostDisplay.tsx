import { useCallback, useEffect, useRef, useState } from 'react'
import { CommentIcon, LikeIcon } from '../Icons'
import { useUser } from '../../hooks/useUser'
import { useSettings } from '../../hooks/useSettings'
import { PostDisplayProps } from '../../models/Props/PostDisplayProps'
import { UserService } from '../../services/UserService'
import { Comment } from '../../models/Comment'
import { Button } from '../Button'
import { CommentDisplay } from '../Comments/CommentDisplay'
import { Username } from '../Username'
import { PostMenu } from './PostMenu'
import { Like } from '../../models/Like'
import { User } from '../../models/User'

export function PostDisplay (props: PostDisplayProps) {
  const { isSessionActive, user } = useUser()
  const { setVisibleModal, visibleModal, dictionary } = useSettings()
  const [hasUserLikedPost, setHasUserLikedPost] = useState<boolean>(false)
  const expectCommentCreation = useRef<boolean>(false)
  const [commentsOpened, setCommentsOpened] = useState<boolean>(false)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [postData, setPostData] = useState<{
    user: User | null
    likes: Like[] | null
    comments: Comment[] | null
    date: string | null
  }>({
    user: null,
    likes: null,
    comments: null,
    date: null
  })

  const handleCommentDelete = async (commentId: number) => {
    if (!postData.comments) return

    const commentToDelete = postData.comments.find(
      comment => comment.id === commentId
    )

    if (!commentToDelete) return

    const deleted = await commentToDelete.delete()

    if (deleted.success) {
      const newPostComments = postData.comments.filter(
        comment => comment.id !== commentToDelete.id
      )

      setPostData(prevPostData => ({
        ...prevPostData,
        comments: newPostComments
      }))
    }
  }

  const handleUpdatedLikes = useCallback(async () => {
    const updatedLikes = await props.post.getLikes()

    if (!updatedLikes.value) return

    setPostData({ ...postData, likes: updatedLikes.value })
    setHasUserLikedPost(!hasUserLikedPost)
    setIsProcessing(false)
  }, [hasUserLikedPost, props.post, postData])

  const handleLike = useCallback(async () => {
    if (isProcessing || !postData.user) return

    if (!isSessionActive()) {
      setVisibleModal({ name: 'session' })
      return
    }

    setIsProcessing(true)

    if (hasUserLikedPost) {
      await postData.user.unlikePost({ postId: props.post.id })
    } else {
      await postData.user.likePost({ postId: props.post.id })
    }

    handleUpdatedLikes()
  }, [
    handleUpdatedLikes,
    hasUserLikedPost,
    isProcessing,
    isSessionActive,
    props.post.id,
    postData.user,
    setVisibleModal
  ])

  const handleCreateComment = () => {
    setVisibleModal({ name: 'comment', data: { postId: props.post.id } })
  }

  const handleOpenComments = () => {
    setCommentsOpened(prevCommentsOpened => !prevCommentsOpened)
  }

  const fetchPostData = useCallback(async () => {
    const [newPostUser, newLikes, newComments] = await Promise.all([
      UserService.getById({ userId: props.post.userId }),
      props.post.getLikes(),
      props.post.getComments()
    ])

    setPostData(prev => ({
      ...prev,
      user: newPostUser.value ?? prev.user,
      likes: newLikes.value ?? prev.likes,
      comments: newComments.value ?? prev.comments
    }))

    if (newPostUser.value) {
      const newHasUserLikedPost = await newPostUser.value.hasLikedPost({
        postId: props.post.id
      })

      if (newHasUserLikedPost.value) {
        setHasUserLikedPost(newHasUserLikedPost.value)
      }
    }
  }, [props.post])

  const handleDelete = async () => {
    props.onDelete(props.post.id)
  }

  useEffect(() => {
    if (visibleModal.name === 'comment') {
      expectCommentCreation.current = true
    } else if (visibleModal.name === null && expectCommentCreation.current) {
      expectCommentCreation.current = false

      if (
        !postData.comments ||
        !user ||
        typeof visibleModal.data !== 'object' ||
        !('newCommentContent' in visibleModal.data)
      )
        return

      const newComment: Comment = new Comment({
        id: postData.comments?.length + 1,
        userId: user.id,
        postId: props.post.id,
        content: visibleModal.data.newCommentContent as string,
        createdAt: new Date().toISOString()
      })
      const newComments: Comment[] = [...postData.comments]
      newComments.push(newComment)

      setPostData(prev => ({ ...prev, comments: newComments }))
    }
  }, [
    visibleModal.name,
    postData.comments,
    props.post.id,
    visibleModal.data,
    user
  ])

  useEffect(() => {
    fetchPostData()
  }, [fetchPostData])

  return (
    <>
      <article className='w-[clamp(300px,100%,700px)] py-[10px] px-[20px] rounded-vibe border-vibe border-caribbean-current overflow-hidden'>
        <header className='w-full h-[70px] grid grid-cols-[15fr_5fr_1fr] items-center'>
          <img className='rounded-full w-[50px] aspect-square bg-orange-crayola' />

          <Username>{postData.user?.name}</Username>

          <span className='text-caribbean-current h-full flex justify-end items-center text-right font-poppins-light text-[clamp(5px,6vw,20px)]'>
            {postData.date}
          </span>

          {user?.isOwnerOfPost({ post: props.post }) && (
            <div className='flex justify-end items-center'>
              <PostMenu onDelete={handleDelete} />
            </div>
          )}
        </header>

        <main className='w-full flex flex-col'>
          <p className='break-words text-white text-[clamp(5px,6vw,20px)] font-poppins-regular'>
            {props.post.content}
          </p>
        </main>

        <footer className='flex items-center gap-x-[3%]'>
          <div className='flex items-center gap-x-[5px]'>
            <button
              className='cursor-pointer'
              onClick={handleLike}
              disabled={isProcessing}
            >
              <LikeIcon filled={hasUserLikedPost} />
            </button>
            <span className='text-verdigris font-poppins-semibold'>
              {postData.likes === null
                ? dictionary.loading
                : postData.likes.length}
            </span>
          </div>

          <div className='flex items-center gap-x-[5px]'>
            <button
              className='cursor-pointer'
              onClick={handleOpenComments}
              disabled={isProcessing}
            >
              <CommentIcon filled={commentsOpened} />
            </button>
            <span className='text-verdigris font-poppins-semibold'>
              {postData.comments === null
                ? dictionary.loading
                : postData.comments.length}
            </span>
          </div>
        </footer>
      </article>

      {commentsOpened && postData.comments && (
        <section className='w-[clamp(300px,100%,700px)] flex flex-col justify-center items-end gap-y-[10px] mt-[-10px]'>
          <Button onClick={handleCreateComment} text={dictionary.comment} />
          {postData.comments?.length > 0 &&
            postData.comments?.map((comment, index) => (
              <CommentDisplay
                key={index}
                onDelete={handleCommentDelete}
                comment={comment}
              />
            ))}
        </section>
      )}
    </>
  )
}
