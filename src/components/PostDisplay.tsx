import { useCallback, useEffect, useState } from 'react'
import { CommentIcon, LikeIcon } from './Icons'
import { Like } from '../models/Like'
import { User } from '../models/User'
import { useUser } from '../hooks/useUser'
import { useSettings } from '../hooks/useSettings'
import { PostDisplayProps } from '../models/PostDisplayProps'
import { Username } from './Username'
import { Loading } from './Loading'
import { PostMenu } from './PostMenu'
import { UserService } from '../services/UserService'
import { Comment } from '../models/Comment'
import { CommentDisplay } from './CommentDisplay'

export function PostDisplay ({ post, onDelete }: PostDisplayProps) {
  const { isSessionActive, user } = useUser()
  const { setVisibleModal, dictionary } = useSettings()
  const [hasUserLikedPost, setHasUserLikedPost] = useState<boolean>(false)
  const [commentsOpened, setCommentsOpened] = useState<boolean>(true)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [postData, setPostData] = useState<{
    user: User | null
    likes: Like[] | null
    comments: Comment[] | null
    date: string | null
  }>({
    user: null,
    likes: [],
    comments: null,
    date: post.getDate()
  })

  const handleDelete = async () => {
    const deleted = await post.delete()

    if (deleted.success) {
      onDelete(post.id)
    }
  }

  const handleCommentDelete = (commentId: number) => {
    console.log(commentId)
  }

  const handleUpdatedLikes = useCallback(async () => {
    const updatedLikes = await post.getLikes()

    if (!updatedLikes.value) return

    setPostData({ ...postData, likes: updatedLikes.value })
    setHasUserLikedPost(!hasUserLikedPost)
    setIsProcessing(false)
  }, [hasUserLikedPost, post, postData])

  const handleLike = useCallback(async () => {
    if (isProcessing || !postData.user) return

    if (!isSessionActive()) {
      setVisibleModal({ name: 'session' })
      return
    }

    setIsProcessing(true)

    if (hasUserLikedPost) {
      await postData.user.unlikePost({ postId: post.id })
    } else {
      await postData.user.likePost({ postId: post.id })
    }

    handleUpdatedLikes()
  }, [
    handleUpdatedLikes,
    hasUserLikedPost,
    isProcessing,
    isSessionActive,
    post.id,
    postData.user,
    setVisibleModal
  ])

  const handleOpenComments = () => {
    setCommentsOpened(prevCommentsOpened => !prevCommentsOpened)
  }

  const fetchPostData = useCallback(async () => {
    const [newPostUser, newLikes, newComments] = await Promise.all([
      UserService.getById({ userId: post.userId }),
      post.getLikes(),
      post.getComments()
    ])

    setPostData(prev => ({
      ...prev,
      user: newPostUser.value ?? prev.user,
      likes: newLikes.value ?? prev.likes,
      comments: newComments.value ?? prev.comments
    }))

    if (newPostUser.value) {
      const newHasUserLikedPost = await newPostUser.value.hasLikedPost({
        postId: post.id
      })

      if (newHasUserLikedPost.value) {
        setHasUserLikedPost(newHasUserLikedPost.value)
      }
    }
  }, [post])

  useEffect(() => {
    fetchPostData()
  }, [fetchPostData])

  return (
    <>
      <article className='w-[clamp(300px,100%,700px)] py-[10px] px-[20px] rounded-vibe border-vibe border-caribbean-current overflow-hidden'>
        <header className='w-full h-[70px] grid grid-cols-[10fr_10fr_1fr] items-center'>
          <div className='flex items-center gap-x-[10px]'>
            <img className='rounded-full w-[50px] aspect-square bg-orange-crayola' />
            {postData.user ? (
              <Username username={postData.user.name} />
            ) : (
              <Loading />
            )}
          </div>
          <span className='text-caribbean-current text-right font-poppins-light text-[clamp(5px,6vw,20px)]'>
            {postData.date}
          </span>

          {user?.isOwnerOfPost({ post }) && (
            <div className='flex justify-end items-center'>
              <PostMenu onDelete={handleDelete} />
            </div>
          )}
        </header>

        <main className='w-full flex flex-col'>
          <p className='break-words text-white text-[clamp(5px,6vw,20px)] font-poppins-regular'>
            {post.content}
          </p>
        </main>

        <footer className='flex items-center gap-x-[3%]'>
          <div className='flex items-center gap-x-[5px]'>
            <button onClick={handleLike} disabled={isProcessing}>
              <LikeIcon filled={hasUserLikedPost} />
            </button>
            <span className='text-verdigris font-poppins-semibold'>
              {postData.likes === null
                ? dictionary.loading
                : postData.likes.length}
            </span>
          </div>

          <div className='flex items-center gap-x-[5px]'>
            <button onClick={handleOpenComments} disabled={isProcessing}>
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

      {commentsOpened && (
        <section className='w-[clamp(300px,100%,700px)] flex justify-center mt-[-15px]'>
          {postData.comments?.map((comment, index) => (
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
