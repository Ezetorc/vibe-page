import { useState, useEffect, Suspense } from 'react'
import { HashRouter as Router } from 'react-router'
import App from '../App'
import { getSettingsStore } from '../stores/getSettingsStore'
import { Loading } from './Loading'

export function Root () {
  const { loadDictionaries, dictionaries } = getSettingsStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDictionaries().then(() => setLoading(false))
  }, [loadDictionaries])

  if (loading || dictionaries === null) {
    return <Loading />
  }

  return (
    <Suspense fallback={<Loading />}>
      <Router>
        <App />
      </Router>
    </Suspense>
  )
}
