import { useEffect } from 'react'
import { useSettings } from '../hooks/useSettings'
import { Button } from './Button'
import eventEmitter from '../constants/EVENT_EMITTER'
import { CommentDisplay } from './CommentDisplay'
import { NewCommentEvent } from '../models/NewCommentEvent'
import { useLoggedUser } from '../hooks/useLoggedUser'
import { Post } from '../models/Post'
import { useComment } from '../hooks/useComment'
import { LoadSpinner } from './LoadSpinner'

export function PostComments (props: { post: Post }) {
  const { dictionary, openModal } = useSettings()
  const { isSessionActive } = useLoggedUser()
  const { createComment, deleteComment, isCreating } = useComment(props.post)

  const handleCommentDelete = async (commentId: number) => {
    deleteComment(commentId)
  }

  useEffect(() => {
    const handleCommentCreated = async (event: NewCommentEvent) => {
      createComment(event)
    }

    eventEmitter.on('commentCreated', handleCommentCreated)

    return () => {
      eventEmitter.off('commentCreated', handleCommentCreated)
    }
  }, [createComment])

  const handleCreateComment = () => {
    if (!isSessionActive()) {
      openModal('session')
      return
    }

    openModal('comment', { postId: props.post.id })
  }

  return (
    <div className='w-[clamp(300px,100%,700px)] animate-appear-from-top flex flex-col justify-center items-end gap-y-[10px] mt-[-10px]'>
      <Button onClick={handleCreateComment} text={dictionary.comment} />

      {props.post.comments.map((comment, index) => (
        <CommentDisplay
          key={index}
          onDelete={handleCommentDelete}
          comment={comment}
        />
      ))}

      {isCreating && <LoadSpinner />}
    </div>
  )
}
