import { useState, useEffect } from 'react'
import App from '../App'
import { getSettingsStore } from '../stores/getSettingsStore'
import { Loading } from './Loading'

export function Root () {
  const { loadDictionaries, dictionaries } = getSettingsStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDictionaries().then(() => setLoading(false))
  }, [loadDictionaries])

  if (loading || !dictionaries) {
    return <Loading />
  }

  return <App />
}
