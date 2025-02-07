import { useState, useEffect } from 'react'
import App from '../App'
import { getSettingsStore } from '../stores/getSettingsStore'

export function Root () {
  const { loadDictionaries, dictionaries } = getSettingsStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDictionaries().then(() => setLoading(false))
  }, [loadDictionaries])

  if (loading || !dictionaries) {
    return <div>Loading...</div>
  }

  return <App />
}
