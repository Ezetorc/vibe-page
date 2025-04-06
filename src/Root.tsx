import { useState, useEffect, Suspense } from 'react'
import { HashRouter as Router } from 'react-router'
import App from './App'
import { Loading } from './components/Loading'
import { useSettings } from './hooks/useSettings'
import { useUser } from './hooks/useUser'
import eruda from 'eruda'

export function Root () {
  const { loadDictionaries, dictionaries } = useSettings()
  const [loading, setLoading] = useState(true)
  const { handleSession } = useUser()

  useEffect(() => {
    eruda.init()

    const initApp = async () => {
      await Promise.all([loadDictionaries(), handleSession()])

      setLoading(false)
    }

    initApp()
  }, [handleSession, loadDictionaries])

  const dictionariesAreReady = Object.keys(dictionaries ?? {}).length > 0

  if (loading || !dictionariesAreReady) {
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
