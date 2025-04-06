import { useState, FormEvent, useEffect } from 'react'
import { useDebounce } from '../hooks/useDebounce'

export function SearchBar (props: {
  onSearch: (query: string) => void
  placeholder: string
}) {
  const [search, setSearch] = useState<string>('')
  const debouncedSearch = useDebounce({ value: search, delay: 200 })

  const onInput = (event: FormEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value)
  }

  useEffect(() => {
    props.onSearch(debouncedSearch)
  }, [debouncedSearch, props])

  return (
    <input
      onInput={onInput}
      name='Search Bar'
      placeholder={props.placeholder}
      className='bg-transparent  outline-hidden placeholder:text-caribbean-current w-full h-[45px] border-vibe border-caribbean-current rounded-vibe px-[2%]'
    />
  )
}
