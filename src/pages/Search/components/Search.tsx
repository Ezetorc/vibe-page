import { useState } from 'react'
import { Nav } from '../../../components/Nav'
import { Post } from '../../../models/Post'
import { User } from '../../../models/User'
import { SearchBar } from '../../../components/SearchBar'
import { useSettings } from '../../../hooks/useSettings'
import { Section } from '../../../components/Section'
import { PostsDisplay } from '../../../components/PostsDisplay'
import { UsersDisplay } from '../../../components/UsersDisplay'
import { ToSearchButton } from './ToSearchButton'
import { PostService } from '../../../services/PostService'
import { UserService } from '../../../services/UserService'
import { getInMinus } from '../../../utilities/getInMinus'

export default function Search () {
  const { dictionary } = useSettings()
  const [toSearch, setToSearch] = useState<'users' | 'posts'>('posts')
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<User[]>([])

  const handleSearch = async (query: string) => {
    if (query.trim() === '') {
      const allPosts: Post[] = await PostService.getAll()
      setPosts(allPosts)

      const allUsers: User[] = await UserService.getAll()
      setUsers(allUsers)
      return
    }

    try {
      if (toSearch === 'posts') {
        const newPosts = await PostService.search({ query })

        setPosts(newPosts)
      } else {
        const newUsers = await UserService.search({ query })

        setUsers(newUsers)
      }
    } catch (error) {
      console.error('Error fetching search results:', error)
    }
  }

  const handlePostDelete = (postId: number) => {
    const newPosts: Post[] = posts.filter(post => post.id !== postId)

    setPosts(newPosts)
  }

  return (
    <Section className='pb-nav w-[clamp(320px,100%,700px)] gap-y-[20px] p-[clamp(5px,3%,10px)] items-center flex flex-col min-h-screen'>
      <header className='w-full h-[40px] grid grid-cols-2'>
        <ToSearchButton
          text={dictionary.posts}
          type='posts'
          onClick={() => setToSearch('posts')}
          toSearch={toSearch}
        />

        <ToSearchButton
          text={dictionary.users}
          type='users'
          onClick={() => setToSearch('users')}
          toSearch={toSearch}
        />
      </header>

      <SearchBar
        onSearch={handleSearch}
        placeholder={`${dictionary.search} ${getInMinus(
          dictionary[toSearch]
        )}...`}
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
