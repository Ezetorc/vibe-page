import { Post } from '../../models/Post'
import { PostDisplay } from './PostDisplay'

export function PostsDisplay ({
  posts,
  onPostDelete
}: {
  posts?: Post[] | null
  onPostDelete: (postId: number) => void
}) {
  return (
    <div className='w-full flex flex-col items-center gap-y-[20px]'>
      {posts?.map((post, index) => (
        <PostDisplay onDelete={onPostDelete} key={index} post={post} />
      ))}
    </div>
  )
}
