import { useEffect, useState } from 'react'
import { PostDisplay } from '../../../components/PostDisplay'
import { Post } from '../../../models/Post'
import { Nav } from '../../../components/Nav'

export default function Home () {
  const [posts, setPosts] = useState<Post[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    Post.getAll()
      .then(fetchedPosts => {
        setPosts(fetchedPosts)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching posts:', error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className='text-white'>Loading posts...</div>
  }

  if (!posts || posts.length === 0) {
    return <div className='text-white'>No posts available.</div>
  }

  return (
    <main className='pb-nav w-[clamp(320px,100%,700px)] gap-y-[20px] p-[clamp(5px,3%,10px)] items-center flex flex-col min-h-screen'>
      {posts.map(post => (
        <PostDisplay key={post.id} post={post} />
      ))}
      <Nav />
    </main>
  )
}
