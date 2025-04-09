import { Route, Switch } from 'wouter'
import { lazy } from 'react'
import { PATHS } from './constants/PATHS'
import { ModalRenderer } from './components/ModalRenderer.tsx'

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
  return (
    <>
      <ModalRenderer />

      <Route path={PATHS.homeSection} component={LazyHome} />
      <Route path={PATHS.registerSection} component={LazyRegister} />
      <Route path={PATHS.loginSection} component={LazyLogin} />
      <Route path={PATHS.searchSection} component={LazySearch} />
      <Route path={PATHS.createSection} component={LazyCreate} />
      <Route path={PATHS.settingsSection} component={LazySettings} />
      <Route path={PATHS.termsSection} component={LazyTerms} />

      <Switch>
        <Route path={PATHS.accountSection}>
          <LazyAccount />
        </Route>
        <Route path={PATHS.accountIdSection}>
          {(params: { userId?: string }) => (
            <LazyAccount userId={params.userId} />
          )}
        </Route>
      </Switch>
    </>
  )
}
