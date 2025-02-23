import { Nav } from '../../../components/Nav'
import { PostsDisplay } from '../../../components/Posts/PostsDisplay'
import { usePosts } from '../../../hooks/usePosts'
import { LoadSpinner } from '../../../components/LoadSpinner'

export default function Home () {
  const posts = usePosts()

  return (
    <main className='pb-nav w-[clamp(320px,100%,700px)] gap-y-[20px] p-[clamp(5px,3%,10px)] items-center flex flex-col min-h-screen'>
      <PostsDisplay posts={posts.data} onPostDelete={posts.delete} />
      {posts.hasNextPage && <LoadSpinner reference={posts.ref} />}
      <Nav />
    </main>
  )
}
