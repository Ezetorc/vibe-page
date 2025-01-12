import { FormEvent, useEffect, useState } from 'react'
import { Nav } from '../../../components/Nav'
import { SearchBar } from '../../../components/SearchBar'
import { UserDisplay } from '../../../components/UserDisplay'
import { useUser } from '../../../hooks/useUser'
import { Post } from '../../../models/Post'
import { PostDisplay } from '../../../components/PostDisplay'
import { useDebounce } from '../../../hooks/useDebounce'

export default function Account () {
  const { user } = useUser()
  const [posts, setPosts] = useState<Post[]>([])
  const [search, setSearch] = useState<string>('')
  const debouncedSearch = useDebounce(search, 200)

  useEffect(() => {
    const fetchData = async () => {
      if (debouncedSearch.trim() === '') return

      try {
        const newPosts = await Post.search(debouncedSearch)
        setPosts(newPosts)
      } catch (error) {
        console.error('Error fetching search results:', error)
      }
    }

    fetchData()
  }, [debouncedSearch])

  if (!user) return

  const handleSearch = (event: FormEvent<HTMLInputElement>): void => {
    const search: string = event.currentTarget.value
    setSearch(search)
  }

  return (
    <section className='pb-nav w-[clamp(320px,100%,700px)] gap-y-[20px] p-[clamp(5px,3%,10px)] items-center flex flex-col min-h-screen'>
      <UserDisplay user={user} />
      <SearchBar onInput={handleSearch} placeholder='Search my posts...' />

      {posts.length === 0 ? (
        <span className='font-poppins-light text-verdigris text-[clamp(10px,5vw,20px)]'>
          Search to see results
        </span>
      ) : (
        <div className='w-full flex flex-col items-center gap-y-[20px]'>
          {posts.map(post => (
            <PostDisplay key={post.id} post={post} />
          ))}
        </div>
      )}
      <Nav />
    </section>
  )
}
