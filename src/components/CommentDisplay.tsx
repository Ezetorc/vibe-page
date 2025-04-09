import { CommentHeader } from './CommentHeader'
import { CommentContent } from './CommentContent'
import { CommentFooter } from './CommentFooter'
import { Comment } from '../models/Comment'

export function CommentDisplay (props: {
  comment: Comment
  onDelete: (commentId: number) => void
}) {
  return (
    <article className='w-[clamp(300px,98%,700px)] py-[10px] pr-[5px] pl-[10px] rounded-vibe border-vibe border-caribbean-current overflow-hidden'>
      <CommentHeader comment={props.comment} onDelete={props.onDelete} />
      <CommentContent comment={props.comment} />
      <CommentFooter comment={props.comment} />
    </article>
  )
}
