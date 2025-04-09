import { Post } from '../models/Post'

export function PostContent (props: { post: Post }) {
  return (
    <main className='w-full flex flex-col'>
      <p className='break-words text-white text-[clamp(5px,6vw,20px)] '>
        {props.post.content}
      </p>
    </main>
  )
}
