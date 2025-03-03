import { useState, useCallback, useEffect } from 'react'
import { useUser } from '../../hooks/useUser'
import { CommentDisplayProps } from '../../models/Props/CommentDisplayProps'
import { UserService } from '../../services/UserService'
import { CommentData } from '../../models/CommentData'
import { CommentHeader } from './CommentHeader'
import { CommentContent } from './CommentContent'
import { CommentFooter } from './CommentFooter'

export function CommentDisplay (props: CommentDisplayProps) {
  const { user } = useUser()
  const [commentData, setCommentData] = useState<CommentData>({
    user: null,
    likes: null,
    date: null,
    userLiked: null,
    id: null,
    content: null
  })

  const fetchCommentData = useCallback(async () => {
    const [newCommentUser, newLikes, newUserLiked] = await Promise.all([
      UserService.getById({ userId: props.comment.userId }),
      props.comment.getLikes(),
      user?.hasLikedComment({ commentId: props.comment.id })
    ])

    setCommentData(prev => ({
      ...prev,
      user: newCommentUser.value ?? prev.user,
      likes: newLikes.value ?? prev.likes,
      userLiked: newUserLiked?.value ?? prev.userLiked,
      id: props.comment.id,
      date: props.comment.getDate(),
      content: props.comment.content
    }))
  }, [props.comment, user])

  useEffect(() => {
    fetchCommentData()
  }, [fetchCommentData])

  return (
    <article className='w-[clamp(300px,90%,700px)] py-[10px] px-[20px] rounded-vibe border-vibe border-caribbean-current overflow-hidden'>
      <CommentHeader commentData={commentData} onDelete={props.onDelete} />
      <CommentContent commentData={commentData} />
      <CommentFooter
        commentData={commentData}
        setCommentData={setCommentData}
      />
    </article>
  )
}
