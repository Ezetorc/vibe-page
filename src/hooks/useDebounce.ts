import { useRef } from 'react'

export function useDebounce(
  callback: (value: string) => void,
  delay: number = 200
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  return (value: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      callback(value)
    }, delay)
  }
}
