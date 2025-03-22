import { CommentDisplayProps } from '../../models/Props/CommentDisplayProps'
import { CommentHeader } from './CommentHeader'
import { CommentContent } from './CommentContent'
import { CommentFooter } from './CommentFooter'
import { useCommentData } from '../../hooks/useCommentData'

export function CommentDisplay (props: CommentDisplayProps) {
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
