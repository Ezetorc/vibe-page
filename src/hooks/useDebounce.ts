import { useEffect, useState } from 'react'

export function useDebounce<T> ({
  value,
  delay = 500
}: {
  value: T
  delay: number
}) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timeout)
  }, [value, delay])

  return debouncedValue
}
