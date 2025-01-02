import { Routes, HashRouter as Router, Route } from 'react-router'
import { lazy, Suspense } from 'react'

const LazyHome = lazy(() => import('./pages/Home/components/Home.tsx'))
const LazyRegister = lazy(
  () => import('./pages/Register/components/Register.tsx')
)
const LazyLogin = lazy(() => import('./pages/Login/components/Login.tsx'))

export default function App () {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Router>
          <Routes>
            <Route path='/' element={<LazyHome />} />
            <Route path='/register' element={<LazyRegister />} />
            <Route path='/login' element={<LazyLogin />} />
          </Routes>
        </Router>
      </Suspense>
    </>
  )
}
