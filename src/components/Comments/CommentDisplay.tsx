import { CommentHeader } from './CommentHeader'
import { CommentContent } from './CommentContent'
import { CommentFooter } from './CommentFooter'
import { useCommentData } from '../../hooks/useCommentData'
import { Comment } from '../../models/Comment'

export function CommentDisplay (props: {
  comment: Comment
  onDelete: (commentId: number) => void
}) {
  const { commentData, likeComment, dislikeComment } = useCommentData(
    props.comment
  )

  return (
    <article className='w-[clamp(300px,95%,700px)] py-[10px] px-[20px] rounded-vibe border-vibe border-caribbean-current overflow-hidden'>
      <CommentHeader commentData={commentData} onDelete={props.onDelete} />
      <CommentContent commentData={commentData} />
      <CommentFooter
        commentData={commentData}
        likeComment={likeComment}
        dislikeComment={dislikeComment}
      />
    </article>
  )
}
