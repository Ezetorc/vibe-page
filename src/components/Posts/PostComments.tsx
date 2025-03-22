import { useCallback, useEffect } from 'react'
import { useSettings } from '../../hooks/useSettings'
import { PostData } from '../../models/PostData'
import { Button } from '../Button'
import eventEmitter from '../../constants/EVENT_EMITTER'
import { useUser } from '../../hooks/useUser'
import { CommentDisplay } from '../Comments/CommentDisplay'
import { NewCommentEvent } from '../../models/NewCommentEvent'

export function PostComments (props: {
  postData: PostData
  createComment: (event: { content: string; postId: number }) => void
  deleteComment: (commentId: number) => void
}) {
  const { dictionary, openModal } = useSettings()
  const { user } = useUser()

  const handleCommentCreated = useCallback(
    async (event: NewCommentEvent) => {
      if (event.postId !== props.postData.id) return

      props.createComment(event)
    },
    [props]
  )

  const handleCommentDelete = async (commentId: number) => {
    if (!props.postData.comments) return

    props.deleteComment(commentId)
  }

  useEffect(() => {
    eventEmitter.on('commentCreated', handleCommentCreated)

    return () => {
      eventEmitter.off('commentCreated', handleCommentCreated)
    }
  }, [handleCommentCreated])

  const handleCreateComment = () => {
    if (!user) {
      openModal('session')
      return
    }

    openModal('comment', { postId: props.postData.id })
  }

  return (
    <div className='w-[clamp(300px,100%,700px)] flex flex-col justify-center items-end gap-y-[10px] mt-[-10px]'>
      <Button onClick={handleCreateComment} text={dictionary.comment} />
      {props.postData.comments?.map((comment, index) => (
        <CommentDisplay
          key={index}
          onDelete={handleCommentDelete}
          comment={comment}
        />
      ))}
    </div>
  )
}
