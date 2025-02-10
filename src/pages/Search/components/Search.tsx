import { useEffect, useState } from 'react'
import { Nav } from '../../../components/Nav'
import { Post } from '../../../models/Post'
import { User } from '../../../models/User'
import { useDebounce } from '../../../hooks/useDebounce'
import { SearchBar } from '../../../components/SearchBar'
import { useSettings } from '../../../hooks/useSettings'
import { Section } from '../../../components/Section'
import { PostsDisplay } from '../../../components/PostsDisplay'
import { UsersDisplay } from '../../../components/UsersDisplay'
import { ToSearchButton } from './ToSearchButton'

export default function Search () {
  const { dictionary } = useSettings()
  const [toSearch, setToSearch] = useState<'users' | 'posts'>('users')
  const [search, setSearch] = useState<string>('')
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<User[]>([])
  const debouncedSearch = useDebounce(search, 200)

  const handlePostDelete = (postId: number) => {
    const newPosts: Post[] = posts.filter(post => post.id !== postId)

    setPosts(newPosts)
  }

  useEffect(() => {
    const fetchData = async () => {
      if (debouncedSearch.trim() === '') {
        const allPosts: Post[] = await Post.getAll()
        const allUsers: User[] = await User.getAll()

        setPosts(allPosts)
        setUsers(allUsers)
        return
      }

      try {
        if (toSearch === 'posts') {
          const newPosts = await Post.search(debouncedSearch)
          setPosts(newPosts)
        } else {
          const newUsers = await User.search(debouncedSearch)
          setUsers(newUsers)
        }
      } catch (error) {
        console.error('Error fetching search results:', error)
      }
    }

    fetchData()
  }, [toSearch, debouncedSearch])

  return (
    <Section className='pb-nav w-[clamp(320px,100%,700px)] gap-y-[20px] p-[clamp(5px,3%,10px)] items-center flex flex-col min-h-screen'>
      <header className='w-full h-[40px] grid grid-cols-2'>
        <ToSearchButton
          text={dictionary.posts?.value}
          type='posts'
          onClick={() => setToSearch('posts')}
          toSearch={toSearch}
        />

        <ToSearchButton
          text={dictionary.users?.value}
          type='users'
          onClick={() => setToSearch('users')}
          toSearch={toSearch}
        />
      </header>

      <SearchBar
        onInput={event => setSearch(event.currentTarget.value)}
        placeholder={`${dictionary.search} ${dictionary[toSearch]?.inMinus}...`}
      />

      {toSearch === 'posts' ? (
        <PostsDisplay posts={posts} onPostDelete={handlePostDelete} />
      ) : (
        <UsersDisplay users={users} />
      )}

      <Nav />
    </Section>
  )
}
