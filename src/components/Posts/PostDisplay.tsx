import { useCallback, useEffect, useRef, useState } from 'react'
import { useSettings } from '../../hooks/useSettings'
import { PostDisplayProps } from '../../models/Props/PostDisplayProps'
import { PostHeader } from './PostHeader'
import { PostContent } from './PostContent'
import { PostFooter } from './PostFooter'
import { PostData } from '../../models/PostData'
import { useUser } from '../../hooks/useUser'
import { UserService } from '../../services/UserService'
import { Comment } from '../../models/Comment'
import { PostComments } from './PostComments'

export function PostDisplay (props: PostDisplayProps) {
  const { visibleModal } = useSettings()
  const { user } = useUser()
  const [commentsOpened, setCommentsOpened] = useState<boolean>(false)
  const expectCommentCreation = useRef<boolean>(false)
  const [postData, setPostData] = useState<PostData>({
    user: null,
    likes: null,
    comments: null,
    date: null,
    userLiked: null,
    id: null,
    content: null
  })

  const fetchPostData = useCallback(async () => {
    const [newPostUser, newLikes, newComments, newUserLiked] =
      await Promise.all([
        UserService.getById({ userId: props.post.userId }),
        props.post.getLikes(),
        props.post.getComments(),
        user?.hasLikedPost({ postId: props.post.id })
      ])

    setPostData(prev => ({
      ...prev,
      user: newPostUser.value ?? prev.user,
      likes: newLikes.value ?? prev.likes,
      comments: newComments.value ?? prev.comments,
      userLiked: newUserLiked?.value ?? prev.userLiked,
      id: props.post.id,
      date: props.post.getDate(),
      content: props.post.content
    }))
  }, [props.post, user])

  const createComment = useCallback(() => {
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
  }, [postData.comments, props.post.id, user, visibleModal.data])

  useEffect(() => {
    if (visibleModal.name === 'comment') {
      expectCommentCreation.current = true
    } else if (visibleModal.name === null && expectCommentCreation.current) {
      expectCommentCreation.current = false
      createComment()
    }
  }, [createComment, visibleModal.name])

  useEffect(() => {
    fetchPostData()
  }, [fetchPostData])

  return (
    <>
      <article className='w-[clamp(300px,100%,700px)] py-[10px] px-[20px] rounded-vibe border-vibe border-caribbean-current overflow-hidden'>
        <PostHeader postData={postData} onDelete={props.onDelete} />
        <PostContent postData={postData} />
        <PostFooter
          postData={postData}
          setCommentsOpened={setCommentsOpened}
          commentsOpened={commentsOpened}
          setPostData={setPostData}
        />
      </article>

      {commentsOpened && postData.comments && (
        <PostComments postData={postData} setPostData={setPostData} />
      )}
    </>
  )
}
