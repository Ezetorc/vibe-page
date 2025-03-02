import { Dispatch } from 'react'
import { useSettings } from '../../hooks/useSettings'
import { PostData } from '../../models/PostData'
import { Button } from '../Button'
import { CommentDisplay } from '../Comments/CommentDisplay'

export function PostComments (props: {
  postData: PostData
  setPostData: Dispatch<React.SetStateAction<PostData>>
}) {
  const { dictionary, openModal } = useSettings()

  const handleCommentDelete = async (commentId: number) => {
    if (!props.postData.comments) return

    const commentToDelete = props.postData.comments.find(
      comment => comment.id === commentId
    )

    if (!commentToDelete) return

    const deleted = await commentToDelete.delete()

    if (deleted.success) {
      const newPostComments = props.postData.comments.filter(
        comment => comment.id !== commentToDelete.id
      )

      props.setPostData(prevPostData => ({
        ...prevPostData,
        comments: newPostComments
      }))
    }
  }

  const handleCreateComment = () => {
    openModal('comment', { postId: props.postData.id })
  }

  return (
    <div className='w-[clamp(300px,100%,700px)] flex flex-col justify-center items-end gap-y-[10px] mt-[-10px]'>
      <Button onClick={handleCreateComment} text={dictionary.comment} />
      {(props.postData.comments?.length ?? 0) > 0 &&
        props.postData.comments?.map((comment, index) => (
          <CommentDisplay
            key={index}
            onDelete={handleCommentDelete}
            comment={comment}
          />
        ))}
    </div>
  )
}
