import { Routes, HashRouter as Router, Route } from 'react-router'
import { lazy, Suspense, useEffect } from 'react'
import { useUser } from './hooks/useUser.ts'
import { useSettings } from './hooks/useSettings.ts'
import { SessionModal } from './components/SessionModal.tsx'

const LazyHome = lazy(() => import('./pages/Home/components/Home.tsx'))
const LazyLogin = lazy(() => import('./pages/Login/components/Login.tsx'))
const LazySearch = lazy(() => import('./pages/Search/components/Search.tsx'))
const LazyCreate = lazy(() => import('./pages/Create/components/Create.tsx'))
const LazyAccount = lazy(() => import('./pages/Account/components/Account.tsx'))
const LazyRegister = lazy(
  () => import('./pages/Register/components/Register.tsx')
)

export default function App () {
  const { sessionModalVisible } = useSettings()
  const { handleToken } = useUser()

  useEffect(() => {
    handleToken()
  }, [handleToken])

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Router>
          {sessionModalVisible && <SessionModal />}

          <Routes>
            <Route path='/' element={<LazyHome />} />
            <Route path='/register' element={<LazyRegister />} />
            <Route path='/login' element={<LazyLogin />} />
            <Route path='/search' element={<LazySearch />} />
            <Route path='/create' element={<LazyCreate />} />
            <Route path='/account' element={<LazyAccount />} />
          </Routes>
        </Router>
      </Suspense>
    </>
  )
}
