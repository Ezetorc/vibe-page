import { useCallback, useEffect, useState } from 'react'
import { Post } from '../../../models/Post'
import { Nav } from '../../../components/Nav'
import { PostsDisplay } from '../../../components/PostsDisplay'
import { PostService } from '../../../services/PostService'
import { Loading } from '../../../components/Loading'
import { useSettings } from '../../../hooks/useSettings'

export default function Home () {
  const { setVisibleModal } = useSettings()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const handlePostDelete = (postId: number) => {
    const newPosts: Post[] = posts.filter(post => post.id !== postId)

    setPosts(newPosts)
  }

  const handlePosts = useCallback(async () => {
    const allPosts = await PostService.getAll()

    if (!allPosts.value) {
      setVisibleModal({
        name: 'connection'
      })
      return
    }

    setPosts(allPosts.value)
    setLoading(false)
  }, [setVisibleModal])

  useEffect(() => {
    handlePosts()
  }, [handlePosts])

  return (
    <main className='pb-nav w-[clamp(320px,100%,700px)] gap-y-[20px] p-[clamp(5px,3%,10px)] items-center flex flex-col min-h-screen'>
      {loading ? (
        <Loading />
      ) : (
        <PostsDisplay posts={posts} onPostDelete={handlePostDelete} />
      )}

      <Nav />
    </main>
  )
}
