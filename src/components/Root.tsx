import { useState, useEffect, Suspense } from 'react'
import { HashRouter as Router } from 'react-router'
import App from '../App'
import { Loading } from './Loading'
import { useSettings } from '../hooks/useSettings'
import { useUser } from '../hooks/useUser'

export function Root () {
  const { loadDictionaries, dictionaries } = useSettings()
  const [loading, setLoading] = useState(true)
  const { handleSession } = useUser()

  useEffect(() => {
    const handleThings = async () => {
      const [sessionSuccess, dictionariesLoaded] = await Promise.all([
        handleSession(),
        loadDictionaries()
      ])

      if (sessionSuccess && dictionariesLoaded) {
        setLoading(false)
      }
    }

    handleThings()
  }, [handleSession, loadDictionaries])

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
