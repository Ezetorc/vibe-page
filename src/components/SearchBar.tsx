import { useState, FormEvent } from 'react'
import { useDebounce } from '../hooks/useDebounce'

export function SearchBar (props: {
  onSearch: (query: string) => void
  placeholder?: string
}) {
  const [search, setSearch] = useState<string>('')
  const debouncedSearch = useDebounce(
    typeof props.onSearch === 'function' ? props.onSearch : () => {}
  )

  const onInput = (event: FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value

    setSearch(value)
    debouncedSearch(value)
  }

  return (
    <input
      onInput={onInput}
      value={search}
      name='Search Bar'
      placeholder={props.placeholder}
      className='bg-transparent outline-hidden placeholder:text-caribbean-current w-full h-[45px] border-vibe border-caribbean-current rounded-vibe px-[2%]'
    />
  )
}
