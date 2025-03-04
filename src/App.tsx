import { Routes, HashRouter as Router, Route } from 'react-router'
import { lazy, Suspense, useEffect } from 'react'
import { useUser } from './hooks/useUser.ts'
import { useSettings } from './hooks/useSettings.ts'
import { SessionModal } from './components/SessionModal.tsx'
import { InvalidEditModal } from './pages/Account/components/InvalidEditModal.tsx'
import { ChangeEmailModal } from './pages/Settings/components/ChangeEmailModal.tsx'
import { ChangeLanguageModal } from './pages/Settings/components/ChangeLanguageModal.tsx'
import { ConnectionModal } from './components/ConnectionModal.tsx'
import { Loading } from './components/Loading.tsx'
import { ChangePasswordModal } from './pages/Settings/components/ChangePasswordModal.tsx'
import { CommentModal } from './components/Comments/CommentModal.tsx'
import { UserService } from './services/UserService.ts'

const LazyHome = lazy(() => import('./pages/Home/components/Home.tsx'))
const LazyLogin = lazy(() => import('./pages/Login/components/Login.tsx'))
const LazySearch = lazy(() => import('./pages/Search/components/Search.tsx'))
const LazyCreate = lazy(() => import('./pages/Create/components/Create.tsx'))
const LazyAccount = lazy(() => import('./pages/Account/components/Account.tsx'))
const LazySettings = lazy(
  () => import('./pages/Settings/components/Settings.tsx')
)
const LazyRegister = lazy(
  () => import('./pages/Register/components/Register.tsx')
)

export default function App () {
  const { visibleModal } = useSettings()
  const { handleSession } = useUser()
  const modals = {
    session: <SessionModal />,
    language: <ChangeLanguageModal />,
    email: <ChangeEmailModal />,
    edit: <InvalidEditModal />,
    connection: <ConnectionModal />,
    password: <ChangePasswordModal />,
    comment: <CommentModal />
  }

  useEffect(() => {
    handleSession()
  }, [handleSession])

  const getUsers = async () => {
    const users = await UserService.getAll()
    console.log('USERS: ', users)
  }

  getUsers()

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Router>
          {visibleModal.name && modals[visibleModal.name]}
          <Routes>
            <Route path='/' element={<LazyHome />} />
            <Route path='/register' element={<LazyRegister />} />
            <Route path='/login' element={<LazyLogin />} />
            <Route path='/search' element={<LazySearch />} />
            <Route path='/create' element={<LazyCreate />} />
            <Route path='/account/:username' element={<LazyAccount />} />
            <Route path='/settings' element={<LazySettings />} />
          </Routes>
        </Router>
      </Suspense>
    </>
  )
}
