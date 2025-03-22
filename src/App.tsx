import { Routes, Route } from 'react-router'
import { lazy } from 'react'
import { useSettings } from './hooks/useSettings.ts'
import { SessionModal } from './components/SessionModal.tsx'
import { InvalidEditModal } from './pages/Account/components/InvalidEditModal.tsx'
import { ChangeEmailModal } from './pages/Settings/components/ChangeEmailModal.tsx'
import { ChangeLanguageModal } from './pages/Settings/components/ChangeLanguageModal.tsx'
import { ConnectionModal } from './components/ConnectionModal.tsx'
import { ChangePasswordModal } from './pages/Settings/components/ChangePasswordModal.tsx'
import { CommentModal } from './components/Comments/CommentModal.tsx'
import { LogoutModal } from './pages/Settings/components/LogoutModal.tsx'
import { ModalName } from './models/ModalName.ts'
import { DeleteAccountModal } from './pages/Settings/components/DeleteAccountModal.tsx'

const LazyHome = lazy(() => import('./pages/Home/components/Home.tsx'))
const LazyLogin = lazy(() => import('./pages/Login/components/Login.tsx'))
const LazySearch = lazy(() => import('./pages/Search/components/Search.tsx'))
const LazyCreate = lazy(() => import('./pages/Create/components/Create.tsx'))
const LazyAccount = lazy(() => import('./pages/Account/components/Account.tsx'))
const LazyTerms = lazy(() => import('./pages/Terms/components/Terms.tsx'))
const LazySettings = lazy(
  () => import('./pages/Settings/components/Settings.tsx')
)
const LazyRegister = lazy(
  () => import('./pages/Register/components/Register.tsx')
)

export default function App () {
  const { visibleModal } = useSettings()
  const modals: { [key in ModalName]: JSX.Element } = {
    session: <SessionModal />,
    language: <ChangeLanguageModal />,
    email: <ChangeEmailModal />,
    edit: <InvalidEditModal />,
    connection: <ConnectionModal />,
    password: <ChangePasswordModal />,
    comment: <CommentModal />,
    logout: <LogoutModal />,
    deleteAccount: <DeleteAccountModal />
  }

  return (
    <>
      {visibleModal.name && modals[visibleModal.name]}
      <Routes>
        <Route path='/' element={<LazyHome />} />
        <Route path='/register' element={<LazyRegister />} />
        <Route path='/login' element={<LazyLogin />} />
        <Route path='/search' element={<LazySearch />} />
        <Route path='/create' element={<LazyCreate />} />
        <Route path='/account/:username' element={<LazyAccount />} />
        <Route path='/settings' element={<LazySettings />} />
        <Route path='/terms' element={<LazyTerms />} />
      </Routes>
    </>
  )
}
