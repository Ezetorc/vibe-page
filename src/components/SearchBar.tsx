import { useState, FormEvent, useEffect } from "react"
import { useDebounce } from "../hooks/useDebounce"
import { SearchBarProps } from "../models/SearchBarProps"

export function SearchBar({ onSearch, placeholder }: SearchBarProps) {
  const [search, setSearch] = useState<string>('')
  const debouncedSearch = useDebounce(search, 200)

  const onInput = (event: FormEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value)
  }

  useEffect(() => {
    onSearch(debouncedSearch) 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  return (
    <input
      onInput={onInput}
      placeholder={placeholder}
      className="bg-transparent font-poppins-regular outline-none placeholder:text-caribbean-current w-full h-[45px] border-vibe border-caribbean-current rounded-vibe px-[2%]"
    />
  )
}
