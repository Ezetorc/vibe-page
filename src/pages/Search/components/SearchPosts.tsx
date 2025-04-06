import { LoadSpinner } from '../../../components/LoadSpinner'
import { PostsDisplay } from '../../../components/Posts/PostsDisplay'
import { usePosts } from '../../../hooks/usePosts'
import { useSettings } from '../../../hooks/useSettings'

export function SearchPosts (props: { searchQuery: string | undefined }) {
  const { dictionary } = useSettings()
  const { posts, deletePost, ref, hasMore, success, isEmpty } = usePosts(
    props.searchQuery
  )

  return (
    <>
      {success ? (
        isEmpty ? (
          <span className='text-caribbean-current '>
            {dictionary.noPosts}
          </span>
        ) : (
          <PostsDisplay posts={posts} onPostDelete={deletePost} />
        )
      ) : (
        <LoadSpinner />
      )}
      {hasMore && <LoadSpinner reference={ref} />}
    </>
  )
}
