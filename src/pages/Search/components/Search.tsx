import { MouseEvent, useState } from 'react'
import { Nav } from '../../../components/Nav'
import { SearchBar } from '../../../components/SearchBar'
import { useSettings } from '../../../hooks/useSettings'
import { Section } from '../../../components/Section'
import { PostsDisplay } from '../../../components/Posts/PostsDisplay'
import { UsersDisplay } from '../../../components/UsersDisplay'
import { ToSearchButton } from './ToSearchButton'
import { getInMinus } from '../../../utilities/getInMinus'
import { usePosts } from '../../../hooks/usePosts'
import { useUsers } from '../hooks/useUsers'
import { LoadSpinner } from '../../../components/LoadSpinner'

export default function Search () {
  const { dictionary } = useSettings()
  const [toSearch, setToSearch] = useState<'users' | 'posts'>('posts')
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined)
  const posts = usePosts(searchQuery)
  const users = useUsers(searchQuery)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const changeToSearch = (event: MouseEvent<HTMLButtonElement>) => {
    const type = (event.target as HTMLButtonElement).dataset.type as
      | 'posts'
      | 'users'

    setToSearch(type)
  }

  return (
    <Section className='pb-nav w-[clamp(320px,100%,700px)] gap-y-[20px] p-[clamp(5px,3%,10px)] items-center flex flex-col min-h-screen'>
      <header className='w-full h-[40px] grid grid-cols-2'>
        <ToSearchButton
          type='posts'
          onClick={changeToSearch}
          toSearch={toSearch}
        />
        <ToSearchButton
          type='users'
          onClick={changeToSearch}
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
        <PostsDisplay posts={posts.data} onPostDelete={posts.delete} />
      ) : (
        <UsersDisplay users={users.data} />
      )}

      {toSearch === 'posts' && posts.hasNextPage && (
        <LoadSpinner reference={posts.ref} />
      )}

      {toSearch === 'users' && users.hasNextPage && (
        <LoadSpinner reference={users.ref} />
      )}

      <Nav />
    </Section>
  )
}
