import { Comment } from '../models/Comment'

export function CommentContent (props: { comment: Comment }) {
  return (
    <main className='w-full flex flex-col'>
      <p className='break-words text-white text-[clamp(5px,6vw,20px)] '>
        {props.comment.content}
      </p>
    </main>
  )
}
