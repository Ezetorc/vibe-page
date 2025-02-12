import { useEffect, useState } from 'react'
import { Post } from '../../../models/Post'
import { Nav } from '../../../components/Nav'
import { PostsDisplay } from '../../../components/PostsDisplay'
import { PostService } from '../../../services/PostService'
import { Loading } from '../../../components/Loading'

export default function Home () {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const handlePostDelete = (postId: number) => {
    const newPosts: Post[] = posts.filter(post => post.id !== postId)

    setPosts(newPosts)
  }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts: Post[] = await PostService.getAll()

        setPosts(allPosts)
        setLoading(false)
      } catch {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <main className='pb-nav w-[clamp(320px,100%,700px)] gap-y-[20px] p-[clamp(5px,3%,10px)] items-center flex flex-col min-h-screen'>
      {loading && <Loading />}

      <PostsDisplay posts={posts} onPostDelete={handlePostDelete} />

      <Nav />
    </main>
  )
}
