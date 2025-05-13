import { MouseEvent, useState } from 'react'
import { SearchBar } from '../../../components/SearchBar'
import { useSettings } from '../../../hooks/useSettings'
import { Section } from '../../../components/Section'
import { ToSearchButton } from './ToSearchButton'
import { SearchPosts } from './SearchPosts'
import { SearchUsers } from './SearchUsers'
import { ToSearch } from '../models/ToSearch'

export default function Search () {
  const { dictionary } = useSettings()
  const [toSearch, setToSearch] = useState<ToSearch>('posts')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const searchBarPlaceholder = `${dictionary.search} ${dictionary[
    toSearch
  ]?.toLowerCase()}...`

  const changeToSearch = (event: MouseEvent<HTMLButtonElement>) => {
    const button = event.target as HTMLButtonElement
    const newToSearch = button.dataset.type as ToSearch

    setToSearch(newToSearch)
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

      <SearchBar onSearch={setSearchQuery} placeholder={searchBarPlaceholder} />

      {toSearch === 'posts' ? (
        <SearchPosts searchQuery={searchQuery} />
      ) : (
        <SearchUsers searchQuery={searchQuery} />
      )}
    </Section>
  )
}
