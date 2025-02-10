import { useSettings } from '../hooks/useSettings'
import { PostsDisplayProps } from '../models/PostsDisplayProps'
import { PostDisplay } from './PostDisplay'

export function PostsDisplay ( { posts, onPostDelete}: PostsDisplayProps) {
  const { dictionary } = useSettings()

  return (
    <div className='w-full flex flex-col items-center gap-y-[20px]'>
      {posts?.length === 0 ? (
        <span>{dictionary.noPostsYet?.value}</span>
      ) : (
        posts?.map(post => (
          <PostDisplay onDelete={onPostDelete} key={post.id} post={post} />
        ))
      )}
    </div>
  )
}
