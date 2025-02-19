import { useState } from 'react'
import { Nav } from '../../../components/Nav'
import { Post } from '../../../models/Post'
import { User } from '../../../models/User'
import { SearchBar } from '../../../components/SearchBar'
import { useSettings } from '../../../hooks/useSettings'
import { Section } from '../../../components/Section'
import { PostsDisplay } from '../../../components/Posts/PostsDisplay'
import { UsersDisplay } from '../../../components/UsersDisplay'
import { ToSearchButton } from './ToSearchButton'
import { PostService } from '../../../services/PostService'
import { UserService } from '../../../services/UserService'
import { getInMinus } from '../../../utilities/getInMinus'

export default function Search () {
  const { dictionary, setVisibleModal } = useSettings()
  const [toSearch, setToSearch] = useState<'users' | 'posts'>('posts')
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<User[]>([])

  const showAllPosts = async () => {
    const allPosts = await PostService.getAll()

    if (!allPosts.value) {
      setVisibleModal({
        name: 'connection'
      })
    } else {
      setPosts(allPosts.value)
    }
  }

  const showAllUsers = async () => {
    const allUsers = await UserService.getAll()

    if (!allUsers.value) {
      setVisibleModal({
        name: 'connection'
      })
    } else {
      setUsers(allUsers.value)
    }
  }

  const showSearchedPosts = async (query: string) => {
    const searchedPosts = await PostService.search({ query })

    if (!searchedPosts.value) {
      setVisibleModal({
        name: 'connection'
      })
    } else {
      setPosts(searchedPosts.value)
    }
  }

  const showSearchedUsers = async (query: string) => {
    const searchedUsers = await UserService.search({ query })

    if (!searchedUsers.value) {
      setVisibleModal({
        name: 'connection'
      })
    } else {
      setUsers(searchedUsers.value)
    }
  }

  const handleSearch = async (query: string) => {
    if (query.trim() === '') {
      showAllPosts()
      showAllUsers()

      return
    }

    if (toSearch === 'posts') {
      showSearchedPosts(query)
    } else {
      showSearchedUsers(query)
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
