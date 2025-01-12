import { SearchBarProps } from '../models/SearchBarProps'

export function SearchBar ({ onInput, placeholder }: SearchBarProps) {
  return (
    <input
      onInput={onInput}
      placeholder={placeholder}
      className='bg-transparent font-poppins-regular outline-none placeholder:text-caribbean-current w-full h-[45px] border-vibe border-caribbean-current rounded-vibe px-[2%]'
    />
  )
}
