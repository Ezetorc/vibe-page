import { useEffect, useState } from 'react'
import { Nav } from '../../../components/Nav'
import { Post } from '../../../models/Post'
import { PostDisplay } from '../../../components/PostDisplay'
import { User } from '../../../models/User'
import { UserDisplay } from '../../../components/UserDisplay'
import clsx from 'clsx'
import { useDebounce } from '../../../hooks/useDebounce'
import { SearchBar } from '../../../components/SearchBar'

export default function Search () {
  const [toSearch, setToSearch] = useState<'users' | 'posts'>('users')
  const [search, setSearch] = useState<string>('')
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<User[]>([])
  const debouncedSearch = useDebounce(search, 200)

  useEffect(() => {
    const fetchData = async () => {
      if (debouncedSearch.trim() === '') return

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
    <section className='pb-nav w-[clamp(320px,100%,700px)] gap-y-[20px] p-[clamp(5px,3%,10px)] items-center flex flex-col min-h-screen'>
      <SearchBar
        onInput={event => setSearch(event.currentTarget.value)}
        placeholder={`Search ${toSearch}...`}
      />
      <header className='w-full h-[40px] grid grid-cols-2'>
        <button
          className={`${clsx([
            {
              'border-b-orange-crayola text-orange-crayola':
                toSearch === 'posts'
            },
            {
              'border-b-caribbean-current text-verdigris': toSearch !== 'posts'
            }
          ])} font-poppins-semibold border-b-vibe `}
          onClick={() => setToSearch('posts')}
        >
          Posts
        </button>
        <button
          className={`${clsx([
            {
              'border-b-orange-crayola text-orange-crayola':
                toSearch === 'users'
            },
            {
              'border-b-caribbean-current text-verdigris': toSearch !== 'users'
            }
          ])} font-poppins-semibold border-b-vibe `}
          onClick={() => setToSearch('users')}
        >
          Users
        </button>
      </header>

      {toSearch === 'posts' ? (
        <>
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
        </>
      ) : (
        <>
          {users.length === 0 ? (
            <span className='font-poppins-light text-verdigris text-[clamp(10px,5vw,20px)]'>
              Search to see results
            </span>
          ) : (
            <div className='w-full flex flex-col items-center gap-y-[20px]'>
              {users.map(user => (
                <UserDisplay key={user.id} user={user} />
              ))}
            </div>
          )}
        </>
      )}

      <Nav />
    </section>
  )
}
