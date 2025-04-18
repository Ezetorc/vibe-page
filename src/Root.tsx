import { useState, useEffect, Suspense } from 'react'
import App from './App'
import { Loading } from './components/Loading'
import { useSettings } from './hooks/useSettings'
import { useSession } from './hooks/useSession'

export function Root () {
  const { loadDictionaries } = useSettings()
  const [loading, setLoading] = useState(true)
  const { handleSession } = useSession()

  const initApp = async () => {
    const [dictionariesLoaded] = await Promise.all([
      loadDictionaries(),
      handleSession()
    ])

    if (dictionariesLoaded) {
      setLoading(false)
    }
  }

  useEffect(() => {
    initApp()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <Suspense fallback={<Loading />}>
      <App />
    </Suspense>
  )
}
