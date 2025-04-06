import { Routes, Route } from 'react-router'
import { lazy } from 'react'
import { useSettings } from './hooks/useSettings'
import { MODALS } from './constants/MODALS'
import { PATHS } from './constants/PATHS'

const LazyHome = lazy(() => import(PATHS.homeElement))
const LazyLogin = lazy(() => import(PATHS.loginElement))
const LazySearch = lazy(() => import(PATHS.searchElement))
const LazyCreate = lazy(() => import(PATHS.createElement))
const LazyAccount = lazy(() => import(PATHS.accountElement))
const LazyTerms = lazy(() => import(PATHS.termsElement))
const LazySettings = lazy(() => import(PATHS.settingsElement))
const LazyRegister = lazy(() => import(PATHS.registerElement))

export default function App () {
  const { activeModal } = useSettings()

  return (
    <>
      {activeModal.name && MODALS[activeModal.name]}

      <Routes>
        <Route path={PATHS.homeSection} element={<LazyHome />} />
        <Route path={PATHS.registerSection} element={<LazyRegister />} />
        <Route path={PATHS.loginSection} element={<LazyLogin />} />
        <Route path={PATHS.searchSection} element={<LazySearch />} />
        <Route path={PATHS.createSection} element={<LazyCreate />} />
        <Route path={PATHS.accountIdSection} element={<LazyAccount />} />
        <Route path={PATHS.accountSection} element={<LazyAccount />} />
        <Route path={PATHS.settingsSection} element={<LazySettings />} />
        <Route path={PATHS.termsSection} element={<LazyTerms />} />
      </Routes>
    </>
  )
}
