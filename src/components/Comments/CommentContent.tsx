import { CommentData } from '../../models/CommentData'

export function CommentContent (props: { commentData: CommentData }) {
  return (
    <main className='w-full flex flex-col'>
      <p className='break-words text-white text-[clamp(5px,6vw,20px)] font-poppins-regular'>
        {props.commentData.content}
      </p>
    </main>
  )
}
