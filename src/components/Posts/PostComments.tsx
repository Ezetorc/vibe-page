import { Dispatch, useCallback, useEffect } from 'react'
import { useSettings } from '../../hooks/useSettings'
import { PostData } from '../../models/PostData'
import { Button } from '../Button'
import eventEmitter from '../../constants/EVENT_EMITTER'
import { CommentService } from '../../services/CommentService'
import { useValidation } from '../../hooks/useValidation'
import { useUser } from '../../hooks/useUser'
import { CommentDisplay } from '../Comments/CommentDisplay'
import { Comment } from '../../models/Comment'

export function PostComments (props: {
  postData: PostData
  setPostData: Dispatch<React.SetStateAction<PostData>>
}) {
  const { dictionary, openModal, closeModal } = useSettings()
  const { user } = useUser()
  const { setErrorMessage } = useValidation()

  const handleCommentCreated = useCallback(
    async (event: { content: string; postId: number }) => {
      if (
        !props.postData.comments ||
        !user ||
        event.postId !== props.postData.id
      )
        return

      const newComment = await CommentService.create({
        userId: user.id,
        postId: props.postData.id,
        content: event.content
      })

      if (newComment) {
        const newComments: Comment[] = [...props.postData.comments]

        newComments.push(newComment)
        props.setPostData(prev => ({ ...prev, comments: newComments }))
        closeModal()
      } else {
        setErrorMessage(dictionary.somethingWentWrong)
      }
    },
    [closeModal, dictionary.somethingWentWrong, props, setErrorMessage, user]
  )

  const handleCommentDelete = async (commentId: number) => {
    if (!props.postData.comments) return

    const commentToDelete = props.postData.comments.find(
      comment => comment.id === commentId
    )

    if (!commentToDelete) return

    const deleteSuccess = await commentToDelete.delete()

    if (deleteSuccess) {
      const newPostComments = props.postData.comments.filter(
        comment => comment.id !== commentToDelete.id
      )

      props.setPostData(prevPostData => ({
        ...prevPostData,
        comments: newPostComments
      }))
    }
  }

  useEffect(() => {
    eventEmitter.on('commentCreated', handleCommentCreated)

    return () => {
      eventEmitter.off('commentCreated', handleCommentCreated)
    }
  }, [handleCommentCreated])

  const handleCreateComment = () => {
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
