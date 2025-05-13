import { Post } from '../models/Post'
import { PostDisplay } from './PostDisplay'

export function PostsDisplay (props: {
  posts?: Post[] | null
  onPostDelete: (post: Post) => void
}) {
  return (
    <div className='w-full flex animate-appear-from-top flex-col items-center gap-y-[20px]'>
      {props.posts?.map((post, index) => (
        <PostDisplay onDelete={props.onPostDelete} key={index} post={post} />
      ))}
    </div>
  )
}
