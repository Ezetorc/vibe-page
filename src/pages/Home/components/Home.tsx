import { useEffect, useState } from 'react'
import { PostDisplay } from '../../../components/PostDisplay'
import { Post } from '../../../models/Post'
import { Nav } from '../../../components/Nav'
import { useSettings } from '../../../hooks/useSettings'

export default function Home () {
  const { dictionary } = useSettings()
  const [posts, setPosts] = useState<Post[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const handlePostDelete = (postId: number) => {
    if (!posts) return
    
    const newPosts: Post[] = posts?.filter(post => post.id !== postId)

    setPosts(newPosts)
  }

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

  return (
    <main className='pb-nav w-[clamp(320px,100%,700px)] gap-y-[20px] p-[clamp(5px,3%,10px)] items-center flex flex-col min-h-screen'>
      {loading && (
        <div className='text-white'>{`${dictionary.loading?.value} ${dictionary.posts?.inMinus}`}</div>
      )}

      {(!posts || posts.length === 0) && (
        <div className='text-white'>{dictionary.noPostsYet?.value}</div>
      )}

      {posts?.map(post => (
        <PostDisplay onDelete={handlePostDelete} key={post.id} post={post} />
      ))}

      <Nav />
    </main>
  )
}
