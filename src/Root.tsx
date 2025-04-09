import { useState, useEffect, Suspense } from 'react'
import App from './App'
import { Loading } from './components/Loading'
import { useSettings } from './hooks/useSettings'
import eruda from 'eruda'
import { useLoggedUser } from './hooks/useLoggedUser'

export function Root () {
  const { loadDictionaries, dictionaries } = useSettings()
  const [loading, setLoading] = useState(true)
  const { handleSession } = useLoggedUser()

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
      <App />
    </Suspense>
  )
}
