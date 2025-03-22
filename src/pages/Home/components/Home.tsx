import { Nav } from '../../../components/Nav'
import { PostsDisplay } from '../../../components/Posts/PostsDisplay'
import { LoadSpinner } from '../../../components/LoadSpinner'
import { useSettings } from '../../../hooks/useSettings'
import { usePaginatedPosts } from '../../../hooks/usePaginatedPosts'

export default function Home () {
  const { dictionary } = useSettings()
  const { status, posts, ref, deletePost, hasMore } = usePaginatedPosts()

  if (status === 'error') return <p>{dictionary.error}</p>

  return (
    <main className='pb-nav w-[clamp(320px,100%,700px)] gap-y-[20px] p-[clamp(5px,3%,10px)] items-center flex flex-col min-h-screen'>
      <PostsDisplay posts={posts} onPostDelete={deletePost} />
      {status === 'pending' && <LoadSpinner />}
      {hasMore && <div className='w-full h-[20px]' ref={ref}></div>}
      <Nav />
    </main>
  )
}
