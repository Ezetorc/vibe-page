import { useSettings } from '../hooks/useSettings'

export function Loading () {
  const { dictionary } = useSettings()

  return <h3>{dictionary.loading?.value}</h3>
}
