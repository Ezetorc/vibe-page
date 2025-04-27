import { useEffect } from 'react'
import { useSettings } from '../hooks/useSettings'
import { Button } from './Button'
import EVENT_EMITTER from '../constants/EVENT_EMITTER'
import { CommentDisplay } from './CommentDisplay'
import { Post } from '../models/Post'
import { LoadSpinner } from './LoadSpinner'
import { useSession } from '../hooks/useSession'
import { useComments } from '../hooks/useComments'

export function PostComments (props: { post: Post }) {
  const { dictionary, openModal } = useSettings()
  const { isSessionActive } = useSession()
  const { comments, createComment, deleteComment, isLoading } = useComments(
    props.post
  )

  useEffect(() => {
    EVENT_EMITTER.on('commentCreated', createComment)

    return () => {
      EVENT_EMITTER.off('commentCreated', createComment)
    }
  }, [createComment])

  const handleCreateComment = () => {
    if (!isSessionActive) {
      openModal('session')
      return
    }

    openModal('comment', { postId: props.post.id })
  }

  return (
    <div className='w-[clamp(300px,100%,700px)] animate-appear-from-top flex flex-col justify-center items-center gap-y-[10px] mt-[-10px]'>
      <Button onClick={handleCreateComment} text={dictionary.comment} />

      {comments.map((comment, index) => (
        <CommentDisplay
          key={index}
          onDelete={deleteComment}
          comment={comment}
        />
      ))}

      {isLoading && <LoadSpinner />}
    </div>
  )
}
