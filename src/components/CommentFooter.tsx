import { Comment } from '../models/Comment'
import { LikeButton } from './LikeButton'

export function CommentFooter (props: { comment: Comment }) {
  return (
    <footer className='flex items-center gap-x-[3%]'>
      <LikeButton target={props.comment} />
    </footer>
  )
}
