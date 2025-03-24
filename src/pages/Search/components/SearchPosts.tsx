import { LoadSpinner } from '../../../components/LoadSpinner'
import { PostsDisplay } from '../../../components/Posts/PostsDisplay'
import { usePosts } from '../../../hooks/usePosts'

export function SearchPosts (props: { searchQuery: string | undefined }) {
  const { posts, deletePost, ref, hasMore } = usePosts(props.searchQuery)

  return (
    <>
      <PostsDisplay posts={posts} onPostDelete={deletePost} />
      {hasMore && <LoadSpinner reference={ref} />}
    </>
  )
}
