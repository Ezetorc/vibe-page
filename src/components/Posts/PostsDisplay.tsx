import { useSettings } from '../../hooks/useSettings'
import { PostsDisplayProps } from '../../models/Props/PostsDisplayProps'
import { PostDisplay } from './PostDisplay'

export function PostsDisplay ({ posts, onPostDelete }: PostsDisplayProps) {
  const { dictionary } = useSettings()

  return (
    <div className='w-full flex flex-col items-center gap-y-[20px]'>
      {posts?.length === 0 ? (
        <span>{dictionary.noPosts}</span>
      ) : (
        posts?.map((post, index) => (
          <PostDisplay onDelete={onPostDelete} key={index} post={post} />
        ))
      )}
    </div>
  )
}
